import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    const keyId = Deno.env.get('RAZORPAY_KEY_ID');
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!keyId || !keySecret) return json({ error: 'Razorpay keys not configured' }, 500);

    const body = await req.json().catch(() => null);
    const amount = Number(body?.amount);
    const currency = typeof body?.currency === 'string' ? body.currency : 'INR';
    const receipt = typeof body?.receipt === 'string' ? body.receipt.slice(0, 40) : `rcpt_${Date.now()}`;

    if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount < 100) {
      return json({ error: 'Amount must be an integer of at least 100 paise' }, 400);
    }

    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      },
      body: JSON.stringify({ amount, currency, receipt, payment_capture: 1 }),
    });

    const data = await res.json();
    if (!res.ok) {
      const status = res.status === 401 ? 401 : 500;
      return json({ error: data?.error?.description || 'Razorpay order creation failed' }, status);
    }

    return json({ order_id: data.id, amount: data.amount, currency: data.currency, key_id: keyId });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
