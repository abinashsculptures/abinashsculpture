import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';


const Cart: React.FC = () => {
  const { lines, subtotal, updateQuantity, removeItem, loading } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();


  return (
    <>
      <Helmet>
        <title>Your Cart | Abinash Sculptures</title>
        <meta name="description" content="Review the handcrafted sculptures in your cart and proceed to checkout." />
      </Helmet>
      <Navbar />
      <main className="pt-28 pb-20 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8">Your Cart</h1>

          {loading || authLoading ? (
            <p>Loading your cart…</p>
          ) : !user ? (
            <div className="text-center py-16 border rounded-lg bg-muted/30 px-4">
              <p className="text-lg mb-2">Please sign in to use your cart.</p>
              <p className="text-sm text-muted-foreground mb-6">
                Create an account or log in — anything you picked will be added right after.
              </p>
              <Link to="/auth?next=%2Fcart" className="btn-primary">Sign In / Sign Up</Link>
            </div>
          ) : lines.length === 0 ? (
            <div className="text-center py-16 border rounded-lg bg-muted/30">
              <p className="text-lg mb-4">Your cart is empty.</p>
              <Link to="/products" className="btn-primary">Browse Sculptures</Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {lines.map(line => (
                  <div key={line.id} className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4 sm:items-center">
                    <img
                      src={line.image || '/placeholder.svg'}
                      alt={line.title}
                      className="w-full h-40 sm:w-24 sm:h-24 object-cover rounded-md flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold truncate">{line.title}</h2>
                      {line.variant_name && (
                        <p className="text-sm text-muted-foreground">Size: {line.variant_name}</p>
                      )}
                      <p className="text-sm mt-1">
                        {line.price !== null ? `₹${line.price}` : 'Price on request'}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Button size="icon" variant="outline" onClick={() => updateQuantity(line.id, line.quantity - 1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{line.quantity}</span>
                        <Button size="icon" variant="outline" onClick={() => updateQuantity(line.id, line.quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => removeItem(line.id)} aria-label="Remove item">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="font-semibold whitespace-nowrap">
                      {line.price !== null ? `₹${line.price * line.quantity}` : '—'}
                    </div>
                  </div>
                ))}
              </div>

              <aside className="border rounded-lg p-6 h-fit space-y-3">
                <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span><span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discount</span><span>₹0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery</span><span className="text-muted-foreground">Quoted separately</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span><span>₹{subtotal}</span>
                </div>
                <Button className="w-full mt-4" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout
                </Button>
                <Link to="/products" className="block text-center text-sm text-muted-foreground underline">
                  Continue shopping
                </Link>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
