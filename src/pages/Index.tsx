
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const Index: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="bg-sculpture-cream">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="text-sculpture-darkpink font-semibold">WELCOME TO</div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  Make The Divine Presence With Beautiful Sculptures
                </h1>
                <p className="text-lg text-muted-foreground">
                  Crafting unique, premium sculptures that embody emotion, creativity, and artistic excellence. 
                  We specialize in creating stunning religious sculptures that bring divine presence to your space.
                </p>
                <div>
                  <Link to="/works" className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded inline-block font-medium">
                    Explore More
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <img 
                    src="/lovable-uploads/f75bff38-a7f3-4c58-a95b-dca223dc1b03.png" 
                    alt="Ganesha Sculpture" 
                    className="w-full h-auto rounded-lg mb-4"
                  />
                  <img 
                    src="/lovable-uploads/4dd77698-dfcc-4125-a47d-10367a11c0e1.png" 
                    alt="Lord Krishna Sculpture" 
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div className="pt-12">
                  <img 
                    src="/lovable-uploads/4dd77698-dfcc-4125-a47d-10367a11c0e1.png" 
                    alt="Lord Krishna Sculpture" 
                    className="w-full h-auto rounded-lg mb-4"
                  />
                  <img 
                    src="/lovable-uploads/0cafab96-a8a1-4bda-ab13-3fc042ddfef3.png" 
                    alt="Stone Temple" 
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="/lovable-uploads/f75bff38-a7f3-4c58-a95b-dca223dc1b03.png" 
                  alt="Ganesha Sculpture" 
                  className="w-full h-auto rounded-lg"
                />
                <img 
                  src="/lovable-uploads/4dd77698-dfcc-4125-a47d-10367a11c0e1.png" 
                  alt="Lord Krishna Sculpture" 
                  className="w-full h-auto rounded-lg mt-12"
                />
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
              <div className="bg-white p-4 rounded-lg text-center hover-scale">
                <img 
                  src="/lovable-uploads/f75bff38-a7f3-4c58-a95b-dca223dc1b03.png" 
                  alt="Hindu Gods" 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-medium">Hindu Gods</h3>
              </div>
              <div className="bg-white p-4 rounded-lg text-center hover-scale">
                <img 
                  src="/lovable-uploads/966a3bb0-7519-4427-a96f-50d82f1d3f73.png" 
                  alt="Buddhas" 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-medium">Buddhas</h3>
              </div>
              <div className="bg-white p-4 rounded-lg text-center hover-scale">
                <img 
                  src="/lovable-uploads/0cafab96-a8a1-4bda-ab13-3fc042ddfef3.png" 
                  alt="Stone Temples" 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-medium">Stone Temples</h3>
              </div>
              <div className="bg-white p-4 rounded-lg text-center hover-scale">
                <img 
                  src="/lovable-uploads/4dd77698-dfcc-4125-a47d-10367a11c0e1.png" 
                  alt="Lord Krishna" 
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-medium">Lord Krishna</h3>
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
                <img 
                  src="/lovable-uploads/966a3bb0-7519-4427-a96f-50d82f1d3f73.png" 
                  alt="Buddha" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center">
                  <h4 className="font-medium">Buddha</h4>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <img 
                  src="/lovable-uploads/f75bff38-a7f3-4c58-a95b-dca223dc1b03.png" 
                  alt="Ganesha" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center">
                  <h4 className="font-medium">Ganesha</h4>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <img 
                  src="/lovable-uploads/20755c49-1107-47f4-aad5-daca78334f2b.png" 
                  alt="Traditional Devi" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center">
                  <h4 className="font-medium">Traditional Devi</h4>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <img 
                  src="/lovable-uploads/4dd77698-dfcc-4125-a47d-10367a11c0e1.png" 
                  alt="Lord Krishna" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center">
                  <h4 className="font-medium">Lord Krishna</h4>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <img 
                  src="/lovable-uploads/95eaae5e-d594-4c96-94b2-4c16e3c161be.png" 
                  alt="Vishnu with Lakshmi" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center">
                  <h4 className="font-medium">Divine Couple</h4>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <img 
                  src="/lovable-uploads/4dd77698-dfcc-4125-a47d-10367a11c0e1.png" 
                  alt="Lord Krishna" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center">
                  <h4 className="font-medium">Krishna</h4>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <img 
                  src="/lovable-uploads/0cafab96-a8a1-4bda-ab13-3fc042ddfef3.png" 
                  alt="Stone Temple" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center">
                  <h4 className="font-medium">Stone Temple</h4>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-lg">
                <img 
                  src="/lovable-uploads/4dd77698-dfcc-4125-a47d-10367a11c0e1.png" 
                  alt="Lord Krishna" 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center">
                  <h4 className="font-medium">Krishna Statue</h4>
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
                            <h4 className="font-semibold text-center mt-2">Client Name</h4>
                            <p className="text-sm text-center text-muted-foreground">Position</p>
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
                            <p className="text-sm text-center text-muted-foreground">Position</p>
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
    </>
  );
};

export default Index;
