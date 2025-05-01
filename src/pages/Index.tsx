
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
              <div className="card hover-scale">
                <div className="h-64 rounded mb-4 overflow-hidden">
                  <img 
                    src="/lovable-uploads/f75bff38-a7f3-4c58-a95b-dca223dc1b03.png" 
                    alt="Lord Ganesha Sculpture" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2">Lord Ganesha</h3>
                <p className="text-muted-foreground">Exquisite black stone Ganesha with intricate carving and traditional details.</p>
              </div>
              <div className="card hover-scale">
                <div className="h-64 rounded mb-4 overflow-hidden">
                  <img 
                    src="/lovable-uploads/966a3bb0-7519-4427-a96f-50d82f1d3f73.png" 
                    alt="Meditating Buddha Sculpture" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2">Meditating Buddha</h3>
                <p className="text-muted-foreground">Serene Buddha sculpture crafted in light granite with traditional pose and ornate details.</p>
              </div>
              <div className="card hover-scale">
                <div className="h-64 rounded mb-4 overflow-hidden">
                  <img 
                    src="/lovable-uploads/95eaae5e-d594-4c96-94b2-4c16e3c161be.png" 
                    alt="Vishnu with Lakshmi" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2">Vishnu with Lakshmi</h3>
                <p className="text-muted-foreground">Magnificent stone sculpture showing Lord Vishnu with Goddess Lakshmi in traditional form.</p>
              </div>
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
              {[
                {
                  title: "Custom Sculptures", 
                  text: "Personalized sculptures created to your specifications with attention to detail.",
                  image: "/lovable-uploads/daeca681-c10c-447f-8787-e6a09e09577f.png"
                },
                {
                  title: "Hindu Gods", 
                  text: "Divine sculptures of Hindu deities crafted with devotion and traditional artistry.",
                  image: "/lovable-uploads/636bb5a8-10fc-4b88-b8ea-bb07337d922e.png"
                },
                {
                  title: "Buddha Sculptures", 
                  text: "Peaceful Buddha sculptures that bring tranquility to any space.",
                  image: "/lovable-uploads/966a3bb0-7519-4427-a96f-50d82f1d3f73.png"
                },
                {
                  title: "Stone Temples", 
                  text: "Expertly crafted stone temple elements following traditional design principles.",
                  image: "/lovable-uploads/fcbef6d2-2918-4e70-8608-d0871c7d9a4f.png"
                }
              ].map((service) => (
                <div key={service.title} className="card hover-scale">
                  <div className="h-36 rounded mb-4 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <h3 className="text-xl font-serif font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {service.text}
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
