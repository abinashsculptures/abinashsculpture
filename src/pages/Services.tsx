
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Services: React.FC = () => {
  const services = [
    {
      title: "Custom Sculptures",
      description: "Commission a unique sculpture tailored to your specific vision, space, and preferences. We work with a variety of materials to create one-of-a-kind pieces that reflect your personal style.",
      details: [
        "Initial consultation and concept development",
        "Sketches and digital mockups",
        "Material selection guidance",
        "Regular progress updates",
        "Professional installation available"
      ],
      image: "/lovable-uploads/daeca681-c10c-447f-8787-e6a09e09577f.png"
    },
    {
      title: "Hindu Gods Sculptures",
      description: "Beautiful and sacred sculptures of Hindu deities crafted with devotion and attention to traditional iconography. Perfect for temples, shrines, or personal worship spaces.",
      details: [
        "Traditional and contemporary designs",
        "Multiple sizes available",
        "Variety of materials including stone, bronze, and marble",
        "Customized bases and pedestals",
        "Consecration assistance available"
      ],
      image: "/lovable-uploads/636bb5a8-10fc-4b88-b8ea-bb07337d922e.png"
    },
    {
      title: "Buddha Sculptures",
      description: "Serene and peaceful Buddha statues that bring tranquility and mindfulness to any space. Available in various poses, sizes, and materials.",
      details: [
        "Multiple meditation poses available",
        "Traditional and modern interpretations",
        "Indoor and outdoor options",
        "Specialty finishes and patinas",
        "Custom sizing available"
      ],
      image: "/lovable-uploads/966a3bb0-7519-4427-a96f-50d82f1d3f73.png"
    },
    {
      title: "Stone Temple Designs",
      description: "Expert craftsmanship for stone temple elements, from ornate doorways to complete temple structures, designed according to traditional Vastu principles.",
      details: [
        "Architectural consultation and planning",
        "Traditional stone selection",
        "Hand-carved details and ornamentation",
        "On-site installation and assembly",
        "Restoration of existing temple structures"
      ],
      image: "/lovable-uploads/fcbef6d2-2918-4e70-8608-d0871c7d9a4f.png"
    }
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-sculpture-blue bg-opacity-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
              <p className="text-lg text-muted-foreground">
                From custom creations to sacred sculptures, we offer comprehensive artistic services tailored to your needs.
              </p>
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-16">
              {services.map((service, index) => (
                <div key={service.title} className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={index % 2 === 1 ? 'order-1 md:order-2' : ''}>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">{service.title}</h2>
                    <p className="mb-6 text-muted-foreground">{service.description}</p>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">What's Included:</h3>
                      <ul className="space-y-2">
                        {service.details.map((detail, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-sculpture-pink mr-2">•</span> {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link to="/book" className="btn-primary inline-block">
                      Inquire Now
                    </Link>
                  </div>
                  <div className={`h-64 md:h-80 rounded-lg overflow-hidden ${index % 2 === 1 ? 'order-2 md:order-1' : ''}`}>
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding bg-sculpture-cream">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-sculpture-pink rounded-full text-white font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-xl font-semibold ml-4">Consultation</h3>
                </div>
                <p>
                  We begin with an in-depth consultation to understand your vision, requirements, and the context for the sculpture. This helps us align our artistic approach with your expectations.
                </p>
              </div>
              <div className="card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-sculpture-pink rounded-full text-white font-bold text-xl">
                    2
                  </div>
                  <h3 className="text-xl font-semibold ml-4">Design & Planning</h3>
                </div>
                <p>
                  Our artists create concept sketches and detailed plans. Once approved, we select materials and develop a timeline for the project, ensuring everything meets your expectations.
                </p>
              </div>
              <div className="card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-sculpture-pink rounded-full text-white font-bold text-xl">
                    3
                  </div>
                  <h3 className="text-xl font-semibold ml-4">Creation & Delivery</h3>
                </div>
                <p>
                  Our skilled sculptors bring the design to life with meticulous craftsmanship. We provide progress updates throughout, and deliver the finished piece with professional installation if needed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-sculpture-blue bg-opacity-10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Contact us today to discuss your project or book one of our services.
            </p>
            <Link to="/book" className="btn-primary">
              Book a Service
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Services;
