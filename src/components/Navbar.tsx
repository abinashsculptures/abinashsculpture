
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { count } = useCart();
  const { user } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return <nav className="bg-sculpture-cream bg-opacity-90 backdrop-blur-sm fixed w-full z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="font-serif text-2xl md:text-3xl font-bold">
          Abinash<span className="text-sculpture-pink">Sculptures</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="font-medium hover:text-sculpture-pink transition-colors duration-300">
            Home
          </Link>
          <Link to="/about" className="font-medium hover:text-sculpture-pink transition-colors duration-300">
            About
          </Link>
          <Link to="/services" className="font-medium hover:text-sculpture-pink transition-colors duration-300">
            Services
          </Link>
          <Link to="/works" className="font-medium hover:text-sculpture-pink transition-colors duration-300">
            Works
          </Link>
          <Link to="/products" className="font-medium hover:text-sculpture-pink transition-colors duration-300">
            Products
          </Link>

          <Link
            to={user ? '/account' : '/auth'}
            className="flex items-center gap-1 font-medium hover:text-sculpture-pink transition-colors duration-300"
          >
            <User size={18} />
            <span>{user ? 'My Account' : 'Sign In'}</span>
          </Link>

          <Link to="/cart" className="relative hover:text-sculpture-pink transition-colors duration-300" aria-label="Cart">
            <ShoppingCart size={22} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-sculpture-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          <Link to="/book" className="btn-primary">
            Book an Order
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-4 md:hidden">
          <Link to="/cart" className="relative" aria-label="Cart">
            <ShoppingCart size={22} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-sculpture-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button onClick={toggleMenu} aria-label="Menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && <div className="md:hidden bg-white absolute w-full animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/" className="font-medium py-2" onClick={closeMenu}>
              Home
            </Link>
            <Link to="/about" className="font-medium py-2" onClick={closeMenu}>
              About
            </Link>
            <Link to="/services" className="font-medium py-2" onClick={closeMenu}>
              Services
            </Link>
            <Link to="/works" className="font-medium py-2" onClick={closeMenu}>
              Works
            </Link>
            <Link to="/products" className="font-medium py-2" onClick={closeMenu}>
              Products
            </Link>
            <Link to="/cart" className="font-medium py-2" onClick={closeMenu}>
              Cart {count > 0 ? `(${count})` : ''}
            </Link>
            <Link to={user ? '/account' : '/auth'} className="font-medium py-2" onClick={closeMenu}>
              {user ? 'My Account' : 'Sign In'}
            </Link>
            <Link to="/book" className="btn-primary text-center my-2" onClick={closeMenu}>
              Book an Order
            </Link>
          </div>
        </div>}
    </nav>;
};

export default Navbar;
