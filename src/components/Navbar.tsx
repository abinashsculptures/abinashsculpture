
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  return <nav className="bg-sculpture-cream bg-opacity-90 backdrop-blur-sm fixed w-full z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="font-serif text-2xl md:text-3xl font-bold">
          Abinash<span className="text-sculpture-pink">Sculptures</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-8">
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
          <Link to="/book" className="btn-primary">
            Book an Order
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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
            <Link to="/book" className="btn-primary text-center my-2" onClick={closeMenu}>
              Book an Order
            </Link>
          </div>
        </div>}
    </nav>;
};

export default Navbar;
