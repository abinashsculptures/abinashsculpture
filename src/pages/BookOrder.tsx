import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '@/integrations/supabase/client';

const BookOrder: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'hindu-gods',
    statueName: '',
    sculptureSize: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Insert the form data into the Supabase table
      const { error } = await supabase
        .from('order_requests')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service_type: formData.serviceType,
          budget: formData.sculptureSize, // Using existing budget field for sculptureSize
          timeline: formData.statueName, // Using existing timeline field for statueName
          description: formData.description
        });
      
      if (error) {
        console.error('Error submitting form:', error);
        toast({
          title: "Something went wrong",
          description: "Your request couldn't be submitted. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
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
        serviceType: 'hindu-gods',
        statueName: '',
        sculptureSize: '',
        description: ''
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again.",
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
                        disabled={isSubmitting}
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
                          disabled={isSubmitting}
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
                          disabled={isSubmitting}
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
                        disabled={isSubmitting}
                      >
                        <option value="hindu-gods">Hindu Gods</option>
                        <option value="buddhas">Buddhas</option>
                        <option value="stone-temples">Stone Temples</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="statueName" className="block text-sm font-medium mb-1">
                          Name of the Statue *
                        </label>
                        <input
                          type="text"
                          id="statueName"
                          name="statueName"
                          value={formData.statueName}
                          onChange={handleChange}
                          placeholder="e.g., Lord Krishna, Buddha"
                          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sculpture-peach focus:border-transparent"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label htmlFor="sculptureSize" className="block text-sm font-medium mb-1">
                          Size of the Sculpture *
                        </label>
                        <input
                          type="text"
                          id="sculptureSize"
                          name="sculptureSize"
                          value={formData.sculptureSize}
                          onChange={handleChange}
                          placeholder="e.g., 2ft x 1ft"
                          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sculpture-peach focus:border-transparent"
                          required
                          disabled={isSubmitting}
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
                        disabled={isSubmitting}
                      ></textarea>
                    </div>

                    <div className="text-center pt-4">
                      <button 
                        type="submit" 
                        className="btn-primary w-full md:w-auto md:px-10"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information - Updated with correct info */}
        <section className="section-padding bg-sculpture-gray">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Other Ways to Reach Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card text-center">
                  <h3 className="text-xl font-semibold mb-2">Phone</h3>
                  <p className="text-muted-foreground">+919444425392</p>
                </div>
                <div className="card text-center">
                  <h3 className="text-xl font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">abinashsculptures@gmail.com</p>
                </div>
                <div className="card text-center">
                  <h3 className="text-xl font-semibold mb-2">Visit Our Studio</h3>
                  <p className="text-muted-foreground">Mamallapuram, TamilNadu, India</p>
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
