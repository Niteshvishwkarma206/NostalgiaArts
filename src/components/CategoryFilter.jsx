export function CategoryPills({ categories, active, onChange }) {
  const all = ['All', ...categories];
  return (
    <div className="flex flex-wrap gap-2">
      {all.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat === 'All' ? '' : cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            (active === cat) || (active === '' && cat === 'All')
              ? 'bg-gold-500 border-gold-500 text-onyx-950'
              : 'border-onyx-200 dark:border-onyx-800 text-onyx-600 dark:text-onyx-300 hover:border-gold-500 hover:text-gold-600'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export function SortSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-field w-auto py-2.5 cursor-pointer"
    >
      <option value="recent">Latest Uploads</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="alpha">Alphabetical (A–Z)</option>
      <option value="vintage">Vintage (Oldest Year)</option>
    </select>
  );
}
