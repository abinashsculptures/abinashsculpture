import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, Circle, Package, Truck, Home, ClipboardList } from 'lucide-react';

const STAGES = [
  { key: 'placed', label: 'Order placed', icon: ClipboardList, note: 'We have received your order.' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2, note: 'Our team confirmed details and payment.' },
  { key: 'in_production', label: 'In the workshop', icon: Package, note: 'Your sculpture is being carved and finished.' },
  { key: 'shipped', label: 'Out for delivery', icon: Truck, note: 'On the way to your address.' },
  { key: 'delivered', label: 'Delivered', icon: Home, note: 'Delivered and installed.' },
];

const statusIndex = (status?: string) => {
  const i = STAGES.findIndex(s => s.key === status);
  return i === -1 ? 0 : i;
};

const OrderTracking: React.FC = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate(`/auth?next=${encodeURIComponent(`/orders/${id ?? ''}`)}`);
  }, [authLoading, user, id, navigate]);

  useEffect(() => {
    const load = async () => {
      if (!id || !user) return;
      const [{ data: o }, { data: it }, { data: h }] = await Promise.all([
        supabase.from('orders').select('*').eq('id', id).maybeSingle(),
        supabase.from('order_items').select('*').eq('order_id', id),
        supabase.from('order_status_history').select('*').eq('order_id', id)
          .order('created_at', { ascending: true }),
      ]);
      setOrder(o);
      setItems(it || []);
      setHistory(h || []);
      setLoading(false);
    };
    load();
  }, [id, user]);

  const cancelled = order?.order_status === 'cancelled';
  const current = statusIndex(order?.order_status);

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

  return (
    <>
      <Helmet>
        <title>Track Your Order | Abinash Sculptures</title>
        <meta name="description" content="Track your Abinash Sculptures order status, delivery updates and estimated arrival date." />
      </Helmet>
      <Navbar />
      <main className="pt-28 pb-20 min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl">
          {loading ? (
            <p>Loading your order…</p>
          ) : !order ? (
            <div className="border rounded-lg p-8 text-center bg-muted/30">
              <p className="mb-4">We could not find this order.</p>
              <Link to="/account" className="btn-primary">Back to my account</Link>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Order {order.order_number}</h1>
                  <p className="text-sm text-muted-foreground">
                    Placed on {fmt(order.created_at)} · payment {order.payment_status}
                  </p>
                </div>
                <Link to="/account" className="text-sm underline text-muted-foreground self-center">
                  All my orders
                </Link>
              </div>

              <div className="border rounded-lg p-6 bg-muted/20">
                <p className="text-sm text-muted-foreground">Estimated arrival</p>
                <p className="text-xl font-semibold">
                  {order.estimated_completion
                    ? fmt(order.estimated_completion)
                    : 'Our team will confirm a delivery date shortly'}
                </p>
                {order.shipping_note && (
                  <p className="text-sm text-muted-foreground mt-2">{order.shipping_note}</p>
                )}
              </div>

              {cancelled ? (
                <div className="border rounded-lg p-6 text-center">
                  <p className="font-semibold text-red-600">This order was cancelled.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Call us on 7305971450 if you would like to reorder.
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-6">Delivery progress</h2>
                  <ol className="space-y-6">
                    {STAGES.map((s, i) => {
                      const done = i <= current;
                      const Icon = done ? s.icon : Circle;
                      const stamp = history.find(h => h.status === s.key);
                      return (
                        <li key={s.key} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <span
                              className={`h-9 w-9 rounded-full flex items-center justify-center ${
                                done ? 'bg-amber-500 text-white' : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            {i < STAGES.length - 1 && (
                              <span className={`w-px flex-1 mt-1 ${i < current ? 'bg-amber-500' : 'bg-border'}`} />
                            )}
                          </div>
                          <div className="pb-2">
                            <p className={`font-medium ${done ? '' : 'text-muted-foreground'}`}>{s.label}</p>
                            <p className="text-sm text-muted-foreground">{stamp?.note || s.note}</p>
                            {stamp && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(stamp.created_at).toLocaleString('en-IN')}
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}

              <div className="border rounded-lg p-6 space-y-3">
                <h2 className="text-xl font-semibold mb-2">Items in this order</h2>
                {items.map(i => (
                  <div key={i.id} className="flex flex-wrap justify-between gap-2 text-sm">
                    <span>
                      {i.product_title}
                      {i.variant_name ? ` — ${i.variant_name}` : ''} × {i.quantity}
                    </span>
                    <span>₹{i.line_total}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>

              <div className="border rounded-lg p-6 text-sm">
                <h2 className="text-xl font-semibold mb-3">Delivery address</h2>
                <p className="text-muted-foreground">
                  {order.customer_name} · {order.customer_phone}
                </p>
                <p className="text-muted-foreground">
                  {[
                    order.shipping_address?.line1,
                    order.shipping_address?.line2,
                    order.shipping_address?.city,
                    order.shipping_address?.state,
                    order.shipping_address?.pincode,
                    order.shipping_address?.country,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrderTracking;
