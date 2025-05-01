
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Sample portfolio data
const portfolioItems = [
  { id: 1, title: "Eternal Embrace", category: "Stone", year: 2023 },
  { id: 2, title: "Oceanic Reverie", category: "Metal", year: 2023 },
  { id: 3, title: "Forest Whispers", category: "Wood", year: 2022 },
  { id: 4, title: "Urban Symphony", category: "Mixed Media", year: 2022 },
  { id: 5, title: "Celestial Dance", category: "Stone", year: 2021 },
  { id: 6, title: "Autumn Reflections", category: "Wood", year: 2021 },
  { id: 7, title: "Industrial Dreams", category: "Metal", year: 2020 },
  { id: 8, title: "Harmonic Convergence", category: "Mixed Media", year: 2020 },
  { id: 9, title: "Desert Mirage", category: "Stone", year: 2019 },
];

const categories = ["All", "Stone", "Metal", "Wood", "Mixed Media"];

const Works: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = selectedCategory === "All"
    ? portfolioItems
    : portfolioItems.filter(item => item.category === selectedCategory);

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-sculpture-peach bg-opacity-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Portfolio</h1>
              <p className="text-lg text-muted-foreground">
                Explore our collection of handcrafted sculptures across various materials and styles.
              </p>
            </div>
          </div>
        </section>

        {/* Filter Categories */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                    selectedCategory === category
                      ? 'bg-sculpture-peach text-foreground'
                      : 'bg-gray-100 hover:bg-sculpture-blue hover:bg-opacity-30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div key={item.id} className="card hover-scale">
                  <div className="h-64 bg-sculpture-gray rounded mb-4"></div>
                  <h3 className="text-xl font-serif font-semibold mb-1">{item.title}</h3>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{item.category}</span>
                    <span>{item.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commission CTA */}
        <section className="py-16 bg-sculpture-blue bg-opacity-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Interested in a Custom Piece?</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              We'd love to create a unique sculpture tailored specifically for you. Our artists can work with your vision to create something truly special.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/book" className="btn-primary">
                Commission a Sculpture
              </a>
              <a href="/services" className="btn-secondary">
                Learn About Our Process
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Works;
