import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Download, Expand, Tag } from 'lucide-react';
import { useArtworks } from '../context/ArtworkContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Lightbox from '../components/Lightbox.jsx';
import MasonryGrid from '../components/MasonryGrid.jsx';

export default function ArtworkDetails() {
  const { id } = useParams();
  const { artworks, loading } = useArtworks();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const artwork = artworks.find((a) => a.id === id);

  if (!loading && !artwork) return <Navigate to="/404" replace />;
  if (!artwork) return null;

  const fav = user && isFavorite(artwork.id);
  const related = artworks
    .filter((a) => a.id !== artwork.id && a.category === artwork.category && a.enabled !== false)
    .slice(0, 4);

  function handleFavorite() {
    if (!user) {
      showToast('Sign in to save this artwork to your favorites', 'info');
      return;
    }
    toggleFavorite(artwork.id);
    showToast(fav ? 'Removed from favorites' : 'Added to favorites', 'success');
  }

  const mailtoHref = `mailto:eranostalgia3@gmail.com?subject=${encodeURIComponent(
    `Inquiry: ${artwork.title}`
  )}&body=${encodeURIComponent(
    `Hello, I'm interested in "${artwork.title}" by ${artwork.artist} (listed at $${artwork.price}). Could you share more details?`
  )}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-2 gap-10">
        <div className="relative rounded-2xl overflow-hidden group">
          <img
            src={artwork.images?.[0]}
            alt={artwork.title}
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={() => setLightboxSrc(artwork.images?.[0])}
          />
          <button
            onClick={() => setLightboxSrc(artwork.images?.[0])}
            className="absolute bottom-4 right-4 h-10 w-10 grid place-items-center rounded-full glass text-onyx-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Fullscreen preview"
          >
            <Expand size={16} />
          </button>
        </div>

        <div>
          <p className="section-eyebrow">{artwork.category}</p>
          <h1 className="font-serif text-4xl font-semibold mt-1">{artwork.title}</h1>
          <p className="text-onyx-500 dark:text-onyx-400 mt-1">
            {artwork.artist} · {artwork.year}
          </p>

          <p className="text-2xl font-semibold text-gold-600 dark:text-gold-400 mt-6">
            ${Number(artwork.price).toLocaleString()}
          </p>
          <span className="inline-block mt-2 text-xs font-medium capitalize px-3 py-1 rounded-full border border-onyx-200 dark:border-onyx-800">
            {artwork.availability}
          </span>

          <p className="mt-6 text-onyx-600 dark:text-onyx-300 leading-relaxed">
            {artwork.description}
          </p>

          {artwork.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {artwork.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-onyx-100 dark:bg-onyx-900 text-onyx-500 dark:text-onyx-400"
                >
                  <Tag size={11} /> {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-8">
            <a href={mailtoHref} className="btn-gold">
              <Mail size={16} /> Inquire About This Piece
            </a>
            <button onClick={handleFavorite} className="btn-outline">
              <Heart size={16} className={fav ? 'fill-gold-500 text-gold-500' : ''} />
              {fav ? 'Saved' : 'Save to Favorites'}
            </button>
          </div>

          {artwork.resources?.length > 0 && (
            <div className="mt-10">
              <p className="text-sm font-semibold mb-3">Additional Resources</p>
              <ul className="space-y-2">
                {artwork.resources.map((res, i) => (
                  <li key={i} className="flex items-center justify-between rounded-xl border border-onyx-200 dark:border-onyx-800 px-4 py-2.5">
                    <span className="text-sm truncate">{res.name}</span>
                    <a href={res.url} download target="_blank" rel="noreferrer" className="text-gold-500 hover:text-gold-600">
                      <Download size={16} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-onyx-200 dark:border-onyx-800">
          <h2 className="font-serif text-2xl mb-8">More from {artwork.category}</h2>
          <MasonryGrid artworks={related} loading={false} />
        </div>
      )}

      <Lightbox src={lightboxSrc} alt={artwork.title} onClose={() => setLightboxSrc(null)} allowDownload />
    </motion.div>
  );
}
