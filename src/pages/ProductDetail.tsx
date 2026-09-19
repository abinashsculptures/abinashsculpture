import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageSquare, ShoppingCart, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface Variant { size: string; price: number | null; images: string[] }

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

const ProductDetail: React.FC = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const requestedSize = searchParams.get('size');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [variantIdx, setVariantIdx] = useState(0);
  const [activeImage, setActiveImage] = useState('');
  const [wishId, setWishId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const isUuid = !!slug && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq(isUuid ? 'id' : 'slug', slug as string)
        .maybeSingle();
      setProduct(data);
      if (data) {
        const { data: r } = await supabase
          .from('reviews')
          .select('id, rating, title, comment, author_name, created_at')
          .eq('product_id', data.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });
        setReviews(r || []);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  useEffect(() => {
    const check = async () => {
      if (!user || !product) return setWishId(null);
      const { data } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .maybeSingle();
      setWishId(data?.id ?? null);
    };
    check();
  }, [user, product]);

  const variants = useMemo(() => normalizeVariants(product?.variants), [product]);
  const selectedVariant = variants[variantIdx] || null;

  const images = useMemo(() => {
    if (selectedVariant?.images.length) return selectedVariant.images;
    const base = Array.isArray(product?.images) && product.images.length ? product.images : (product?.image ? [product.image] : []);
    return base.filter(Boolean);
  }, [selectedVariant, product]);

  useEffect(() => { setActiveImage(images[0] || ''); }, [images]);

  const price = selectedVariant?.price ?? product?.price ?? null;
  const outOfStock = product?.availability === 'out_of_stock';
  const avgRating = reviews.length
    ? (reviews.reduce((n, r) => n + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  const toggleWishlist = async () => {
    if (!user) return navigate('/auth');
    if (wishId) {
      await supabase.from('wishlist_items').delete().eq('id', wishId);
      setWishId(null);
      toast({ title: 'Removed from wishlist' });
    } else {
      const { data } = await supabase
        .from('wishlist_items')
        .insert({ user_id: user.id, product_id: product.id })
        .select('id')
        .maybeSingle();
      setWishId(data?.id ?? null);
      toast({ title: 'Saved to wishlist' });
    }
  };

  const addToCart = async () => {
    await addItem({ product_id: product.id, variant_name: selectedVariant?.size ?? null, quantity: 1 });
    toast({ title: 'Added to cart', description: 'Your sculpture is waiting in the cart.' });
  };

  const specs: { label: string; value: string }[] = [
    ...(product?.material ? [{ label: 'Material', value: product.material }] : []),
    ...(product?.height ? [{ label: 'Height', value: product.height }] : []),
    ...(product?.width ? [{ label: 'Width', value: product.width }] : []),
    ...(product?.depth ? [{ label: 'Depth', value: product.depth }] : []),
    ...(product?.weight ? [{ label: 'Weight', value: product.weight }] : []),
    ...(Array.isArray(product?.specifications) ? product.specifications : []),
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-28 pb-20 min-h-screen container mx-auto px-4"><p>Loading sculpture…</p></main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="pt-28 pb-20 min-h-screen container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Sculpture not found</h1>
          <Link to="/products" className="btn-primary">Back to collection</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.seo_title || `${product.title} | Abinash Sculptures`}</title>
        <meta name="description" content={product.seo_description || product.short_description || product.description?.slice(0, 155)} />
      </Helmet>
      <Navbar />
      <main className="pt-28 pb-20 min-h-screen">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-amber-600">Home</Link> ·{' '}
            <Link to="/products" className="hover:text-amber-600">Products</Link> · <span>{product.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <div className="relative overflow-hidden rounded-xl border bg-muted">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={`Handcrafted ${product.title} stone sculpture by Abinash Sculptures`}
                    className={`responsive-img aspect-square ${outOfStock ? 'out-of-stock-image' : ''}`}
                  />
                ) : (
                  <div className="aspect-square flex items-center justify-center text-muted-foreground">No image</div>
                )}
                <div className="absolute top-4 right-4">
                  {outOfStock ? <span className="badge-out-of-stock">Out of Stock</span> : <span className="badge-available">Available</span>}
                </div>
              </div>
              {images.length > 1 && (
                <div className="mt-4 flex gap-3 flex-wrap">
                  {images.map((src: string, i: number) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      onClick={() => setActiveImage(src)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${activeImage === src ? 'border-amber-500' : 'border-transparent hover:border-muted-foreground/40'}`}
                    >
                      <img src={src} alt={`${product.title} view ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-widest text-muted-foreground">{product.category}</p>
                <h1 className="text-3xl md:text-4xl font-bold mt-1">{product.title}</h1>
                {avgRating && (
                  <p className="flex items-center gap-1 text-sm mt-2 text-amber-600">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {avgRating} · {reviews.length} review{reviews.length > 1 ? 's' : ''}
                  </p>
                )}
                {price !== null && !Number.isNaN(price) && (
                  <p className="text-3xl font-bold text-amber-600 mt-3">₹{price}</p>
                )}
                <p className="text-sm text-muted-foreground">Delivery charges quoted separately after confirmation.</p>
              </div>

              {variants.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Choose a size</p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v, i) => (
                      <button
                        key={`${v.size}-${i}`}
                        type="button"
                        onClick={() => setVariantIdx(i)}
                        className={`px-4 py-2 rounded-md border text-sm transition ${i === variantIdx ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-muted-foreground/30 hover:border-amber-400'}`}
                      >
                        <span className="font-medium">{v.size}</span>
                        {v.price !== null && !Number.isNaN(v.price) && <span className="ml-2 text-muted-foreground">₹{v.price}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {specs.length > 0 && (
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm border-t border-b py-4">
                  {specs.slice(0, 6).map((s, i) => (
                    <div key={i} className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">{s.label}</dt>
                      <dd className="font-medium text-right">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <p className="text-muted-foreground leading-relaxed">
                {product.short_description || product.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Button onClick={addToCart} disabled={outOfStock} className="flex-1 min-w-[170px]">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {outOfStock ? 'Currently unavailable' : 'Add to Cart'}
                </Button>
                <Button variant="outline" onClick={toggleWishlist} className="flex items-center gap-2">
                  <Heart className={`h-4 w-4 ${wishId ? 'fill-red-500 text-red-500' : ''}`} />
                  {wishId ? 'Saved' : 'Wishlist'}
                </Button>
              </div>

              <div className="rounded-xl border bg-amber-50 p-5">
                <h2 className="font-semibold mb-1">Want this in a custom size or deity?</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Our artisans carve bespoke sculptures to your exact requirements. Share your vision and we will send a detailed quote.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/book?product=${encodeURIComponent(product.title)}${selectedVariant ? `&size=${encodeURIComponent(selectedVariant.size)}` : ''}`}
                    className="btn-primary"
                  >
                    Request Custom Quote
                  </Link>
                  <a
                    href={`https://wa.me/+917305971450?text=${encodeURIComponent(`Hello, I'd like a custom quote for ${product.title}${selectedVariant ? ` (Size: ${selectedVariant.size})` : ''}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm"
                  >
                    <MessageSquare className="h-4 w-4" /> Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="description" className="mt-14">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line max-w-3xl">{product.description}</p>
            </TabsContent>

            <TabsContent value="features" className="pt-6">
              {!product.features || product.features.length === 0 ? (
                <p className="text-muted-foreground">No features listed for this sculpture.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground max-w-3xl">
                  {product.features.map((f: string, i: number) => <li key={i}>{f}</li>)}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="specifications" className="pt-6">
              {specs.length === 0 && variants.length === 0 ? (
                <p className="text-muted-foreground">No specifications available.</p>
              ) : (
                <div className="space-y-6 max-w-3xl">
                  {specs.length > 0 && (
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
                  )}
                  {variants.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Sizes & Pricing</p>
                      <table className="w-full text-sm border rounded-md">
                        <thead><tr className="bg-muted/40"><th className="text-left p-3">Size</th><th className="text-left p-3">Price</th></tr></thead>
                        <tbody>
                          {variants.map((v, i) => (
                            <tr key={i} className="border-b last:border-0">
                              <td className="p-3">{v.size}</td>
                              <td className="p-3 text-muted-foreground">{v.price !== null && !Number.isNaN(v.price) ? `₹${v.price}` : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              {reviews.length === 0 ? (
                <div className="text-center py-10 border rounded-md bg-muted/30 max-w-3xl">
                  <p className="text-muted-foreground">No reviews yet for this sculpture.</p>
                  <p className="text-sm text-muted-foreground/80 mt-1">Be the first to share your experience after your order arrives.</p>
                </div>
              ) : (
                <div className="space-y-4 max-w-3xl">
                  {reviews.map(r => (
                    <div key={r.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-1 text-amber-500 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < r.rating ? 'fill-amber-500' : 'text-muted-foreground/40'}`} />
                        ))}
                      </div>
                      {r.title && <p className="font-semibold">{r.title}</p>}
                      {r.comment && <p className="text-muted-foreground text-sm mt-1">{r.comment}</p>}
                      <p className="text-xs text-muted-foreground/80 mt-2">
                        {r.author_name || 'Verified customer'} · {new Date(r.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
