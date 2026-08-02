import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useArtworks } from '../context/ArtworkContext.jsx';

const CATEGORY_IMAGES = {
  Paintings: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?q=80&w=1000',
  'Digital Art': 'https://images.unsplash.com/photo-1633186710895-309db2eca9e4?q=80&w=1000',
  Photography: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=1000',
  Sculptures: 'https://images.unsplash.com/photo-1608599947359-6c0e97d3aa7c?q=80&w=1000',
};

export default function Categories() {
  const { artworks, categories } = useArtworks();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
    >
      <p className="section-eyebrow">Browse the Collection</p>
      <h1 className="page-title mt-1 mb-10">Categories</h1>

      <div className="grid sm:grid-cols-2 gap-6">
        {(categories.length ? categories : Object.keys(CATEGORY_IMAGES)).map((cat) => {
          const count = artworks.filter((a) => a.category === cat && a.enabled !== false).length;
          return (
            <Link
              key={cat}
              to={`/gallery?category=${encodeURIComponent(cat)}`}
              className="group relative h-64 overflow-hidden rounded-2xl"
            >
              <img
                src={CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.Paintings}
                alt={cat}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className="text-white font-serif text-2xl">{cat}</p>
                <p className="text-white/70 text-sm">{count} piece{count !== 1 && 's'}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
