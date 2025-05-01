
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sculpture-gray py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">
              Abinash<span className="text-sculpture-pink">Sculptures</span>
            </h3>
            <p className="text-muted-foreground mb-4">
              Creating timeless masterpieces with passion and precision.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-sculpture-pink transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-sculpture-pink transition-colors duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-sculpture-pink transition-colors duration-300">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/works" className="text-muted-foreground hover:text-sculpture-pink transition-colors duration-300">
                  Works
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-muted-foreground hover:text-sculpture-pink transition-colors duration-300">
                  Book an Order
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center">
                <Phone size={16} className="mr-2" /> +91 9444425392
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2" /> abinashsculptures@gmail.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-muted mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            &copy; {currentYear} Abinash Sculptures. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-sculpture-pink transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-sculpture-pink transition-colors duration-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
