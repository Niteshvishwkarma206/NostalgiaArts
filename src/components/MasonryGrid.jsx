import ArtworkCard from './ArtworkCard.jsx';
import { GridSkeleton } from './Skeleton.jsx';
import { ImageOff } from 'lucide-react';

export default function MasonryGrid({ artworks, loading }) {
  if (loading) return <GridSkeleton />;

  if (!artworks || artworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ImageOff className="text-onyx-300 dark:text-onyx-700 mb-4" size={40} />
        <p className="text-onyx-500 dark:text-onyx-400">No artworks match your search yet.</p>
        <p className="text-sm text-onyx-400 dark:text-onyx-500">Try adjusting your filters or keywords.</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
      {artworks.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </div>
  );
}
