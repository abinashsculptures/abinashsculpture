
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartoonAvatar from '../components/CartoonAvatar';

const About: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-sculpture-cream">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About Abinash Sculptures</h1>
              <p className="text-lg text-muted-foreground">
                Discover the passion, expertise, and artistic vision behind our sculpture studio.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="mb-4">
                  Founded with a deep reverence for traditional art forms, Abinash Sculptures began as a small workshop dedicated to creating unique pieces that combine traditional sculpting techniques with contemporary artistic vision.
                </p>
                <p className="mb-4">
                  Over the years, we've grown into a premier sculpture studio, known for our commitment to quality, attention to detail, and ability to transform raw materials into breathtaking works of art.
                </p>
                <p>
                  Our founder's vision was to create sculptures that not only please the eye but also touch the soul, especially in our crafting of Hindu deities and Buddha sculptures that radiate spiritual essence.
                </p>
              </div>
              <div className="bg-sculpture-gray h-80 rounded-lg"></div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="section-padding bg-sculpture-blue bg-opacity-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Mission & Values</h2>
              <p className="mb-8">
                We are committed to creating exceptional sculptures that celebrate artistic expression, craftsmanship, and the spiritual significance of our art forms.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <h3 className="text-xl font-semibold mb-4">Artistic Excellence</h3>
                <p>
                  We strive for perfection in every piece we create, honoring traditional techniques while pushing the boundaries of what's possible in sculpture.
                </p>
              </div>
              <div className="card text-center">
                <h3 className="text-xl font-semibold mb-4">Sacred Craftsmanship</h3>
                <p>
                  We approach the creation of religious sculptures with reverence and devotion, ensuring each piece carries spiritual significance.
                </p>
              </div>
              <div className="card text-center">
                <h3 className="text-xl font-semibold mb-4">Client Vision</h3>
                <p>
                  We collaborate closely with our clients to bring their unique vision to life, creating pieces that resonate on a personal and spiritual level.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Master Sculptors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Abinash Kumar", role: "Founder & Lead Sculptor" },
                { name: "Rajiv Mehta", role: "Stone Specialist" },
                { name: "Priya Sharma", role: "Detail Work Expert" }
              ].map((member) => (
                <div key={member.name} className="card text-center">
                  <div className="mx-auto mb-4 flex justify-center">
                    <CartoonAvatar name={member.name} />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-muted-foreground mb-4">{member.role}</p>
                  <p>
                    With over a decade of experience in sculpture arts, specializing in creating expressive and spiritually resonant pieces.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Studio Space */}
        <section className="section-padding bg-sculpture-peach bg-opacity-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="bg-sculpture-gray h-80 rounded-lg order-2 md:order-1"></div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold mb-6">Our Studio Space</h2>
                <p className="mb-4">
                  Located in a tranquil environment conducive to creative work, our studio is a space where divine inspiration meets artistic skill. The workspace houses both traditional tools and modern equipment to create sculptures of varying scales.
                </p>
                <p>
                  We've designed our studio to be both functional and inspiring, with dedicated areas for different types of work, from intricate detailing to large-scale stone carving.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
