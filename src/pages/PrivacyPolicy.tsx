import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Privacy Policy | Abinash Sculptures</title>
        <meta name="description" content="Privacy policy for Abinash Sculptures - learn how we collect, use, and protect your personal information." />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-stone dark:prose-invert">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            🔒 CUSTOM PRIVACY POLICY — ABINASH SCULPTURES
          </h1>
          <p className="text-muted-foreground mb-8">Last Updated: 09-12-2025</p>
          
          <p className="text-foreground">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information when you visit abinashsculptures.in or interact with our services.
          </p>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
            <p className="text-foreground">We collect the following information when you interact with us:</p>
            
            <h3 className="text-xl font-medium text-foreground mt-4">Personal Information</h3>
            <ul className="list-disc pl-6 text-foreground">
              <li>Name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Delivery address</li>
              <li>Payment details (processed securely via Cashfree)</li>
            </ul>
            
            <h3 className="text-xl font-medium text-foreground mt-4">Website Usage Data</h3>
            <ul className="list-disc pl-6 text-foreground">
              <li>IP address</li>
              <li>Browser information</li>
              <li>Pages visited</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p className="text-foreground">We use your data to:</p>
            <ul className="list-disc pl-6 text-foreground">
              <li>Process orders and payments</li>
              <li>Contact you regarding your purchase</li>
              <li>Deliver sculptures to your address</li>
              <li>Provide customer support</li>
              <li>Improve our website and services</li>
            </ul>
            <p className="text-foreground mt-2 font-medium">We do not sell, rent, or trade your personal information.</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">3. Payment Security</h2>
            <p className="text-foreground">All payments are processed via Cashfree Payment Gateway, which follows:</p>
            <ul className="list-disc pl-6 text-foreground">
              <li>PCI-DSS security standards</li>
              <li>UPI & banking security protocols</li>
              <li>Encrypted payment processing</li>
            </ul>
            <p className="text-foreground mt-2 font-medium">Your card and banking details are never stored on our website.</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">4. Cookies</h2>
            <p className="text-foreground">
              We use cookies to improve user experience. You can disable them in your browser settings.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">5. Sharing of Information</h2>
            <p className="text-foreground">We only share your data with:</p>
            <ul className="list-disc pl-6 text-foreground">
              <li>Delivery partners</li>
              <li>Payment gateway (Cashfree)</li>
              <li>Our internal operations team</li>
            </ul>
            <p className="text-foreground mt-2 font-medium">We do not share data with advertisers or unrelated third parties.</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">6. Data Storage & Protection</h2>
            <p className="text-foreground">
              We take reasonable technical measures to secure your data.
              However, no system is 100% secure.
              By using our website, you accept this risk.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">7. User Rights</h2>
            <p className="text-foreground">You may request:</p>
            <ul className="list-disc pl-6 text-foreground">
              <li>Access to your data</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your stored data</li>
            </ul>
            <p className="text-foreground mt-2">Contact us via email for such requests.</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">8. Changes to This Policy</h2>
            <p className="text-foreground">
              We may update this Privacy Policy occasionally.
              Continued use of our website indicates acceptance of the latest version.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-foreground">9. Contact Information</h2>
            <p className="text-foreground">If you have questions about this Privacy Policy:</p>
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

export default PrivacyPolicy;
