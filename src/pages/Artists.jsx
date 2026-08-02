import { useState } from 'react';
import { motion } from 'framer-motion';
import { useArtworks } from '../context/ArtworkContext.jsx';
import { CategoryPills } from '../components/CategoryFilter.jsx';
import MasonryGrid from '../components/MasonryGrid.jsx';

export default function Artists() {
  const { artworks, artists, loading } = useArtworks();
  const [selected, setSelected] = useState('');

  const artistWorks = selected
    ? artworks.filter((a) => a.artist === selected && a.enabled !== false)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
    >
      <p className="section-eyebrow">The Makers</p>
      <h1 className="page-title mt-1 mb-8">Artists</h1>

      <div className="mb-10">
        <CategoryPills
          categories={artists}
          active={selected}
          onChange={setSelected}
        />
      </div>

      {selected ? (
        <>
          <h2 className="font-serif text-2xl mb-6">Works by {selected}</h2>
          <MasonryGrid artworks={artistWorks} loading={loading} />
        </>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {artists.map((artist) => {
            const works = artworks.filter((a) => a.artist === artist && a.enabled !== false);
            return (
              <button
                key={artist}
                onClick={() => setSelected(artist)}
                className="text-left rounded-2xl border border-onyx-200 dark:border-onyx-800 p-6 hover:border-gold-500 transition-colors"
              >
                <p className="font-serif text-xl">{artist}</p>
                <p className="text-sm text-onyx-400 mt-1">{works.length} artwork{works.length !== 1 && 's'}</p>
              </button>
            );
          })}
          {artists.length === 0 && (
            <p className="text-onyx-400">No artists to show yet.</p>
          )}
        </div>
      )}
    </motion.div>
  );
}
