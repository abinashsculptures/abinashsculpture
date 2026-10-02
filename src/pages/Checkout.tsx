import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const Checkout: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { lines, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    note: '',
  });

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', user.id)
        .maybeSingle();
      const { data: address } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .limit(1)
        .maybeSingle();
      setForm(f => ({
        ...f,
        full_name: address?.full_name || profile?.full_name || '',
        email: profile?.email || user.email || '',
        phone: address?.phone || profile?.phone || '',
        line1: address?.line1 || '',
        line2: address?.line2 || '',
        city: address?.city || '',
        state: address?.state || '',
        pincode: address?.pincode || '',
        country: address?.country || 'India',
      }));
    };
    load();
  }, [user]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || lines.length === 0) return;
    setSubmitting(true);
    try {
      const orderNumber = `AS-${Date.now().toString(36).toUpperCase()}`;
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: user.id,
          customer_name: form.full_name,
          customer_email: form.email,
          customer_phone: form.phone,
          shipping_address: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            country: form.country,
          },
          subtotal,
          discount_amount: 0,
          shipping_amount: 0,
          tax_amount: 0,
          total: subtotal,
          customer_note: form.note || null,
          payment_status: 'pending',
          order_status: 'placed',
          shipping_note: 'Delivery charges quoted separately after confirmation.',
        })
        .select()
        .single();

      if (error) throw error;

      const items = lines.map(l => ({
        order_id: order.id,
        product_id: l.product_id,
        product_title: l.title,
        variant_name: l.variant_name,
        image: l.image,
        unit_price: l.price ?? 0,
        quantity: l.quantity,
        line_total: (l.price ?? 0) * l.quantity,
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(items);
      if (itemsError) throw itemsError;

      await supabase.from('order_status_history').insert({
        order_id: order.id,
        status: 'placed',
        note: 'Order placed by customer.',
      });

      // Load Razorpay script
      const loaded = await new Promise<boolean>(resolve => {
        if ((window as any).Razorpay) return resolve(true);
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
      });
      if (!loaded) throw new Error('Could not load the payment window. Check your internet connection and try again.');

      const amountPaise = Math.round(subtotal * 100);
      const { data: rzp, error: rzpErr } = await supabase.functions.invoke('razorpay-create-order', {
        body: { amount: amountPaise, currency: 'INR', receipt: orderNumber },
      });
      if (rzpErr || !rzp?.order_id) throw new Error(rzp?.error || 'Could not start payment. Please try again.');

      const options = {
        key: rzp.key_id,
        amount: rzp.amount,
        currency: rzp.currency,
        name: 'Abinash Sculptures',
        description: `Order ${orderNumber}`,
        order_id: rzp.order_id,
        prefill: { name: form.full_name, email: form.email, contact: form.phone },
        theme: { color: '#b45309' },
        handler: async (resp: any) => {
          const { data: v, error: vErr } = await supabase.functions.invoke('razorpay-verify-payment', {
            body: { ...resp, order_id: order.id, amount: rzp.amount },
          });
          if (vErr || !v?.verified) {
            toast({ title: 'Payment could not be verified', description: 'If money was deducted, contact us with order ' + orderNumber, variant: 'destructive' });
            setSubmitting(false);
            return;
          }
          await clearCart();
          toast({ title: 'Payment successful', description: `Order ${orderNumber} confirmed.` });
          navigate(`/order-confirmation/${order.id}`);
        },
        modal: {
          ondismiss: () => {
            toast({ title: 'Payment cancelled', description: 'Your order is saved as unpaid. You can try paying again.' });
            setSubmitting(false);
          },
        },
      };
      const rz = new (window as any).Razorpay(options);
      rz.on('payment.failed', (r: any) => {
        toast({ title: 'Payment failed', description: r?.error?.description || 'Please try again or use another method.', variant: 'destructive' });
        setSubmitting(false);
      });
      rz.open();
    } catch (err: any) {
      toast({ title: 'Could not place order', description: err.message, variant: 'destructive' });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout | Abinash Sculptures</title>
        <meta name="description" content="Complete your sculpture order with delivery details and confirmation." />
      </Helmet>
      <Navbar />
      <main className="pt-28 pb-20 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          {lines.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <form onSubmit={placeOrder} className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section className="border rounded-lg p-6 space-y-4">
                  <h2 className="text-xl font-semibold">1. Your details</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input required placeholder="Full name" value={form.full_name} onChange={set('full_name')} />
                    <Input required type="email" placeholder="Email" value={form.email} onChange={set('email')} />
                    <Input required placeholder="Phone number" value={form.phone} onChange={set('phone')} />
                  </div>
                </section>

                <section className="border rounded-lg p-6 space-y-4">
                  <h2 className="text-xl font-semibold">2. Delivery address</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input required placeholder="Address line 1" value={form.line1} onChange={set('line1')} />
                    <Input placeholder="Address line 2 (optional)" value={form.line2} onChange={set('line2')} />
                    <Input required placeholder="City" value={form.city} onChange={set('city')} />
                    <Input required placeholder="State" value={form.state} onChange={set('state')} />
                    <Input required placeholder="Pincode" value={form.pincode} onChange={set('pincode')} />
                    <Input required placeholder="Country" value={form.country} onChange={set('country')} />
                  </div>
                  <Textarea placeholder="Notes for us (optional)" value={form.note} onChange={set('note')} />
                </section>

                <section className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">3. Order summary</h2>
                  <div className="space-y-3">
                    {lines.map(l => (
                      <div key={l.id} className="flex justify-between text-sm">
                        <span>{l.title}{l.variant_name ? ` — ${l.variant_name}` : ''} × {l.quantity}</span>
                        <span>₹{(l.price ?? 0) * l.quantity}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-2">4. Payment</h2>
                  <p className="text-sm text-muted-foreground">
                    Pay securely with UPI, cards, net banking or wallets via Razorpay. Delivery charges are quoted separately.
                  </p>
                </section>
              </div>

              <aside className="border rounded-lg p-6 h-fit space-y-3">
                <h2 className="text-xl font-semibold mb-2">Totals</h2>
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between text-sm"><span>Discount</span><span>₹0</span></div>
                <div className="flex justify-between text-sm"><span>Delivery</span><span className="text-muted-foreground">Quoted separately</span></div>
                <div className="flex justify-between text-sm"><span>Tax</span><span>₹0</span></div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg"><span>Total</span><span>₹{subtotal}</span></div>
                <Button type="submit" className="w-full mt-4" disabled={submitting || subtotal < 1}>
                  {submitting ? 'Processing…' : `Pay ₹${subtotal}`}
                </Button>
              </aside>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Checkout;
