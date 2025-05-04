
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Updated portfolio data with real images and new names
const portfolioItems = [
  { 
    id: 1, 
    title: "Lord Ganesh", 
    category: "Hindu Gods", 
    year: 2023,
    image: "/lovable-uploads/f75bff38-a7f3-4c58-a95b-dca223dc1b03.png", 
    description: "Exquisitely detailed Ganesha sculpture with intricate carving"
  },
  { 
    id: 2, 
    title: "Meditating Buddha", 
    category: "Buddha", 
    year: 2023,
    image: "/lovable-uploads/966a3bb0-7519-4427-a96f-50d82f1d3f73.png",
    description: "Serene Buddha sculpture in traditional meditation pose"
  },
  { 
    id: 3, 
    title: "Stone Temple", 
    category: "Temple", 
    year: 2022,
    image: "/lovable-uploads/fcbef6d2-2918-4e70-8608-d0871c7d9a4f.png",
    description: "Elegant stone temple doorway with traditional architecture"
  },
  { 
    id: 4, 
    title: "Annapoorani", 
    category: "Hindu Gods", 
    year: 2022,
    image: "/lovable-uploads/95eaae5e-d594-4c96-94b2-4c16e3c161be.png",
    description: "Detailed sculpture with traditional elements"
  },
  { 
    id: 5, 
    title: "Lord Krishna", 
    category: "Hindu Gods", 
    year: 2021,
    image: "/lovable-uploads/636bb5a8-10fc-4b88-b8ea-bb07337d922e.png",
    description: "Beautiful sculpture of Lord Krishna playing the flute"
  },
  { 
    id: 6, 
    title: "Standing Warrior", 
    category: "Custom", 
    year: 2021,
    image: "/lovable-uploads/daeca681-c10c-447f-8787-e6a09e09577f.png",
    description: "Majestic warrior sculpture with traditional details"
  },
  { 
    id: 7, 
    title: "Lord Murugan", 
    category: "Hindu Gods", 
    year: 2020,
    image: "/lovable-uploads/87f797e2-3d15-4e6c-857c-ee05dee9daf4.png",
    description: "Impressive sculpture of Lord Murugan with ornate details"
  },
  { 
    id: 8, 
    title: "Ramar With Devi", 
    category: "Hindu Gods", 
    year: 2020,
    image: "/lovable-uploads/20755c49-1107-47f4-aad5-daca78334f2b.png",
    description: "Beautiful sculpture depicting Lord Rama with goddess"
  },
];

const categories = ["All", "Hindu Gods", "Buddha", "Temple", "Custom"];

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
                      ? 'bg-sculpture-pink text-foreground'
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
                  <div className="rounded-lg overflow-hidden mb-4">
                    <AspectRatio ratio={3/4} className="bg-sculpture-gray">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover" 
                      />
                    </AspectRatio>
                  </div>
                  <h3 className="text-xl font-serif font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
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
