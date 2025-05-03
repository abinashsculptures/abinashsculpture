
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Products: React.FC = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [orderForm, setOrderForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productCategories = [
    {
      id: 1,
      title: "Hindu Gods",
      description: "Exquisite sculptures of Hindu deities crafted with devotion and attention to detail.",
      image: "/lovable-uploads/4dd77698-dfcc-4125-a47d-10367a11c0e1.png",
    },
    {
      id: 2,
      title: "Buddha Statues",
      description: "Serene Buddha sculptures embodying peace and enlightenment, perfect for meditation spaces.",
      image: "/lovable-uploads/966a3bb0-7519-4427-a96f-50d82f1d3f73.png",
    },
    {
      id: 3,
      title: "Stone Temples",
      description: "Miniature stone temples inspired by ancient Indian architecture for your sacred space.",
      image: "/lovable-uploads/0cafab96-a8a1-4bda-ab13-3fc042ddfef3.png",
    },
    {
      id: 4,
      title: "Krishna Sculptures",
      description: "Beautiful Lord Krishna sculptures depicting various divine poses and scenes.",
      image: "/lovable-uploads/4dd77698-dfcc-4125-a47d-10367a11c0e1.png",
    },
    {
      id: 5,
      title: "Ganesha Idols",
      description: "Lord Ganesha sculptures to bring prosperity and remove obstacles from your life.",
      image: "/lovable-uploads/f75bff38-a7f3-4c58-a95b-dca223dc1b03.png",
    },
    {
      id: 6,
      title: "Custom Sculptures",
      description: "Bespoke sculptures crafted to your specifications and requirements.",
      image: "/lovable-uploads/95eaae5e-d594-4c96-94b2-4c16e3c161be.png",
    }
  ];

  const handleOrderClick = (product: any) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Insert the order into Supabase
      const { error } = await supabase
        .from('whatsapp_orders')
        .insert({
          customer_name: orderForm.name,
          customer_email: orderForm.email,
          customer_phone: orderForm.phone,
          product_id: null, // We don't have real product IDs yet
        });
      
      if (error) {
        throw error;
      }
      
      // Construct WhatsApp URL with pre-filled message
      const whatsappNumber = "7305971450";
      const message = encodeURIComponent(
        `Hello, I'm interested in ordering the ${selectedProduct.title}. My name is ${orderForm.name}. Please contact me to discuss the details.`
      );
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
      
      // Show success message
      toast({
        title: "Order Request Sent!",
        description: "Your order has been submitted. You're being redirected to WhatsApp to complete your order.",
      });
      
      // Reset form and close dialog
      setOrderForm({
        name: '',
        email: '',
        phone: ''
      });
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error submitting order:', err);
      toast({
        title: "Error",
        description: "There was a problem submitting your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-sculpture-cream">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Products</h1>
              <p className="text-lg text-muted-foreground">
                Discover our collection of handcrafted sculptures that bring divine energy to your space.
                Each piece is meticulously created with devotion and artistic excellence.
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productCategories.map((category) => (
                <div key={category.id} className="card overflow-hidden group">
                  <div className="relative overflow-hidden h-64">
                    <img 
                      src={category.image} 
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                    <p className="text-muted-foreground mb-4">{category.description}</p>
                    <div className="flex justify-between items-center">
                      <Link to="/book" className="text-amber-500 font-medium hover:text-amber-600 transition-colors">
                        Enquire Now
                      </Link>
                      <Button 
                        onClick={() => handleOrderClick(category)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Order via WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Looking for a Custom Sculpture?</h2>
              <p className="text-lg mb-8">
                We specialize in creating bespoke sculptures tailored to your specific requirements.
                Let us know your vision, and our skilled artisans will bring it to life.
              </p>
              <Link to="/book" className="btn-primary px-10 py-4 text-lg">
                Book a Custom Order
              </Link>
            </div>
          </div>
        </section>

        {/* WhatsApp Order Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Order via WhatsApp</DialogTitle>
              <DialogDescription>
                Fill in your details below to place an order for {selectedProduct?.title} via WhatsApp.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitOrder}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={orderForm.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={orderForm.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={orderForm.phone}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Continue to WhatsApp'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </>
  );
};

export default Products;
