import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Helmet } from 'react-helmet';

interface SpecItem {
  label: string;
  value: string;
}

interface Variant {
  size: string;
  price: number | null;
  images: string[];
}

interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
  images: string[] | null;
  features: string[] | null;
  specifications: SpecItem[] | null;
  variants: Variant[] | null;
  price: number | null;
  availability: string;
  created_at: string;
}

const getBaseImages = (product: Product): string[] => {
  const list = (product.images && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : []);
  return list.filter(Boolean);
};

const normalizeVariants = (raw: any): Variant[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((v: any) => ({
      size: typeof v?.size === 'string' ? v.size : '',
      price: v?.price === null || v?.price === undefined || v?.price === '' ? null : Number(v.price),
      images: Array.isArray(v?.images) ? v.images.filter((s: any) => typeof s === 'string' && s.trim()) : [],
    }))
    .filter(v => v.size.trim());
};

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

  const handleOrderClick = (product: Product, variant?: Variant | null) => {
    try {
      const whatsappNumber = "917305971450";
      const sizeText = variant?.size ? ` (Size: ${variant.size})` : '';
      const priceText = (variant?.price ?? product.price) ? ` - ₹${variant?.price ?? product.price}` : '';
      const message = encodeURIComponent(
        `Hello, I'm interested in ordering the ${product.title}${sizeText}${priceText}. ${product.description}`
      );
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

  const truncateDescription = (description: string, maxLength: number = 120) => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const getAvailabilityBadge = (availability: string) =>
    availability === 'in_stock'
      ? <span className="badge-available">Available</span>
      : <span className="badge-out-of-stock">Out of Stock</span>;

  const getDisplayPrice = (product: Product): number | null => {
    const variants = normalizeVariants(product.variants);
    if (variants.length > 0) {
      const prices = variants.map(v => v.price).filter((p): p is number => p !== null && !Number.isNaN(p));
      if (prices.length > 0) return Math.min(...prices);
    }
    return product.price;
  };

  const detailPath = (product: Product, size?: string) => {
    const base = `/products/${encodeURIComponent(product.slug || product.id)}`;
    return size ? `${base}?size=${encodeURIComponent(size)}` : base;
  };

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
                  const variants = normalizeVariants(product.variants);
                  const firstVariantImages = variants[0]?.images || [];
                  const cardImage = firstVariantImages[0] || getBaseImages(product)[0] || product.image;
                  const displayPrice = getDisplayPrice(product);
                  return (
                    <div key={product.id} className="card overflow-hidden group shadow-md rounded-lg">
                      <Link to={detailPath(product)} className="block relative overflow-hidden">
                        <img
                          src={cardImage}
                          alt={`Handcrafted ${product.title} - Abinash Sculptures stone art`}
                          loading="lazy"
                          className={`responsive-img aspect-[4/3] transition-transform duration-300 group-hover:scale-105 ${product.availability === 'out_of_stock' ? 'out-of-stock-image' : ''}`}
                        />
                        <div className="absolute top-3 right-3">
                          {getAvailabilityBadge(product.availability)}
                        </div>
                      </Link>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">
                          <Link to={detailPath(product)} className="hover:text-amber-600 transition-colors">
                            {product.title}
                          </Link>
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {truncateDescription(product.description)}
                        </p>
                        {variants.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-2">
                              Available in {variants.length} size{variants.length > 1 ? 's' : ''}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {variants.map((v, i) => (
                                <Link
                                  key={`${v.size}-${i}`}
                                  to={detailPath(product, v.size)}
                                  className="px-2.5 py-1 rounded-md border border-muted-foreground/30 text-xs hover:border-amber-400 hover:text-amber-600 transition"
                                >
                                  {v.size}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex justify-between items-center mb-3">
                          <Link
                            to={detailPath(product)}
                            className="text-amber-500 font-medium hover:text-amber-600 transition-colors"
                          >
                            View More
                          </Link>
                          <Button
                            onClick={() => handleOrderClick(product, variants[0] || null)}
                            className={`flex items-center gap-2 ${product.availability === 'out_of_stock' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                            disabled={product.availability === 'out_of_stock'}
                          >
                            <MessageSquare className="h-4 w-4" />
                            {product.availability === 'out_of_stock' ? 'Unavailable' : 'Order Now'}
                          </Button>
                        </div>
                        {displayPrice !== null && (
                          <p className="text-lg font-medium">
                            {variants.length > 1 ? 'From ' : ''}₹{displayPrice}
                          </p>
                        )}
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

      <Footer />
    </>
  );
};

export default Products;
