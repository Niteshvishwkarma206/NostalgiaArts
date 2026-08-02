import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search artworks, artists, tags…' }) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-onyx-400" size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-11 pr-10"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-onyx-400 hover:text-onyx-700 dark:hover:text-onyx-200"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
