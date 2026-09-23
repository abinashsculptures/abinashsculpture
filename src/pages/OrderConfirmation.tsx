import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const OrderConfirmation: React.FC = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const { data: o } = await supabase.from('orders').select('*').eq('id', id).maybeSingle();
      const { data: it } = await supabase.from('order_items').select('*').eq('order_id', id);
      setOrder(o);
      setItems(it || []);
      setLoading(false);
    };
    load();
  }, [id]);

  return (
    <>
      <Helmet>
        <title>Order Confirmed | Abinash Sculptures</title>
        <meta name="description" content="Your sculpture order has been received by Abinash Sculptures." />
      </Helmet>
      <Navbar />
      <main className="pt-28 pb-20 min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl">
          {loading ? (
            <p>Loading your order…</p>
          ) : !order ? (
            <p>We could not find this order.</p>
          ) : (
            <div className="text-center">
              <CheckCircle2 className="h-14 w-14 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Thank you for your order</h1>
              <p className="text-muted-foreground mb-8">
                Order <strong>{order.order_number}</strong> has been received. Our team will contact you on{' '}
                {order.customer_phone} to confirm details, delivery charges and payment.
              </p>

              <div className="border rounded-lg p-6 text-left space-y-3">
                {items.map(i => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span>{i.product_title}{i.variant_name ? ` — ${i.variant_name}` : ''} × {i.quantity}</span>
                    <span>₹{i.line_total}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between font-semibold">
                  <span>Total</span><span>₹{order.total}</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center mt-8">
                <Link to={`/orders/${order.id}`} className="btn-primary">Track My Order</Link>
                <Link to="/products" className="underline text-muted-foreground self-center">Continue shopping</Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
