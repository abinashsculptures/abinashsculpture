import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface CartLine {
  id: string;
  product_id: string;
  variant_name: string | null;
  quantity: number;
  title: string;
  image: string | null;
  price: number | null;
}

interface GuestLine {
  product_id: string;
  variant_name: string | null;
  quantity: number;
}

const GUEST_KEY = 'as_guest_cart';

const readGuest = (): GuestLine[] => {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeGuest = (lines: GuestLine[]) => {
  localStorage.setItem(GUEST_KEY, JSON.stringify(lines));
};

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  loading: boolean;
  addItem: (args: { product_id: string; variant_name?: string | null; quantity?: number }) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue>({} as CartContextValue);

const variantPrice = (product: any, variantName: string | null): number | null => {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  if (variantName) {
    const found = variants.find((v: any) => v?.size === variantName);
    if (found && found.price !== null && found.price !== undefined && found.price !== '') {
      return Number(found.price);
    }
  }
  if (product?.price !== null && product?.price !== undefined) return Number(product.price);
  const prices = variants
    .map((v: any) => (v?.price === null || v?.price === undefined || v?.price === '' ? null : Number(v.price)))
    .filter((p: number | null) => p !== null) as number[];
  return prices.length ? Math.min(...prices) : null;
};

const productImage = (product: any, variantName: string | null): string | null => {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const found = variantName ? variants.find((v: any) => v?.size === variantName) : null;
  if (found && Array.isArray(found.images) && found.images[0]) return found.images[0];
  if (Array.isArray(product?.images) && product.images[0]) return product.images[0];
  return product?.image ?? null;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(false);

  const hydrate = useCallback(
    async (raw: { id: string; product_id: string; variant_name: string | null; quantity: number }[]) => {
      if (raw.length === 0) return [];
      const ids = Array.from(new Set(raw.map(r => r.product_id)));
      const { data: products } = await supabase
        .from('products')
        .select('id, title, image, images, price, variants, availability')
        .in('id', ids);
      const byId = new Map((products || []).map((p: any) => [p.id, p]));
      return raw
        .filter(r => byId.has(r.product_id))
        .map(r => {
          const p = byId.get(r.product_id);
          return {
            id: r.id,
            product_id: r.product_id,
            variant_name: r.variant_name,
            quantity: r.quantity,
            title: p.title,
            image: productImage(p, r.variant_name),
            price: variantPrice(p, r.variant_name),
          } as CartLine;
        });
    },
    []
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      if (user) {
        const { data } = await supabase
          .from('cart_items')
          .select('id, product_id, variant_name, quantity')
          .order('created_at', { ascending: true });
        setLines(await hydrate((data as any) || []));
      } else {
        const guest = readGuest();
        setLines(
          await hydrate(
            guest.map(g => ({
              id: `${g.product_id}::${g.variant_name ?? ''}`,
              product_id: g.product_id,
              variant_name: g.variant_name,
              quantity: g.quantity,
            }))
          )
        );
      }
    } finally {
      setLoading(false);
    }
  }, [user, hydrate]);

  // merge guest cart into account on login
  useEffect(() => {
    if (authLoading) return;
    const run = async () => {
      if (user) {
        const guest = readGuest();
        if (guest.length > 0) {
          for (const g of guest) {
            const { data: existing } = await supabase
              .from('cart_items')
              .select('id, quantity')
              .eq('product_id', g.product_id)
              .eq('user_id', user.id)
              .is('variant_id', null);
            const match = (existing || []).find((e: any) => true);
            if (match) {
              await supabase
                .from('cart_items')
                .update({ quantity: match.quantity + g.quantity })
                .eq('id', match.id);
            } else {
              await supabase.from('cart_items').insert({
                user_id: user.id,
                product_id: g.product_id,
                variant_name: g.variant_name,
                quantity: g.quantity,
              });
            }
          }
          writeGuest([]);
        }
      }
      await refresh();
    };
    run();
  }, [user, authLoading, refresh]);

  const addItem: CartContextValue['addItem'] = async ({ product_id, variant_name = null, quantity = 1 }) => {
    if (user) {
      const existing = lines.find(l => l.product_id === product_id && l.variant_name === variant_name);
      if (existing) {
        await supabase.from('cart_items').update({ quantity: existing.quantity + quantity }).eq('id', existing.id);
      } else {
        await supabase.from('cart_items').insert({ user_id: user.id, product_id, variant_name, quantity });
      }
    } else {
      const guest = readGuest();
      const idx = guest.findIndex(g => g.product_id === product_id && g.variant_name === variant_name);
      if (idx >= 0) guest[idx].quantity += quantity;
      else guest.push({ product_id, variant_name, quantity });
      writeGuest(guest);
    }
    await refresh();
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return removeItem(id);
    if (user) {
      await supabase.from('cart_items').update({ quantity }).eq('id', id);
    } else {
      const line = lines.find(l => l.id === id);
      if (!line) return;
      const guest = readGuest().map(g =>
        g.product_id === line.product_id && g.variant_name === line.variant_name ? { ...g, quantity } : g
      );
      writeGuest(guest);
    }
    await refresh();
  };

  const removeItem = async (id: string) => {
    if (user) {
      await supabase.from('cart_items').delete().eq('id', id);
    } else {
      const line = lines.find(l => l.id === id);
      if (!line) return;
      writeGuest(readGuest().filter(g => !(g.product_id === line.product_id && g.variant_name === line.variant_name)));
    }
    await refresh();
  };

  const clearCart = async () => {
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id);
    } else {
      writeGuest([]);
    }
    await refresh();
  };

  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((n, l) => n + (l.price ?? 0) * l.quantity, 0);

  return (
    <CartContext.Provider value={{ lines, count, subtotal, loading, addItem, updateQuantity, removeItem, clearCart, refresh }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
