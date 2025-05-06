import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet';
import SEOFaq from '../components/SEOFaq';

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

const Index: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, title, description, image, category')
          .limit(3);
          
        if (error) throw error;
        setFeaturedProducts(data || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };
    
    fetchFeaturedProducts();
  }, []);
  
  // JSON-LD Schema for homepage with organization and products
  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Abinash Sculptures",
    "url": "https://abinashsculptures.in",
    "logo": "https://i.postimg.cc/d3Nc49kF/Screenshot-2025-05-03-152040.png",
    "description": "Handcrafted Hindu god sculptures, Buddha statues, stone temples, and ammikal by master artisans from Mamallapuram.",
    "telephone": "+919444425392",
    "sameAs": [
      "https://facebook.com/abinashsculptures",
      "https://instagram.com/abinashsculptures"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mamallapuram",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "postalCode": "603104",
      "addressCountry": "IN"
    }
  };
  
  return <>
      <Helmet>
        <title>Abinash Sculptures - Handcrafted Hindu God Sculptures & Stone Art</title>
        <meta name="description" content="Abinash Sculptures brings divine artistry to life through handcrafted Hindu gods sculptures, stone temples, and Buddha statues. Based in Mamallapuram, we blend tradition with timeless elegance." />
        <meta name="keywords" content="Hindu god sculptures, Buddha statues, stone temples, ammikal, handmade sculptures, Ganesha statue, Krishna sculpture, Mamallapuram stone art" />
        <script type="application/ld+json">
          {JSON.stringify(homePageSchema)}
        </script>
      </Helmet>
      <Navbar />
      <main className="bg-sculpture-cream">
        {/* Hero Section - Updated Layout with New Images */}
        <section className="pt-32 pb-16 md:py-24 lg:min-h-[90vh] flex items-center">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6 lg:pr-10">
                <div className="text-amber-500 font-semibold">WELCOME TO ABINASH SCULPTURES</div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Make The Divine Presence With Beautiful Sculptures
                </h1>
                <p className="text-lg text-gray-700 max-w-2xl">
                  Abinash Sculptures brings divine artistry to life through handcrafted Hindu gods,
                  stone temples, and Buddha sculptures. Based in Mamallapuram, we blend tradition
                  with timeless elegance to create spiritual masterpieces that elevate your space.
                </p>
                <div className="pt-4">
                  <Link to="/works" className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded inline-block font-medium">
                    Explore More
                  </Link>
                </div>
              </div>
              
              {/* Right side with new images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-3 rounded-lg shadow-lg">
                  <img src="/lovable-uploads/636bb5a8-10fc-4b88-b8ea-bb07337d922e.png" alt="Hand-carved Hindu deity stone sculpture - Abinash Sculptures" className="w-full h-full object-cover rounded-lg" loading="lazy" />
                </div>
                <div className="bg-white p-3 rounded-lg shadow-lg md:mt-12">
                  <img src="/lovable-uploads/fcbef6d2-2918-4e70-8608-d0871c7d9a4f.png" alt="Traditional Buddha statue from Abinash master stone sculptors" className="w-full h-full object-cover rounded-lg" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Products Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-amber-500 font-semibold">OUR PRODUCTS</h3>
              <h2 className="text-3xl md:text-4xl font-bold">
                Discover Our Divine Collection
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <div key={product.id} className="card hover-scale overflow-hidden">
                    <div className="h-64 overflow-hidden">
                      <img alt={`Handcrafted ${product.title} stone sculpture by Abinash Sculptures`} className="w-full h-full object-cover" src={product.image} loading="lazy" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                      <Link to="/products" className="text-amber-500 hover:text-amber-600 font-medium">View Collection →</Link>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="card hover-scale overflow-hidden">
                    <div className="h-64 overflow-hidden">
                      <img alt="Hand-carved Hindu deity Annapoorani sculpture from Abinash Sculptures" className="w-full h-full object-cover" src="https://i.postimg.cc/brrTG0QY/Annapoorani.jpg" loading="lazy" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">Hindu Gods</h3>
                      <p className="text-gray-600 mb-4">Beautiful sculptures of Hindu Gods in various divine poses.</p>
                      <Link to="/products" className="text-amber-500 hover:text-amber-600 font-medium">View Collection →</Link>
                    </div>
                  </div>
                  <div className="card hover-scale overflow-hidden">
                    <div className="h-64 overflow-hidden">
                      <img alt="Serene Buddha stone statue for meditation spaces by Abinash Sculptures" src="https://i.postimg.cc/bvQ8MkSv/Buddha-Small.jpg" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">Buddha Statues</h3>
                      <p className="text-gray-600 mb-4">Serene Buddha sculptures for meditation spaces and peaceful corners.</p>
                      <Link to="/products" className="text-amber-500 hover:text-amber-600 font-medium">View Collection →</Link>
                    </div>
                  </div>
                  <div className="card hover-scale overflow-hidden">
                    <div className="h-64 overflow-hidden">
                      <img alt="Exquisite Lord Murugan stone sculpture handcrafted by Abinash artisans" className="w-full h-full object-cover" src="https://i.postimg.cc/s2NW1FD8/work4.jpg" loading="lazy" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">Lord Murugan</h3>
                      <p className="text-gray-600 mb-4">Lord Murugan inspired by ancient Indian architecture.</p>
                      <Link to="/products" className="text-amber-500 hover:text-amber-600 font-medium">View Collection →</Link>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="text-center mt-12">
              <Link to="/products" className="btn-primary">
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="grid grid-cols-2 gap-4">
                <img src="/lovable-uploads/f75bff38-a7f3-4c58-a95b-dca223dc1b03.png" alt="Traditional Ganesha Sculpture handmade by Abinash master artisans" className="w-full h-auto rounded-lg" loading="lazy" />
                <img src="/lovable-uploads/4dd77698-dfcc-4125-a47d-10367a11c0e1.png" alt="Detailed Lord Krishna Stone Sculpture from Abinash Sculptures" className="w-full h-auto rounded-lg mt-12" loading="lazy" />
              </div>
              <div className="space-y-6">
                <div className="text-sculpture-darkpink font-semibold">ABOUT US</div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  We Are Creative And Professional Sculptors
                </h2>
                <p className="text-muted-foreground">
                  At our studio, we specialize in crafting exquisite sculptures that capture the divine essence of Hindu deities, Buddha, and traditional temple elements. Each piece is meticulously created with attention to detail and spiritual significance.
                </p>
                <p className="text-muted-foreground">
                  Founded by experienced artisans, our workshop combines traditional techniques with modern creativity to deliver sculptures that transcend mere art and become objects of devotion.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-amber-500"></div>
                    <p>Quality Materials</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-amber-500"></div>
                    <p>Expert Craftsmen</p>
                  </div>
                </div>
                <div>
                  <Link to="/about" className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded inline-block font-medium">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision and Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Vision */}
              <div className="bg-amber-50 p-8 rounded-lg shadow-md">
                <div className="text-center mb-6">
                  <div className="inline-block bg-amber-100 p-3 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="4"></circle>
                      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
                      <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
                      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
                      <line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line>
                      <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold">Our Vision</h2>
                </div>
                <p className="text-gray-700 text-center">
                  To preserve and promote the ancient art of Indian sculpture, creating divine masterpieces that inspire spiritual connection and cultural appreciation across generations and communities worldwide.
                </p>
              </div>
              
              {/* Mission */}
              <div className="bg-amber-50 p-8 rounded-lg shadow-md">
                <div className="text-center mb-6">
                  <div className="inline-block bg-amber-100 p-3 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                </div>
                <p className="text-gray-700 text-center">
                  To handcraft exquisite sculptures that embody divine essence and artistic excellence, using traditional techniques passed down through generations while embracing innovative approaches to meet contemporary needs and preferences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              We Give 100% Client Satisfaction In Their Orders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-sculpture-cream p-8 rounded-lg text-center">
                <h3 className="text-4xl text-amber-500 font-bold">25</h3>
                <p className="uppercase font-medium mt-2">Years Experience</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Our master sculptors have decades of experience crafting divine sculptures
                </p>
              </div>
              <div className="bg-sculpture-cream p-8 rounded-lg text-center">
                <h3 className="text-4xl text-amber-500 font-bold">3000</h3>
                <p className="uppercase font-medium mt-2">Orders</p>
                <p className="text-sm text-muted-foreground mt-2">
                  We have successfully completed over three thousand custom orders
                </p>
              </div>
              <div className="bg-sculpture-cream p-8 rounded-lg text-center">
                <h3 className="text-4xl text-amber-500 font-bold">5000</h3>
                <p className="uppercase font-medium mt-2">Happy Clients</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Thousands of satisfied clients worldwide trust our craftsmanship
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-sculpture-cream">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              We Provide Best Professional Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 rounded-lg text-center hover-scale bg-sculpture-cream">
                <img alt="Traditional handcrafted Hindu Gods stone sculptures by Abinash artisans" src="https://i.postimg.cc/x84jzpDk/Annapoorani.jpg" className="w-200 h-25 rounded-lg mb-4 object-contain" loading="lazy" />
                <h3 className="font-medium">Hindu Gods</h3>
              </div>
              <div className="p-4 rounded-lg text-center hover-scale bg-sculpture-cream">
                <img src="/lovable-uploads/966a3bb0-7519-4427-a96f-50d82f1d3f73.png" alt="Peaceful Buddha stone statues for meditation spaces - Abinash Sculptures" className="w-150 h-25 rounded-lg mb-4 object-contain" loading="lazy" />
                <h3 className="font-medium">Buddhas</h3>
              </div>
              <div className="p-4 rounded-lg text-center hover-scale bg-sculpture-cream">
                <img src="/lovable-uploads/0cafab96-a8a1-4bda-ab13-3fc042ddfef3.png" alt="Handcrafted miniature stone temples for home and worship - Abinash Sculptures" className="w-150 h-50 rounded-lg mb-4 object-contain" loading="lazy" />
                <h3 className="font-medium">Stone Temples</h3>
              </div>
              <div className="p-4 rounded-lg text-center hover-scale bg-sculpture-cream">
                <img alt="Lord Murugan hand-carved stone sculpture from Abinash master craftsmen" src="https://i.postimg.cc/s2NW1FD8/work4.jpg" className="w-150 h-25 rounded-lg mb-4 object-contain" loading="lazy" />
                <h3 className="font-medium">Lord Murugan</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-sculpture-darkpink font-semibold">OUR GALLERY</h3>
              <h2 className="text-3xl md:text-4xl font-bold">
                Discover Our Unique And Creative Photoshoot
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div className="relative group overflow-hidden rounded-lg">
                <img src="/lovable-uploads/966a3bb0-7519-4427-a96f-50d82f1d3f73.png" alt="Serene Buddha statue handcrafted in stone by Abinash Sculptures" className="w-full h-64 object-cover" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center">
                  <h4 className="font-medium">Buddha</h4>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <img alt="Traditional Karuppar deity sculpture handcrafted in stone" src="https://i.postimg.cc/BvzXCxFw/Work1.jpg" className="w-full h-64 object-cover" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center">
                  <h4 className="font-medium">Karuppar</h4>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <img src="/lovable-uploads/20755c49-1107-47f4-aad5-daca78334f2b.png" alt="Lord Ramar with Devi stone sculpture for temples and home altars" className="w-full h-64 object-cover" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center">
                  <h4 className="font-medium">Ramar With Devi</h4>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <img src="/lovable-uploads/4dd77698-dfcc-4125-a47d-10367a11c0e1.png" alt="Elegant Lord Krishna stone sculpture handcrafted by Abinash artisans" className="w-full h-64 object-cover" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center">
                  <h4 className="font-medium">Lord Krishna</h4>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <img src="/lovable-uploads/95eaae5e-d594-4c96-94b2-4c16e3c161be.png" alt="Miniature stone temple for home worship and decoration" className="w-full h-64 object-cover" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center">
                  <h4 className="font-medium">Stone Temple</h4>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <img alt="Traditional Annapoorani goddess sculpture for prosperity and abundance" className="w-full h-64 object-cover" src="https://i.postimg.cc/x84jzpDk/Annapoorani.jpg" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center">
                  <h4 className="font-medium">Annapoorani</h4>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <img alt="Lord Murugan stone sculpture for temples and religious ceremonies" className="w-full h-64 object-cover" src="https://i.postimg.cc/63xM9B8q/work4.jpg" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center">
                  <h4 className="font-medium">Murugan</h4>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <img alt="Traditional Amman goddess stone sculpture for divine protection" className="w-full h-64 object-cover" src="https://i.postimg.cc/59L6Yb61/Work2.jpg" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center">
                  <h4 className="font-medium">Amman</h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              More Than 5000+ Customers Trusted Us
            </h2>
            
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                <CarouselItem>
                  <div className="px-4">
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                          <div className="w-full sm:w-auto">
                            <Avatar className="h-16 w-16 mx-auto">
                              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="John Smith" />
                              <AvatarFallback>JS</AvatarFallback>
                            </Avatar>
                            <h4 className="font-semibold text-center mt-2">Client 1</h4>
                            <p className="text-sm text-center text-muted-foreground">
                          </p>
                          </div>
                          <div className="bg-amber-500 text-white p-6 rounded-lg">
                            <p className="italic">
                              "The attention to detail in the Hindu deity sculptures, especially Lord Krishna, exceeded all our expectations. The devotion and craftsmanship put into each piece is remarkable."
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="px-4">
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                          <div className="w-full sm:w-auto">
                            <Avatar className="h-16 w-16 mx-auto">
                              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emily" alt="Emily Johnson" />
                              <AvatarFallback>EJ</AvatarFallback>
                            </Avatar>
                            <h4 className="font-semibold text-center mt-2">Client Name</h4>
                            <p className="text-sm text-center text-muted-foreground">Client 2</p>
                          </div>
                          <div className="bg-amber-500 text-white p-6 rounded-lg">
                            <p className="italic">
                              "Working with our studio was a delight. They transformed my concept into a stunning Krishna sculpture that perfectly complements my devotional space."
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <div className="h-3 w-3 rounded-full bg-amber-200"></div>
              </div>
            </Carousel>
          </div>
        </section>
      </main>
      <Footer />
    </>;
};
export default Index;
