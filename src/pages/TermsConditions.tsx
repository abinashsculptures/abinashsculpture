import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsConditions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Terms & Conditions | Abinash Sculptures</title>
        <meta name="description" content="Terms and conditions for Abinash Sculptures - custom stone sculptures, Hindu deity statues, Buddha statues, and temple art." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-stone dark:prose-invert">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            🧾 CUSTOM TERMS & CONDITIONS — ABINASH SCULPTURES
          </h1>
          <p className="text-muted-foreground mb-8">Last Updated: 09-12-2025</p>
          
          <p className="text-foreground">
            Welcome to Abinash Sculptures ("we", "our", or "us"). By using our website abinashsculptures.in, placing an order, or contacting us for custom sculptures, you agree to the following Terms & Conditions.
          </p>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">1. Nature of Business</h2>
            <ul className="list-disc pl-6 text-foreground">
              <li>Abinash Sculptures is engaged in the creation and sale of handcrafted stone sculptures, including Hindu deity statues, Buddha statues, temple art, and custom sculpting services.</li>
              <li>Each product is handmade, and slight variations in size, color, or texture are normal.</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">2. Orders & Custom Sculptures</h2>
            <ul className="list-disc pl-6 text-foreground">
              <li>Orders can be placed through our website, WhatsApp, or phone.</li>
              <li>Custom sculptures require:
                <ul className="list-disc pl-6 mt-2">
                  <li>Design approval</li>
                  <li>Advance payment (if applicable)</li>
                </ul>
              </li>
              <li>Once the custom work begins, cancellation is not allowed due to the manual craft involved.</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">3. Pricing</h2>
            <ul className="list-disc pl-6 text-foreground">
              <li>Prices listed on the website apply to standard products.</li>
              <li>Custom orders may vary based on size, material, and labor.</li>
              <li>We reserve the right to update prices at any time.</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">4. Payments</h2>
            <ul className="list-disc pl-6 text-foreground">
              <li>We accept online payments through Cashfree (UPI, Cards, Netbanking).</li>
              <li>For custom sculptures, advance or full payment may be required before work begins.</li>
              <li>Payments must be completed successfully before dispatch.</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">5. Shipping & Delivery</h2>
            <ul className="list-disc pl-6 text-foreground">
              <li>Delivery time varies depending on the sculpture size and location.</li>
              <li>We pack products securely, but delays caused by courier/transport partners are beyond our control.</li>
              <li>Buyers must provide accurate delivery details.</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">6. Refunds & Cancellations</h2>
            <ul className="list-disc pl-6 text-foreground">
              <li>For custom-made sculptures: No cancellation or refund after work begins.</li>
              <li>For ready-made products:
                <ul className="list-disc pl-6 mt-2">
                  <li>Cancellation allowed before dispatch.</li>
                  <li>Refunds will be issued only if the product is found damaged on arrival and proof is submitted within 24 hours.</li>
                  <li>Refund processing may take 5–7 business days.</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">7. Product Variations</h2>
            <p className="text-foreground">Since all items are handmade:</p>
            <ul className="list-disc pl-6 text-foreground">
              <li>Minor variations are normal</li>
              <li>Natural stone patterns differ</li>
              <li>No two products are identical</li>
            </ul>
            <p className="text-foreground mt-2">These variations cannot be considered defects.</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">8. Intellectual Property</h2>
            <p className="text-foreground">
              All images, designs, and descriptions on this website are owned by Abinash Sculptures.
              Copying, reselling, or reusing our product images or descriptions is prohibited.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">9. Limitation of Liability</h2>
            <p className="text-foreground">Abinash Sculptures is not responsible for:</p>
            <ul className="list-disc pl-6 text-foreground">
              <li>Delivery delays</li>
              <li>Damages caused by third-party couriers</li>
              <li>Incorrect addresses provided by customers</li>
            </ul>
            <p className="text-foreground mt-2">Our liability is limited to the product purchase amount.</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">10. Contact Information</h2>
            <p className="text-foreground">For inquiries or support:</p>
            <div className="text-foreground mt-2">
              <p><strong>Abinash Sculptures</strong></p>
              <p>Email: <a href="mailto:abinashsculptures@gmail.com" className="text-primary hover:underline">abinashsculptures@gmail.com</a></p>
              <p>Phone: <a href="tel:+917305971450" className="text-primary hover:underline">+91 7305971450</a></p>
              <p>Website: <a href="https://abinashsculptures.in" className="text-primary hover:underline">abinashsculptures.in</a></p>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsConditions;
