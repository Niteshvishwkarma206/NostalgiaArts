import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useArtworks } from '../context/ArtworkContext.jsx';
import MasonryGrid from '../components/MasonryGrid.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { CategoryPills, SortSelect } from '../components/CategoryFilter.jsx';

export default function Gallery() {
  const { artworks, categories, loading } = useArtworks();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const category = params.get('category') || '';

  const setCategory = (cat) => {
    if (cat) setParams({ category: cat });
    else setParams({});
  };

  const filtered = useMemo(() => {
    let list = artworks.filter((a) => a.enabled !== false);

    if (category) list = list.filter((a) => a.category === category);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.artist?.toLowerCase().includes(q) ||
          a.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case 'price-asc':
        list = list.slice().sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = list.slice().sort((a, b) => b.price - a.price);
        break;
      case 'alpha':
        list = list.slice().sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'vintage':
        list = list.slice().sort((a, b) => a.year - b.year);
        break;
      default:
        list = list.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    return list;
  }, [artworks, category, search, sort]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
    >
      <p className="section-eyebrow">The Collection</p>
      <h1 className="page-title mt-1 mb-8">Gallery</h1>

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-6">
        <div className="lg:max-w-sm w-full">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <SortSelect value={sort} onChange={setSort} />
      </div>

      <div className="mb-10">
        <CategoryPills categories={categories} active={category} onChange={setCategory} />
      </div>

      <p className="text-sm text-onyx-400 mb-6">{filtered.length} artwork{filtered.length !== 1 && 's'}</p>

      <MasonryGrid artworks={filtered} loading={loading} />
    </motion.div>
  );
}
