import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const STATUSES = ['new', 'contacted', 'quoted', 'accepted', 'closed'];

const waLink = (phone: string, msg: string) =>
  `https://wa.me/${String(phone || '').replace(/\D/g, '').replace(/^(\d{10})$/, '91$1')}?text=${encodeURIComponent(msg)}`;

const AdminEnquiries: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('custom_enquiries').select('*').order('created_at', { ascending: false });
    if (error) toast({ title: 'Could not load inquiries', description: error.message, variant: 'destructive' });
    setRows(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const update = async (id: string, patch: any, msg: string) => {
    const { error } = await supabase.from('custom_enquiries').update(patch).eq('id', id);
    if (error) return toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    toast({ title: msg });
    setRows(r => r.map(x => (x.id === id ? { ...x, ...patch } : x)));
  };

  const respond = (r: any, via: 'wa' | 'mail') => {
    const text = replies[r.id]?.trim();
    if (!text) return toast({ title: 'Write a reply first', variant: 'destructive' });
    const url = via === 'wa' ? waLink(r.phone, text) : `mailto:${r.email}?subject=${encodeURIComponent(`Your enquiry ${r.enquiry_number} – Abinash Sculptures`)}&body=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    const log = `${r.internal_note ? r.internal_note + '\n' : ''}[${new Date().toLocaleString('en-IN')}] Replied via ${via === 'wa' ? 'WhatsApp' : 'email'}: ${text}`;
    update(r.id, { internal_note: log, status: r.status === 'new' ? 'contacted' : r.status }, 'Reply sent and logged');
    setReplies(p => ({ ...p, [r.id]: '' }));
  };

  if (loading) return <div className="text-center py-10">Loading inquiries…</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Custom Sculpture Inquiries</h2>
      {rows.length === 0 ? <p className="text-muted-foreground text-center py-10">No inquiries yet</p> : (
        <div className="space-y-4">
          {rows.map(r => (
            <div key={r.id} className="border rounded-lg p-4 grid md:grid-cols-2 gap-6">
              <div className="space-y-1 text-sm">
                <div className="flex gap-2 items-center flex-wrap">
                  <span className="font-semibold text-base">{r.enquiry_number} · {r.name}</span>
                  <Badge variant="outline">{r.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString('en-IN')}</p>
                <p><strong>Contact:</strong> {r.phone}{r.email ? ` · ${r.email}` : ''}</p>
                {r.deity && <p><strong>Deity:</strong> {r.deity}</p>}
                {(r.height || r.material) && <p><strong>Size / material:</strong> {[r.height, r.material].filter(Boolean).join(' · ')}</p>}
                <p><strong>Quantity:</strong> {r.quantity}{r.budget ? ` · Budget ${r.budget}` : ''}{r.required_date ? ` · Needed by ${r.required_date}` : ''}</p>
                {r.location && <p><strong>Location:</strong> {r.location}</p>}
                {r.requirements && <p className="whitespace-pre-wrap"><strong>Requirements:</strong> {r.requirements}</p>}
                {r.internal_note && <pre className="whitespace-pre-wrap text-xs bg-muted p-2 rounded mt-2">{r.internal_note}</pre>}
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium">Status
                  <select className="mt-1 w-full border rounded h-10 px-2 bg-background" value={r.status}
                    onChange={e => update(r.id, { status: e.target.value }, `Status set to ${e.target.value}`)}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <Textarea placeholder="Write your reply to the customer…" value={replies[r.id] || ''}
                  onChange={e => setReplies(p => ({ ...p, [r.id]: e.target.value }))} />
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={() => respond(r, 'wa')}>Reply on WhatsApp</Button>
                  {r.email && <Button variant="outline" onClick={() => respond(r, 'mail')}>Reply by email</Button>}
                </div>
                <Textarea placeholder="Private note (not sent)" value={notes[r.id] || ''}
                  onChange={e => setNotes(p => ({ ...p, [r.id]: e.target.value }))} />
                <Button variant="secondary" size="sm" onClick={() => {
                  if (!notes[r.id]?.trim()) return;
                  update(r.id, { internal_note: `${r.internal_note ? r.internal_note + '\n' : ''}[${new Date().toLocaleString('en-IN')}] ${notes[r.id]}` }, 'Note saved');
                  setNotes(p => ({ ...p, [r.id]: '' }));
                }}>Add note</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
