import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const STATUSES = ['placed', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled'];
const LABELS: Record<string, string> = {
  placed: 'Order placed', confirmed: 'Confirmed', in_production: 'In the workshop',
  shipped: 'Out for delivery', delivered: 'Delivered', cancelled: 'Cancelled',
};

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [items, setItems] = useState<Record<string, any[]>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) toast({ title: 'Could not load orders', description: error.message, variant: 'destructive' });
    setOrders(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toggle = async (id: string) => {
    setOpen(open === id ? null : id);
    if (!items[id]) {
      const { data } = await supabase.from('order_items').select('*').eq('order_id', id);
      setItems(p => ({ ...p, [id]: data || [] }));
    }
  };

  const save = async (o: any) => {
    const e = edits[o.id] || {};
    const status = e.order_status ?? o.order_status;
    const { error } = await supabase.from('orders').update({
      order_status: status,
      estimated_completion: (e.estimated_completion ?? o.estimated_completion) || null,
      internal_note: e.internal_note ?? o.internal_note,
    }).eq('id', o.id);
    if (error) return toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    if (status !== o.order_status || e.note) {
      const { data: u } = await supabase.auth.getUser();
      await supabase.from('order_status_history').insert({ order_id: o.id, status, note: e.note || null, changed_by: u.user?.id });
    }
    toast({ title: 'Order updated', description: `${o.order_number} → ${LABELS[status] || status}` });
    setEdits(p => ({ ...p, [o.id]: {} }));
    load();
  };

  const set = (id: string, k: string, v: string) => setEdits(p => ({ ...p, [id]: { ...p[id], [k]: v } }));

  const shown = orders.filter(o =>
    (filter === 'all' || o.order_status === filter) &&
    `${o.order_number} ${o.customer_name} ${o.customer_phone} ${o.customer_email}`.toLowerCase().includes(search.toLowerCase()));

  const count = (s: string) => orders.filter(o => o.order_status === s).length;

  if (loading) return <div className="text-center py-10">Loading orders…</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Customer Orders</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(filter === s ? 'all' : s)}
            className={`border rounded-lg p-3 text-left ${filter === s ? 'border-primary bg-muted' : ''}`}>
            <div className="text-xs text-muted-foreground">{LABELS[s]}</div>
            <div className="text-xl font-bold">{count(s)}</div>
          </button>
        ))}
      </div>
      <Input placeholder="Search order number, name, phone…" value={search} onChange={e => setSearch(e.target.value)} className="mb-4 max-w-md" />

      {shown.length === 0 ? <p className="text-muted-foreground py-10 text-center">No orders found</p> : (
        <div className="space-y-3">
          {shown.map(o => {
            const e = edits[o.id] || {};
            const addr = o.shipping_address || {};
            return (
              <div key={o.id} className="border rounded-lg">
                <button onClick={() => toggle(o.id)} className="w-full flex flex-wrap gap-3 items-center justify-between p-4 text-left">
                  <div>
                    <div className="font-semibold">{o.order_number} · {o.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Badge variant={o.payment_status === 'paid' ? 'default' : 'secondary'}>{o.payment_status}</Badge>
                    <Badge variant="outline">{LABELS[o.order_status] || o.order_status}</Badge>
                    <span className="font-semibold">₹{o.total}</span>
                  </div>
                </button>
                {open === o.id && (
                  <div className="border-t p-4 grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 text-sm">
                      <p><strong>Phone:</strong> {o.customer_phone} {o.customer_email && <>· {o.customer_email}</>}</p>
                      <p><strong>Address:</strong> {[addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}</p>
                      {o.customer_note && <p><strong>Customer note:</strong> {o.customer_note}</p>}
                      <div className="border rounded p-3 space-y-1">
                        {(items[o.id] || []).map(i => (
                          <div key={i.id} className="flex justify-between">
                            <span>{i.product_title}{i.variant_name ? ` — ${i.variant_name}` : ''} × {i.quantity}</span><span>₹{i.line_total}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <a className="underline" target="_blank" rel="noreferrer"
                          href={`https://wa.me/${String(o.customer_phone).replace(/\D/g, '').replace(/^(\d{10})$/, '91$1')}?text=${encodeURIComponent(`Hello ${o.customer_name}, regarding your order ${o.order_number} from Abinash Sculptures: `)}`}>WhatsApp customer</a>
                        {o.customer_email && <a className="underline" href={`mailto:${o.customer_email}?subject=Your order ${o.order_number}`}>Email customer</a>}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium">Order status
                        <select className="mt-1 w-full border rounded h-10 px-2 bg-background" value={e.order_status ?? o.order_status}
                          onChange={ev => set(o.id, 'order_status', ev.target.value)}>
                          {STATUSES.map(s => <option key={s} value={s}>{LABELS[s]}</option>)}
                        </select>
                      </label>
                      <label className="block text-sm font-medium">Estimated arrival
                        <Input type="date" value={e.estimated_completion ?? o.estimated_completion ?? ''} onChange={ev => set(o.id, 'estimated_completion', ev.target.value)} />
                      </label>
                      <label className="block text-sm font-medium">Update note (visible to customer)
                        <Input value={e.note ?? ''} onChange={ev => set(o.id, 'note', ev.target.value)} placeholder="e.g. Carving started" />
                      </label>
                      <label className="block text-sm font-medium">Internal note
                        <Input value={e.internal_note ?? o.internal_note ?? ''} onChange={ev => set(o.id, 'internal_note', ev.target.value)} />
                      </label>
                      <Button onClick={() => save(o)}>Save changes</Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
