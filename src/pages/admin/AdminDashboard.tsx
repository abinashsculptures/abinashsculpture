
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminAnalytics from './AdminAnalytics';

const AdminDashboard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  // Set predefined admin credentials on component mount if email field is empty
  useEffect(() => {
    if (!email) {
      setEmail('karunanidhiabinash@gmail.com');
      setPassword('Abinash@2004');
    }
  }, [email]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard"
      });
      navigate('/admin/orders');
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been signed out"
    });
    navigate('/admin');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="mt-2 text-gray-600">Sign in to access the admin dashboard</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <nav className="space-y-2">
          <Link 
            to="/admin/orders" 
            className="block py-2 px-4 rounded hover:bg-gray-800 transition-colors"
          >
            Orders
          </Link>
          <Link 
            to="/admin/products" 
            className="block py-2 px-4 rounded hover:bg-gray-800 transition-colors"
          >
            Products
          </Link>
          <Link 
            to="/admin/analytics" 
            className="block py-2 px-4 rounded hover:bg-gray-800 transition-colors"
          >
            Analytics
          </Link>
          <button 
            onClick={handleLogout} 
            className="w-full text-left py-2 px-4 rounded hover:bg-gray-800 transition-colors mt-6"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<AdminOrders />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/analytics" element={<AdminAnalytics />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
