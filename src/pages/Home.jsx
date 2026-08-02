import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useArtworks } from '../context/ArtworkContext.jsx';
import MasonryGrid from '../components/MasonryGrid.jsx';

const CATEGORY_IMAGES = {
  Paintings: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?q=80&w=800',
  'Digital Art': 'https://images.unsplash.com/photo-1633186710895-309db2eca9e4?q=80&w=800',
  Photography: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=800',
  Sculptures: 'https://images.unsplash.com/photo-1608599947359-6c0e97d3aa7c?q=80&w=800',
};

export default function Home() {
  const { artworks, categories, loading } = useArtworks();
  const featured = artworks.filter((a) => a.featured && a.enabled !== false).slice(0, 8);
  const latest = artworks
    .filter((a) => a.enabled !== false)
    .slice()
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 8);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=1800"
            alt=""
            className="w-full h-full object-cover opacity-30 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-onyx-50 via-onyx-50/70 to-onyx-50 dark:from-onyx-950 dark:via-onyx-950/80 dark:to-onyx-950" />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-24 pb-28 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-eyebrow inline-flex items-center gap-1.5"
          >
            <Sparkles size={14} /> A Curated Collection
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 font-serif text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05]"
          >
            Where Art Meets <span className="text-gold-500 italic">Permanence</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-lg text-onyx-500 dark:text-onyx-400 max-w-2xl mx-auto"
          >
            Fine paintings, conceptual digital works, monochrome photography, and hand-cast
            sculpture — each piece selected for collectors who build for the long term.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <Link to="/gallery" className="btn-gold">
              Explore the Gallery <ArrowRight size={16} />
            </Link>
            <Link to="/about" className="btn-outline">
              Our Story
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-eyebrow">Browse by</p>
            <h2 className="page-title mt-1 text-3xl md:text-4xl">Categories</h2>
          </div>
          <Link to="/categories" className="hidden sm:flex items-center gap-1 text-sm font-medium text-gold-600 dark:text-gold-400 hover:gap-2 transition-all">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {(categories.length ? categories : Object.keys(CATEGORY_IMAGES)).map((cat) => (
            <Link
              key={cat}
              to={`/gallery?category=${encodeURIComponent(cat)}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <img
                src={CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.Paintings}
                alt={cat}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
              <span className="absolute bottom-4 left-4 text-white font-serif text-xl">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <p className="section-eyebrow">Curator's Picks</p>
          <h2 className="page-title mt-1 text-3xl md:text-4xl mb-8">Featured Artworks</h2>
          <MasonryGrid artworks={featured} loading={loading} />
        </section>
      )}

      {/* Latest */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <p className="section-eyebrow">Fresh to the Gallery</p>
        <h2 className="page-title mt-1 text-3xl md:text-4xl mb-8">Latest Uploads</h2>
        <MasonryGrid artworks={latest} loading={loading} />
        <div className="text-center mt-10">
          <Link to="/gallery" className="btn-outline">
            View Full Gallery <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </motion.div>
  );
}
