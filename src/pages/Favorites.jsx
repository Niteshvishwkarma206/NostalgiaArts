import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useArtworks } from '../context/ArtworkContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import MasonryGrid from '../components/MasonryGrid.jsx';

export default function Favorites() {
  const { artworks, loading } = useArtworks();
  const { favorites } = useFavorites();

  const saved = artworks.filter((a) => favorites.includes(a.id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
    >
      <p className="section-eyebrow flex items-center gap-1.5">
        <Heart size={14} /> Your Collection
      </p>
      <h1 className="page-title mt-1 mb-10">Favorites</h1>

      {!loading && saved.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="mx-auto text-onyx-300 dark:text-onyx-700 mb-4" size={40} />
          <p className="text-onyx-500 dark:text-onyx-400">You haven't saved any artworks yet.</p>
        </div>
      ) : (
        <MasonryGrid artworks={saved} loading={loading} />
      )}
    </motion.div>
  );
}
