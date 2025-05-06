
import React from 'react';

const SEOFaq: React.FC = () => {
  return (
    <section className="py-16 bg-white" id="faqs">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground mt-4">
            Find answers to common questions about our sculptures, materials, and services
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          <div className="py-6">
            <h3 className="text-xl font-medium mb-2">What types of sculptures do you make?</h3>
            <p className="text-gray-600">
              We specialize in handmade Hindu god sculptures, Buddha statues, stone temples, and traditional stone household items like ammikal.
            </p>
          </div>
          
          <div className="py-6">
            <h3 className="text-xl font-medium mb-2">Can I order a customized sculpture based on my design or idea?</h3>
            <p className="text-gray-600">
              Yes, we accept custom sculpture orders based on your reference photos, deity preference, size, and material.
            </p>
          </div>
          
          <div className="py-6">
            <h3 className="text-xl font-medium mb-2">What materials are used in your sculptures?</h3>
            <p className="text-gray-600">
              We primarily use high-quality granite, sandstone, and marble for durability and a traditional finish.
            </p>
          </div>
          
          <div className="py-6">
            <h3 className="text-xl font-medium mb-2">Do you ship sculptures across India or internationally?</h3>
            <p className="text-gray-600">
              Yes, we deliver across India and also handle international orders on request. All shipments are securely packed to avoid damage.
            </p>
          </div>
          
          <div className="py-6">
            <h3 className="text-xl font-medium mb-2">How long does it take to complete a custom sculpture?</h3>
            <p className="text-gray-600">
              It depends on the size and complexity, but typically it takes 2–6 weeks for completion and dispatch.
            </p>
          </div>
          
          <div className="py-6">
            <h3 className="text-xl font-medium mb-2">What is an ammikal, and do you sell it?</h3>
            <p className="text-gray-600">
              An ammikal is a traditional Indian grinding stone used for making spice pastes. Yes, we sell handmade ammikal for home kitchens and temple use.
            </p>
          </div>
          
          <div className="py-6">
            <h3 className="text-xl font-medium mb-2">Are your sculptures suitable for temples and pujas?</h3>
            <p className="text-gray-600">
              Absolutely. All our sculptures are crafted with spiritual precision, making them ideal for temples, home altars, and religious ceremonies.
            </p>
          </div>
          
          <div className="py-6">
            <h3 className="text-xl font-medium mb-2">How do I maintain and clean stone sculptures?</h3>
            <p className="text-gray-600">
              Gently wipe with a damp cloth. Avoid harsh chemicals. For outdoor sculptures, periodic brushing is recommended to remove dust.
            </p>
          </div>
          
          <div className="py-6">
            <h3 className="text-xl font-medium mb-2">Can I visit your workshop before placing a bulk or temple order?</h3>
            <p className="text-gray-600">
              Yes, you are welcome to visit our workshop. Please contact us in advance to schedule a visit.
            </p>
          </div>
          
          <div className="py-6">
            <h3 className="text-xl font-medium mb-2">Do you provide a certificate or invoice with each sculpture?</h3>
            <p className="text-gray-600">
              Yes, we provide a detailed invoice and, upon request, a certificate of authenticity for every sculpture.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOFaq;
