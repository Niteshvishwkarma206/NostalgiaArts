import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const STATUS_STYLES = {
  available: 'bg-emerald-500/90 text-white',
  reserved: 'bg-amber-500/90 text-white',
  sold: 'bg-onyx-700/90 text-white',
};

export default function ArtworkCard({ artwork }) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const fav = user && isFavorite(artwork.id);

  function handleFavClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Sign in to save artworks to your favorites', 'info');
      return;
    }
    toggleFavorite(artwork.id);
    showToast(fav ? 'Removed from favorites' : 'Added to favorites', 'success');
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="break-inside-avoid mb-6 group"
    >
      <Link to={`/artwork/${artwork.id}`} className="block relative overflow-hidden rounded-2xl">
        <img
          src={artwork.images?.[0]}
          alt={artwork.title}
          loading="lazy"
          className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 left-3 flex gap-2">
          {artwork.featured && (
            <span className="flex items-center gap-1 rounded-full bg-gold-500 text-onyx-950 text-xs font-medium px-2.5 py-1">
              <Star size={12} fill="currentColor" /> Featured
            </span>
          )}
          <span className={`rounded-full text-xs font-medium px-2.5 py-1 capitalize ${STATUS_STYLES[artwork.availability] || STATUS_STYLES.available}`}>
            {artwork.availability}
          </span>
        </div>

        <button
          onClick={handleFavClick}
          aria-label="Toggle favorite"
          className="absolute top-3 right-3 grid place-items-center h-9 w-9 rounded-full glass text-onyx-900 dark:text-onyx-50 hover:text-gold-500 transition-colors"
        >
          <Heart size={16} className={fav ? 'fill-gold-500 text-gold-500' : ''} />
        </button>

        <div className="absolute bottom-0 inset-x-0 p-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <p className="text-white font-serif text-lg leading-tight">{artwork.title}</p>
          <p className="text-white/80 text-sm">{artwork.artist} · {artwork.year}</p>
        </div>
      </Link>
      <div className="mt-3 px-0.5 flex items-center justify-between">
        <div>
          <p className="font-medium text-onyx-900 dark:text-onyx-50">{artwork.title}</p>
          <p className="text-sm text-onyx-500 dark:text-onyx-400">{artwork.artist}</p>
        </div>
        <p className="text-sm font-semibold text-gold-600 dark:text-gold-400">
          ${Number(artwork.price).toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
}
