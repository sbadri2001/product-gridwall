import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: any;
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onSelect, onAddToCart }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculate discount percentage
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <motion.div
      id={`product-card-${product.id}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-black hover:shadow-xs"
    >
      {/* Image Container with Lazy Loading & Pre-loader background */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50">
        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5">
          {discountPercent > 0 && (
            <span className="inline-flex items-center rounded-full bg-black px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase">
              -{discountPercent}%
            </span>
          )}
          {!product.inStock && (
            <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-gray-600 uppercase">
              Sold Out
            </span>
          )}
        </div>

        {/* Hover Action Buttons Overlay */}
        <div className="absolute inset-0 z-5 flex items-center justify-center gap-2.5 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            id={`quick-view-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 shadow-md transition-all duration-200 hover:scale-110 hover:bg-gray-50 active:scale-95"
            title="Quick View"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>

        {/* Blur placeholder and dynamic loaded image */}
        <div
          className={`absolute inset-0 bg-gray-100 transition-opacity duration-500 ${
            imageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        />
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-102 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        />
      </div>

      {/* Content details section */}
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase text-gray-400">
            <span>{product.category}</span>
            <div className="flex items-center gap-0.5 text-amber-500">
              <Star className="h-3 w-3 fill-amber-500" />
              <span className="text-gray-600 font-semibold">{product.rating}</span>
            </div>
          </div>

          <button
            onClick={() => onSelect(product)}
            className="block text-left font-sans text-sm font-medium tracking-tight text-[#1D1D1F] transition-colors hover:text-black focus:outline-hidden"
          >
            {product.name}
          </button>
          
          <p className="text-xs text-gray-400 line-clamp-1">{product.tagline}</p>
        </div>

        {/* Price & Cart option section */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-[#1D1D1F]">
                  ${product.discountPrice.toFixed(2)}
                </span>
                <span className="text-[11px] text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-sm font-bold text-[#1D1D1F]">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {product.inStock ? (
            <button
              id={`add-to-cart-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="flex items-center gap-1 rounded-lg bg-black px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-neutral-800 active:scale-95"
            >
              <ShoppingBag className="h-3 w-3" />
              <span>Add</span>
            </button>
          ) : (
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 py-1">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
