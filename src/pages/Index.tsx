
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Index: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="h-screen flex items-center bg-gradient-to-r from-sculpture-cream to-sculpture-gray">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                Abinash Sculptures
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Crafting unique, premium sculptures that embody emotion, creativity, and artistic excellence
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Link to="/works" className="btn-primary">
                  Explore Our Works
                </Link>
                <Link to="/book" className="btn-secondary">
                  Commission a Sculpture
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Works */}
        <section className="section-padding bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Featured Sculptures</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="card hover-scale">
                  <div className="h-64 bg-sculpture-gray rounded mb-4"></div>
                  <h3 className="text-xl font-serif font-semibold mb-2">Masterpiece Title {item}</h3>
                  <p className="text-muted-foreground">A beautiful sculpture crafted with precision and artistic vision.</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/works" className="btn-secondary">
                View All Works
              </Link>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="section-padding bg-sculpture-blue bg-opacity-20">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {["Custom Sculptures", "Hindu Gods", "Buddha Sculptures", "Stone Temples"].map((service) => (
                <div key={service} className="card hover-scale">
                  <h3 className="text-xl font-serif font-semibold mb-2">{service}</h3>
                  <p className="text-muted-foreground mb-4">
                    Professional {service.toLowerCase()} created with devotion and artistic excellence.
                  </p>
                  <Link to="/services" className="text-sculpture-pink hover:underline">
                    Learn more →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section-padding bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Client Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card">
                <div className="flex items-center mb-4">
                  <Avatar className="h-16 w-16 mr-4">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=ffdfbf" alt="John Smith" />
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">John Smith</h4>
                    <p className="text-muted-foreground">Temple Trustee</p>
                  </div>
                </div>
                <p className="italic">
                  "The attention to detail in the Hindu deity sculptures exceeded all our expectations. The devotion and craftsmanship put into each piece is remarkable."
                </p>
              </div>
              <div className="card">
                <div className="flex items-center mb-4">
                  <Avatar className="h-16 w-16 mr-4">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=b6e3f4" alt="Emily Johnson" />
                    <AvatarFallback>EJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">Emily Johnson</h4>
                    <p className="text-muted-foreground">Interior Designer</p>
                  </div>
                </div>
                <p className="italic">
                  "Working with Abinash Sculptures was a delight. They transformed my concept into a stunning Buddha sculpture that perfectly complements my client's meditation space."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-sculpture-peach bg-opacity-30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Commission Your Masterpiece?</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Contact us today to discuss your vision and bring your ideas to life through our expert craftsmanship.
            </p>
            <Link to="/book" className="btn-primary">
              Book an Order
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
