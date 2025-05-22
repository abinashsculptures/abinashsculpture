
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Loader2 } from 'lucide-react';

// Define the work item type
type WorkItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  year: number;
  image: string;
};

const categories = ["All", "Hindu Gods", "Buddha", "Temple", "Custom"];

const Works: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch works from Supabase
  useEffect(() => {
    const fetchWorks = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('works')
          .select('*')
          .order('year', { ascending: false });
        
        if (error) throw error;
        setWorks(data || []);
      } catch (err: any) {
        console.error('Error fetching works:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  const filteredItems = selectedCategory === "All"
    ? works
    : works.filter(item => item.category === selectedCategory);

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
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-sculpture-blue" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-500">Error loading works: {error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.length === 0 ? (
                  <div className="col-span-full text-center py-16">
                    <p className="text-lg text-muted-foreground">No works found in this category.</p>
                  </div>
                ) : (
                  filteredItems.map((item) => (
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
                  ))
                )}
              </div>
            )}
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
