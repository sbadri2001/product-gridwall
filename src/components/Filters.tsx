import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { FiltersState } from '../types';

interface FiltersProps {
  filters: FiltersState;
  onFiltersChange: (newFilters: FiltersState) => void;
  categories: string[];
  maxPriceLimit: number;
}

export default function Filters({ filters, onFiltersChange, categories, maxPriceLimit }: FiltersProps) {
  const handleSearchChange = (val: string) => {
    onFiltersChange({ ...filters, search: val });
  };

  const handleCategorySelect = (category: string | null) => {
    onFiltersChange({ ...filters, category });
  };

  const handlePriceChange = (val: number) => {
    onFiltersChange({ ...filters, maxPrice: val });
  };

  const handleSortChange = (sortBy: FiltersState['sortBy']) => {
    onFiltersChange({ ...filters, sortBy });
  };

  return (
    <div id="filters-panel" className="w-full bg-white border border-gray-100 rounded-xl p-6 shadow-2xs space-y-6">
      {/* Top row: Search and Sort */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input field */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute top-1/2 left-4.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="product-search-input"
            type="text"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search catalog..."
            className="w-full rounded-full border border-transparent bg-gray-100 py-2.5 pr-4 pl-12 text-sm text-[#1D1D1F] placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:outline-hidden transition-all duration-200"
          />
        </div>

        {/* Sort drop down selector */}
        <div className="flex items-center gap-2.5">
          <label htmlFor="sort-by-select" className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-gray-400">
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>Sort By:</span>
          </label>
          <select
            id="sort-by-select"
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as FiltersState['sortBy'])}
            className="rounded-full border border-gray-100 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:border-gray-200 focus:outline-hidden cursor-pointer"
          >
            <option value="featured">Featured Collection</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Divider line */}
      <div className="h-px bg-gray-100" />

      {/* Bottom row: Categories capsules and price bounds filter */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Category capsule navigation strip */}
        <div className="space-y-2">
          <span className="block text-[10px] font-bold tracking-widest uppercase text-gray-400">
            Collection
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              id="category-badge-all"
              onClick={() => handleCategorySelect(null)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                filters.category === null
                  ? 'bg-black text-white'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100/50'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                id={`category-badge-${cat.toLowerCase()}`}
                onClick={() => handleCategorySelect(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  filters.category === cat
                    ? 'bg-black text-white'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price Slider controls */}
        <div className="space-y-2 min-w-[240px] max-w-sm">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase text-gray-400">
            <span>Price Range</span>
            <span className="text-black font-bold">Max: ${filters.maxPrice}</span>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <span className="text-[10px] text-gray-400 font-mono">${filters.minPrice}</span>
            <input
              id="price-range-slider"
              type="range"
              min={filters.minPrice}
              max={maxPriceLimit}
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="h-1 flex-1 cursor-pointer rounded-lg bg-gray-100 appearance-none accent-black focus:outline-hidden"
            />
            <span className="text-[10px] text-gray-400 font-mono">${maxPriceLimit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
