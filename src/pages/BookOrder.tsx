
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BookOrder: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'custom',
    budget: '',
    timeline: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', formData);
    
    // Show success message
    toast({
      title: "Request Submitted Successfully!",
      description: "We'll contact you within 24 hours to discuss your project.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      serviceType: 'custom',
      budget: '',
      timeline: '',
      description: ''
    });
  };

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-sculpture-cream">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Book an Order</h1>
              <p className="text-lg text-muted-foreground">
                Fill out the form below to start the conversation about your next sculpture project.
              </p>
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="card bg-white shadow-lg p-8">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sculpture-peach focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sculpture-peach focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sculpture-peach focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="serviceType" className="block text-sm font-medium mb-1">
                        Service Type *
                      </label>
                      <select
                        id="serviceType"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sculpture-peach focus:border-transparent"
                        required
                      >
                        <option value="custom">Custom Sculpture</option>
                        <option value="restoration">Restoration</option>
                        <option value="workshop">Workshop Booking</option>
                        <option value="consultation">Art Consultation</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="budget" className="block text-sm font-medium mb-1">
                          Budget Range
                        </label>
                        <input
                          type="text"
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          placeholder="e.g., $1,000-$5,000"
                          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sculpture-peach focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="timeline" className="block text-sm font-medium mb-1">
                          Desired Timeline
                        </label>
                        <input
                          type="text"
                          id="timeline"
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleChange}
                          placeholder="e.g., 3 months"
                          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sculpture-peach focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium mb-1">
                        Project Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sculpture-peach focus:border-transparent"
                        required
                      ></textarea>
                    </div>

                    <div className="text-center pt-4">
                      <button type="submit" className="btn-primary w-full md:w-auto md:px-10">
                        Submit Request
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="section-padding bg-sculpture-gray">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Other Ways to Reach Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card text-center">
                  <h3 className="text-xl font-semibold mb-2">Phone</h3>
                  <p className="text-muted-foreground">(555) 123-4567</p>
                </div>
                <div className="card text-center">
                  <h3 className="text-xl font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">info@sculptstudio.com</p>
                </div>
                <div className="card text-center">
                  <h3 className="text-xl font-semibold mb-2">Visit Our Studio</h3>
                  <p className="text-muted-foreground">123 Sculptor Lane, Art District</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default BookOrder;
