import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Trash2, LogOut } from 'lucide-react';

interface OrderRow {
  id: string;
  order_number: string;
  total: number;
  order_status: string;
  payment_status: string;
  created_at: string;
}

interface WishRow {
  id: string;
  product_id: string;
  title: string;
  image: string | null;
  slug: string | null;
}

interface AddressRow {
  id: string;
  label: string | null;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
}

const emptyAddress = {
  label: '',
  full_name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
};

const Account: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [wishlist, setWishlist] = useState<WishRow[]>([]);
  const [addresses, setAddresses] = useState<AddressRow[]>([]);
  const [profile, setProfile] = useState({ full_name: '', email: '', phone: '' });
  const [addressForm, setAddressForm] = useState({ ...emptyAddress });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [authLoading, user, navigate]);

  const loadAll = useCallback(async () => {
    if (!user) return;

    const [{ data: o }, { data: w }, { data: a }, { data: p }] = await Promise.all([
      supabase.from('orders').select('id, order_number, total, order_status, payment_status, created_at')
        .eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('wishlist_items').select('id, product_id').eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase.from('addresses').select('*').eq('user_id', user.id)
        .order('is_default', { ascending: false }),
      supabase.from('profiles').select('full_name, email, phone').eq('id', user.id).maybeSingle(),
    ]);

    setOrders((o as any) || []);
    setAddresses((a as any) || []);
    setProfile({
      full_name: p?.full_name || '',
      email: p?.email || user.email || '',
      phone: p?.phone || '',
    });

    const wishRows = (w as any[]) || [];
    if (wishRows.length) {
      const { data: prods } = await supabase
        .from('products')
        .select('id, title, image, images, slug')
        .in('id', wishRows.map(r => r.product_id));
      const byId = new Map((prods || []).map((pr: any) => [pr.id, pr]));
      setWishlist(
        wishRows
          .filter(r => byId.has(r.product_id))
          .map(r => {
            const pr: any = byId.get(r.product_id);
            return {
              id: r.id,
              product_id: r.product_id,
              title: pr.title,
              slug: pr.slug,
              image: (Array.isArray(pr.images) && pr.images[0]) || pr.image || null,
            };
          })
      );
    } else {
      setWishlist([]);
    }
  }, [user]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, full_name: profile.full_name, email: profile.email, phone: profile.phone });
    setSavingProfile(false);
    if (error) toast({ title: 'Could not save', description: error.message, variant: 'destructive' });
    else toast({ title: 'Profile saved' });
  };

  const saveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingAddress(true);
    const { error } = await supabase.from('addresses').insert({
      user_id: user.id,
      ...addressForm,
      label: addressForm.label || null,
      line2: addressForm.line2 || null,
      is_default: addresses.length === 0,
    });
    setSavingAddress(false);
    if (error) {
      toast({ title: 'Could not save address', description: error.message, variant: 'destructive' });
      return;
    }
    setAddressForm({ ...emptyAddress });
    toast({ title: 'Address saved' });
    loadAll();
  };

  const deleteAddress = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    loadAll();
  };

  const makeDefault = async (id: string) => {
    if (!user) return;
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
    await supabase.from('addresses').update({ is_default: true }).eq('id', id);
    loadAll();
  };

  const removeWish = async (id: string) => {
    await supabase.from('wishlist_items').delete().eq('id', id);
    loadAll();
  };

  const setAddr = (k: keyof typeof addressForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddressForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <Helmet>
        <title>My Account | Abinash Sculptures</title>
        <meta name="description" content="Track your sculpture orders, manage your wishlist, delivery addresses and profile details." />
      </Helmet>
      <Navbar />
      <main className="pt-28 pb-20 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Account</h1>
              <p className="text-muted-foreground text-sm">{profile.email}</p>
            </div>
            <Button variant="outline" onClick={async () => { await signOut(); navigate('/'); }}>
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>

          <Tabs defaultValue="orders">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="pt-6">
              {orders.length === 0 ? (
                <div className="border rounded-lg p-8 text-center bg-muted/30">
                  <p className="mb-4">You have not placed any orders yet.</p>
                  <Link to="/products" className="btn-primary">Browse Sculptures</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(o => (
                    <Link
                      key={o.id}
                      to={`/order-confirmation/${o.id}`}
                      className="flex flex-wrap items-center justify-between gap-3 border rounded-lg p-4 hover:border-amber-400 transition"
                    >
                      <div>
                        <p className="font-semibold">{o.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(o.created_at).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div className="text-sm capitalize text-muted-foreground">
                        {o.order_status} · payment {o.payment_status}
                      </div>
                      <div className="font-semibold">₹{o.total}</div>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="wishlist" className="pt-6">
              {wishlist.length === 0 ? (
                <div className="border rounded-lg p-8 text-center bg-muted/30">
                  <p className="mb-4">Your wishlist is empty.</p>
                  <Link to="/products" className="btn-primary">Find something you love</Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map(w => (
                    <div key={w.id} className="border rounded-lg overflow-hidden">
                      <img src={w.image || '/placeholder.svg'} alt={w.title} className="responsive-img aspect-[4/3]" />
                      <div className="p-4 space-y-3">
                        <h3 className="font-semibold">{w.title}</h3>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={async () => {
                              await addItem({ product_id: w.product_id });
                              toast({ title: 'Added to cart' });
                            }}
                          >
                            Add to cart
                          </Button>
                          {w.slug && (
                            <Link to={`/products/${w.slug}`} className="text-sm self-center underline text-muted-foreground">
                              View
                            </Link>
                          )}
                          <Button size="icon" variant="ghost" className="ml-auto" onClick={() => removeWish(w.id)} aria-label="Remove">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="addresses" className="pt-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {addresses.length === 0 && <p className="text-muted-foreground">No saved addresses yet.</p>}
                  {addresses.map(a => (
                    <div key={a.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <p className="font-semibold">
                            {a.full_name} {a.is_default && <span className="text-xs text-amber-600 ml-2">Default</span>}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} {a.pincode}, {a.country}
                          </p>
                          <p className="text-sm text-muted-foreground">{a.phone}</p>
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => deleteAddress(a.id)} aria-label="Delete address">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      {!a.is_default && (
                        <Button size="sm" variant="outline" className="mt-3" onClick={() => makeDefault(a.id)}>
                          Set as default
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={saveAddress} className="border rounded-lg p-6 space-y-4 h-fit">
                  <h2 className="text-xl font-semibold">Add a new address</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input placeholder="Label (Home, Temple…)" value={addressForm.label} onChange={setAddr('label')} />
                    <Input required placeholder="Full name" value={addressForm.full_name} onChange={setAddr('full_name')} />
                    <Input required placeholder="Phone" value={addressForm.phone} onChange={setAddr('phone')} />
                    <Input required placeholder="Address line 1" value={addressForm.line1} onChange={setAddr('line1')} />
                    <Input placeholder="Address line 2" value={addressForm.line2} onChange={setAddr('line2')} />
                    <Input required placeholder="City" value={addressForm.city} onChange={setAddr('city')} />
                    <Input required placeholder="State" value={addressForm.state} onChange={setAddr('state')} />
                    <Input required placeholder="Pincode" value={addressForm.pincode} onChange={setAddr('pincode')} />
                    <Input required placeholder="Country" value={addressForm.country} onChange={setAddr('country')} />
                  </div>
                  <Button type="submit" disabled={savingAddress}>
                    {savingAddress ? 'Saving…' : 'Save address'}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="pt-6">
              <form onSubmit={saveProfile} className="border rounded-lg p-6 space-y-4 max-w-lg">
                <h2 className="text-xl font-semibold">Your details</h2>
                <Input placeholder="Full name" value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} />
                <Input type="email" placeholder="Email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                <Input placeholder="Phone" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                <Button type="submit" disabled={savingProfile}>{savingProfile ? 'Saving…' : 'Save profile'}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Account;
