import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Auth: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next') || '/account';
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate(next, { replace: true });
  }, [user, navigate, next]);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${next}` },
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Could not send code', description: error.message, variant: 'destructive' });
      return;
    }
    setOtpSent(true);
    toast({ title: 'Check your email', description: 'We sent you a 6-digit code and a sign-in link.' });
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: otp.trim(), type: 'email' });
    setLoading(false);
    if (error) {
      toast({ title: 'Invalid code', description: error.message, variant: 'destructive' });
      return;
    }
    navigate(next, { replace: true });
  };

  const google = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${next}` },
    });
    if (error) toast({ title: 'Google sign-in failed', description: error.message, variant: 'destructive' });
  };


  return (
    <>
      <Helmet>
        <title>Sign In | Abinash Sculptures</title>
        <meta name="description" content="Sign in to your Abinash Sculptures account to track orders, save favourites and check out faster." />
      </Helmet>
      <Navbar />
      <main className="pt-28 pb-20 min-h-screen bg-sculpture-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-center mb-1">Login / Sign Up</h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              No password needed — we send you a code by email.
            </p>

            <Button variant="outline" className="w-full mb-6" onClick={google} type="button">
              Continue with Google
            </Button>

            <div className="relative mb-6 text-center">
              <span className="bg-white px-3 text-xs uppercase text-muted-foreground relative z-10">or</span>
              <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
            </div>

            {!otpSent ? (
              <form onSubmit={sendOtp} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending…' : 'Send Code'}
                </Button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium mb-1">Enter the 6-digit code</label>
                  <Input id="otp" inputMode="numeric" required value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Verifying…' : 'Verify & Continue'}
                </Button>
                <button type="button" className="w-full text-sm text-muted-foreground underline" onClick={() => setOtpSent(false)}>
                  Use a different email
                </button>
              </form>
            )}

            <p className="text-xs text-muted-foreground mt-6 text-center">
              Phone number sign-in is coming soon.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Auth;
