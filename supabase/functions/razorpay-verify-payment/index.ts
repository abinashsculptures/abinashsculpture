import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const toHex = (buf: ArrayBuffer) =>
  Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!keySecret) return json({ error: 'Razorpay keys not configured' }, 500);

    const body = await req.json().catch(() => null);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id, amount } = body ?? {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return json({ error: 'Missing payment fields' }, 400);
    }

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(keySecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const sig = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(`${razorpay_order_id}|${razorpay_payment_id}`),
    );
    const expected = toHex(sig);

    if (expected !== razorpay_signature) {
      return json({ verified: false, error: 'Signature mismatch' }, 400);
    }

    // Record the successful payment against the local order when one is supplied.
    if (order_id) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      );
      await supabase.from('payments').insert({
        order_id,
        provider: 'razorpay',
        amount: Number(amount ?? 0) / 100,
        currency: 'INR',
        status: 'paid',
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      await supabase
        .from('orders')
        .update({ payment_status: 'paid', order_status: 'confirmed' })
        .eq('id', order_id);
      await supabase.from('order_status_history').insert({
        order_id,
        status: 'confirmed',
        note: 'Payment received via Razorpay.',
      });
    }

    return json({ verified: true });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
