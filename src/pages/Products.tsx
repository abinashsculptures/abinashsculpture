
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Helmet } from 'react-helmet';

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number | null;
  created_at: string;
}

const Products: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (product: Product) => {
    try {
      // Construct WhatsApp URL with pre-filled message
      const whatsappNumber = "919444425392"; // Added country code without the + as it's handled in the URL
      const message = encodeURIComponent(
        `Hello, I'm interested in ordering the ${product.title}. ${product.description}`
      );
      const whatsappUrl = `https://wa.me/+${whatsappNumber}?text=${message}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
      
      // Show success message
      toast({
        title: "WhatsApp Opening",
        description: "Redirecting you to WhatsApp to complete your order.",
      });
    } catch (err) {
      console.error('Error opening WhatsApp:', err);
      toast({
        title: "Error",
        description: "There was a problem opening WhatsApp. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Create URL-friendly slug from product title
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  // JSON-LD Schema for Local Business
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Abinash Sculptures",
    "image": "https://i.postimg.cc/d3Nc49kF/Screenshot-2025-05-03-152040.png",
    "description": "Handcrafted Hindu god sculptures, Buddha statues, stone temples, and traditional household products",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mamallapuram",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "postalCode": "603104",
      "addressCountry": "IN"
    },
    "telephone": "+919444425392",
    "url": "https://abinashsculptures.in",
    "openingHours": "Mo-Sa 09:00-18:00",
    "priceRange": "₹₹-₹₹₹₹"
  };

  return (
    <>
      <Helmet>
        <title>Divine Stone Sculptures & Products | Abinash Sculptures</title>
        <meta name="description" content="Browse our exquisite collection of handcrafted Hindu god sculptures, Buddha statues, stone temples, and traditional ammikal. Each piece is meticulously created by master artisans." />
        <meta name="keywords" content="Hindu god sculptures, Buddha statues, stone temples, ammikal, stone idols, handmade sculptures, traditional stone art" />
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-sculpture-cream">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Divine Stone Sculptures & Products</h1>
              <p className="text-lg text-muted-foreground">
                Discover our collection of handcrafted sculptures that bring divine energy to your space.
                Each piece is meticulously created with devotion and artistic excellence by our master artisans.
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Explore Our Handcrafted Collection</h2>
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <p className="text-lg">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl">No products available at the moment.</p>
                <p className="mt-2">Please check back later or contact us for custom orders.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="card overflow-hidden group shadow-md rounded-lg">
                    <div className="relative overflow-hidden h-64">
                      <img 
                        src={product.image} 
                        alt={`Handcrafted ${product.title} - Abinash Sculptures stone art`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 lazyload"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                      <p className="text-muted-foreground mb-4">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <Link to={`/products/${createSlug(product.title)}-${product.id}`} className="text-amber-500 font-medium hover:text-amber-600 transition-colors">
                          Enquire Now
                        </Link>
                        <Button 
                          onClick={() => handleOrderClick(product)}
                          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Order Now
                        </Button>
                      </div>
                      {product.price && (
                        <p className="mt-3 text-lg font-medium">₹{product.price}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
      </main>
      <Footer />
    </>
  );
};

export default Products;
