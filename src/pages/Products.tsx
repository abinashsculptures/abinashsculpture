import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SpecItem {
  label: string;
  value: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  images: string[] | null;
  features: string[] | null;
  specifications: SpecItem[] | null;
  price: number | null;
  availability: string;
  created_at: string;
}

const getProductImages = (product: Product): string[] => {
  const list = (product.images && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : []);
  return list.filter(Boolean);
};

const ProductDetail: React.FC<{
  product: Product;
  onOrder: (p: Product) => void;
  createSlug: (t: string) => string;
}> = ({ product, onOrder, createSlug }) => {
  const images = getProductImages(product);
  const [activeImage, setActiveImage] = useState(images[0] || '');
  const features = product.features || [];
  const specs = product.specifications || [];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Gallery */}
        <div>
          <div className="relative overflow-hidden rounded-lg border bg-muted">
            {activeImage ? (
              <img
                src={activeImage}
                alt={`Handcrafted ${product.title} - Abinash Sculptures stone art`}
                className={`responsive-img aspect-square ${product.availability === 'out_of_stock' ? 'out-of-stock-image' : ''}`}
              />
            ) : (
              <div className="aspect-square flex items-center justify-center text-muted-foreground">No image</div>
            )}
            <div className="absolute top-3 right-3">
              {product.availability === 'in_stock'
                ? <span className="badge-available">Available</span>
                : <span className="badge-out-of-stock">Out of Stock</span>}
            </div>
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(src)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 transition ${activeImage === src ? 'border-amber-500' : 'border-transparent hover:border-muted-foreground/40'}`}
                >
                  <img src={src} alt={`${product.title} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Summary + actions */}
        <div className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">{product.category}</p>
            {product.price && (
              <p className="text-3xl font-bold text-amber-600 mt-1">₹{product.price}</p>
            )}
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => onOrder(product)}
              className={`flex items-center gap-2 flex-1 ${product.availability === 'out_of_stock' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              disabled={product.availability === 'out_of_stock'}
            >
              <MessageSquare className="h-4 w-4" />
              {product.availability === 'out_of_stock' ? 'Unavailable' : 'Order Now'}
            </Button>
            <Link
              to={`/book?product=${encodeURIComponent(product.title)}`}
              className="btn-primary flex-1 text-center"
            >
              Enquire Now
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="pt-4">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </TabsContent>

        <TabsContent value="features" className="pt-4">
          {features.length === 0 ? (
            <p className="text-muted-foreground">No features listed for this product.</p>
          ) : (
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              {features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="specifications" className="pt-4">
          {specs.length === 0 ? (
            <p className="text-muted-foreground">No specifications available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-md">
                <tbody>
                  {specs.map((s, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <th className="text-left p-3 bg-muted/40 w-1/3 font-medium">{s.label}</th>
                      <td className="p-3 text-muted-foreground">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="pt-4">
          <div className="text-center py-8 border rounded-md bg-muted/30">
            <p className="text-muted-foreground">Customer reviews coming soon.</p>
            <p className="text-sm text-muted-foreground/80 mt-1">Be the first to share your experience with us.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Products: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

      if (error) throw error;
      setProducts((data as any) || []);
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
      const whatsappNumber = "917305971450";
      const message = encodeURIComponent(`Hello, I'm interested in ordering the ${product.title}. ${product.description}`);
      const whatsappUrl = `https://wa.me/+${whatsappNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      toast({
        title: "WhatsApp Opening",
        description: "Redirecting you to WhatsApp to complete your order."
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

  const createSlug = (title: string) =>
    title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  const truncateDescription = (description: string, maxLength: number = 120) => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const getAvailabilityBadge = (availability: string) =>
    availability === 'in_stock'
      ? <span className="badge-available">Available</span>
      : <span className="badge-out-of-stock">Out of Stock</span>;

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
    "telephone": "+917305971450",
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
                {products.map((product) => {
                  const cardImage = getProductImages(product)[0] || product.image;
                  return (
                    <div key={product.id} className="card overflow-hidden group shadow-md rounded-lg">
                      <div className="relative overflow-hidden">
                        <img
                          src={cardImage}
                          alt={`Handcrafted ${product.title} - Abinash Sculptures stone art`}
                          loading="lazy"
                          className={`responsive-img aspect-[4/3] transition-transform duration-300 group-hover:scale-105 ${product.availability === 'out_of_stock' ? 'out-of-stock-image' : ''}`}
                        />
                        <div className="absolute top-3 right-3">
                          {getAvailabilityBadge(product.availability)}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                        <p className="text-muted-foreground mb-4">
                          {truncateDescription(product.description)}
                        </p>
                        <div className="flex justify-between items-center mb-3">
                          <Button
                            variant="ghost"
                            onClick={() => setSelectedProduct(product)}
                            className="text-amber-500 font-medium hover:text-amber-600 transition-colors p-0"
                          >
                            View More
                          </Button>
                          <Button
                            onClick={() => handleOrderClick(product)}
                            className={`flex items-center gap-2 ${product.availability === 'out_of_stock' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                            disabled={product.availability === 'out_of_stock'}
                          >
                            <MessageSquare className="h-4 w-4" />
                            {product.availability === 'out_of_stock' ? 'Unavailable' : 'Order Now'}
                          </Button>
                        </div>
                        {product.price && <p className="text-lg font-medium">₹{product.price}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

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

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedProduct.title}</DialogTitle>
              </DialogHeader>
              <ProductDetail
                key={selectedProduct.id}
                product={selectedProduct}
                onOrder={handleOrderClick}
                createSlug={createSlug}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default Products;
