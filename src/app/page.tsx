"use client";

import { useState, useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, RefreshCcw, SlidersHorizontal, ArrowDown, HelpCircle, Flame } from 'lucide-react';

import { Product, CartItem, FiltersState } from '../types';
import ProductCard from '../components/ProductCard';
import ProductDetailDrawer from '../components/ProductDetailDrawer';
import CartDrawer from '../components/CartDrawer';
import Filters from '../components/Filters';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Avoid excessive network queries in sandbox
      staleTime: 1000 * 60 * 5, // Cache stays valid for 5 minutes (analogous to ISR data preservation)
    },
  },
});

function CatalogApp() {
  // --- Cart State Management (with LocalStorage persistence) ---
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('product-gridwall-cart');
        return savedCart ? JSON.parse(savedCart) : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('product-gridwall-cart', JSON.stringify(cart));
  }, [cart]);

  // --- Filtering & UI States ---
  const [filters, setFilters] = useState<FiltersState>({
    search: '',
    category: null,
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'featured',
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6); // Lazy loading batch size for Infinite Scroll

  // Infinite Scroll Trigger Ref
  const observerTargetRef = useRef<HTMLDivElement | null>(null);

  // --- Fetch Product Data with Tanstack React Query ---
  // Demonstrates state management and ISR caching (reloads and caches local fetch results instantly)
  const { data: products = [], isLoading, error, refetch } = useQuery<Product[]>({
    queryKey: ['products-catalog'],
    queryFn: async () => {
      const response = await fetch('/products.json');
      if (!response.ok) {
        throw new Error('Error retrieving product catalog');
      }
      return response.json();
    },
  });

  // Calculate dynamic maximum price limit for range filtering from product data
  const maxPriceLimit = products.length > 0
    ? Math.max(...products.map(p => p.price))
    : 1000;

  // Sync initial maxPrice filter when data is loaded
  useEffect(() => {
    if (products.length > 0) {
      setFilters(prev => ({ ...prev, maxPrice: Math.max(...products.map(p => p.price)) }));
    }
  }, [products]);

  // Extract all categories dynamically for filter capsules
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // --- Cart Operations ---
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Visual trigger to open cart sidebar on add
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.product.id === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // --- Filter and Sort Logic ---
  const filteredSortedProducts = products
    .filter((product) => {
      // Search matching
      const matchesSearch =
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.tagline.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.category.toLowerCase().includes(filters.search.toLowerCase());

      // Category matching
      const matchesCategory = filters.category === null || product.category === filters.category;

      // Price matching (checks active price: discount price if available, otherwise regular price)
      const activePrice = product.discountPrice ?? product.price;
      const matchesPrice = activePrice >= filters.minPrice && activePrice <= filters.maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      const priceA = a.discountPrice ?? a.price;
      const priceB = b.discountPrice ?? b.price;

      if (filters.sortBy === 'price-asc') {
        return priceA - priceB;
      }
      if (filters.sortBy === 'price-desc') {
        return priceB - priceA;
      }
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // 'featured'
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return b.rating - a.rating;
    });

  // Slice products based on Infinite Scroll pagination count
  const visibleProducts = filteredSortedProducts.slice(0, visibleCount);

  // --- Infinite Scroll Native Observer Trigger ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredSortedProducts.length) {
          // Stagger additional page loads for smoother visual flow
          setVisibleCount((prev) => Math.min(prev + 4, filteredSortedProducts.length));
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentTarget = observerTargetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [visibleCount, filteredSortedProducts.length]);

  // Reset infinite scroll page counter when filters or sort change
  useEffect(() => {
    setVisibleCount(6);
  }, [filters.search, filters.category, filters.maxPrice, filters.sortBy]);

  // Helper count of active cart bubble badge
  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F8]">
      {/* Top Banner Message */}
      <div className="bg-black py-2.5 px-4 text-center text-[9px] font-bold tracking-widest uppercase text-white sm:text-[10px]">
        ✨ Global Launch Campaign: Enjoy free delivery on orders over $150.00
      </div>

      {/* Primary Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo with Display font */}
          <div className="flex items-center gap-1.5">
            <span className="font-sans text-lg font-semibold tracking-widest text-black uppercase">
              Essentials<span className="text-gray-400 font-light text-xs tracking-normal ml-0.5 lowercase">.studio</span>
            </span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4">
            {/* Quick Cache Info */}
            <div className="hidden items-center gap-1.5 rounded-full bg-gray-50 border border-gray-100 px-3 py-1 text-[9px] font-bold tracking-widest uppercase text-gray-400 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Static Cache Active</span>
            </div>

            {/* Shopping Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 text-gray-700 transition-all hover:bg-gray-50 hover:border-black active:scale-95 shadow-2xs"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {totalCartCount > 0 && (
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white shadow-xs uppercase tracking-widest"
                >
                  {totalCartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Visual Banner Section */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-black px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              <Flame className="h-3 w-3 fill-white text-white" />
              <span>New Arrivals Collection</span>
            </div>
            <h1 className="font-sans text-4xl font-medium tracking-tight text-[#1D1D1F] sm:text-5xl md:text-6xl">
              Elevate Your <br />
              <span className="text-gray-400 italic font-normal">Daily Workspace</span>
            </h1>
            <p className="text-sm leading-relaxed text-gray-500 max-w-lg">
              Explore our custom-engineered catalog of tactile peripherals, ergonomic seating, and high-fidelity devices. Designed for creative professionals and builders.
            </p>
          </div>
        </div>

        {/* Backdrop Graphic styling */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-3 pointer-events-none mr-24 hidden lg:block">
          <ShoppingCart className="h-96 w-96 text-black stroke-[0.25]" />
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Dynamic Filters Area */}
        <section>
          <Filters
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
            maxPriceLimit={maxPriceLimit}
          />
        </section>

        {/* Content Body: Loading / Error / Gridwall */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
              Showing {filteredSortedProducts.length} of {products.length} Products
            </h2>
            {filters.category && (
              <span className="rounded-full bg-black px-3.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
                Filtered: <span>{filters.category}</span>
              </span>
            )}
          </div>

          {isLoading ? (
            /* Loading State card grids */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="flex flex-col space-y-3 rounded-xl border border-gray-100 bg-white p-4">
                  <div className="aspect-square w-full animate-pulse rounded-lg bg-gray-100" />
                  <div className="h-3 w-1/3 animate-pulse rounded-md bg-gray-100" />
                  <div className="h-4 w-2/3 animate-pulse rounded-md bg-gray-100" />
                  <div className="h-8 w-full animate-pulse rounded-md bg-gray-100 pt-3" />
                </div>
              ))}
            </div>
          ) : error ? (
            /* Error Fallback layout */
            <div className="rounded-xl border border-gray-100 bg-white p-12 text-center max-w-md mx-auto space-y-4">
              <h3 className="text-sm font-bold text-[#1D1D1F]">Catalog sync failed</h3>
              <p className="text-xs text-gray-500">
                Unable to load initial products. This can happen if the catalog files are missing.
              </p>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          ) : filteredSortedProducts.length === 0 ? (
            /* Empty Search matching results */
            <div className="rounded-xl border border-gray-100 bg-white p-12 text-center max-w-md mx-auto space-y-4 shadow-2xs">
              <HelpCircle className="mx-auto h-10 w-10 text-gray-300" />
              <h3 className="text-sm font-bold text-[#1D1D1F]">No products match your filters</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Try widening your price range, clearing your search query, or selecting another category badge.
              </p>
              <button
                onClick={() =>
                  setFilters({
                    search: '',
                    category: null,
                    minPrice: 0,
                    maxPrice: maxPriceLimit,
                    sortBy: 'featured',
                  })
                }
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Pristine Product Gridwall */
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {/* Infinite Scroll Sensor element */}
              {visibleCount < filteredSortedProducts.length && (
                <div
                  ref={observerTargetRef}
                  className="py-12 flex flex-col items-center justify-center space-y-3"
                >
                  {/* Elegant loading indicator or manual trigger */}
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                    Loading more workspace items...
                  </span>
                  
                  {/* Backup Load More button in case of sandbox viewport blocks */}
                  <button
                    onClick={() => setVisibleCount((prev) => Math.min(prev + 4, filteredSortedProducts.length))}
                    className="mt-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-700 hover:border-black hover:bg-gray-50 transition-all shadow-2xs active:scale-95 flex items-center gap-1.5"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                    <span>Show More Products</span>
                  </button>
                </div>
              )}

              {visibleCount >= filteredSortedProducts.length && filteredSortedProducts.length > 0 && (
                <div className="py-12 text-center">
                  <span className="rounded-full bg-white border border-gray-100 px-4 py-1.5 text-[9px] font-bold tracking-widest uppercase text-gray-400">
                    ✓ You've viewed all matching products
                  </span>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Micro-Interaction Drawer Overlays */}
      <ProductDetailDrawer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Global Minimalist Footer */}
      <footer className="border-t border-gray-100 bg-white py-12 text-center text-xs text-gray-400 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="font-semibold text-black uppercase tracking-widest text-[10px]">Essentials.studio</p>
          <p className="max-w-md mx-auto text-[10px] leading-relaxed text-gray-400">
            High-performance React catalog designed for creative professionals. Built with instant Tanstack React Query stale-while-revalidate client-side caching.
          </p>
          <div className="pt-4 text-[9px] uppercase tracking-wider text-gray-300">
            &copy; {new Date().getFullYear()} Essentials Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <CatalogApp />
    </QueryClientProvider>
  );
}
