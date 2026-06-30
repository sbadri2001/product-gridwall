"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailDrawerProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailDrawer({ product, onClose, onAddToCart }: ProductDetailDrawerProps) {
  const [activeImage, setActiveImage] = useState<string>('');

  // Reset active image when product changes
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  // Back-drop click to close
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  if (!product) return null;

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        />

        {/* Sliding Drawer Container */}
        <motion.div
          id="product-detail-drawer"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-gray-100 bg-white shadow-2xl md:max-w-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                {product.category} Details
              </span>
              <h2 className="text-base font-bold text-[#1D1D1F]">Quick View</h2>
            </div>
            <button
              id="close-drawer-btn"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-black transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                <img
                  src={activeImage || product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-all duration-300"
                />
              </div>
              
              {/* Thumbnail strip */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative h-16 w-20 overflow-hidden rounded-md border bg-gray-50 transition-all ${
                        activeImage === img ? 'border-black scale-95 shadow-2xs' : 'border-transparent hover:border-gray-200'
                      }`}
                    >
                      <img src={img} alt={`${product.name} thumbnail ${idx}`} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-md bg-gray-50 border border-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-gray-400">({product.reviewsCount} reviews)</span>
                <span className={`text-[10px] tracking-wider uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                  product.inStock 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                    : 'bg-rose-50 text-rose-700 border-rose-100'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">{product.name}</h1>
              <p className="text-sm font-medium italic text-gray-500">"{product.tagline}"</p>
              
              {/* Price Tag with savings calculation */}
              <div className="flex items-baseline gap-3 pt-1">
                {product.discountPrice ? (
                  <>
                    <span className="text-2xl font-bold text-[#1D1D1F]">
                      ${product.discountPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="rounded-md bg-black px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-white">
                      Save ${(product.price - product.discountPrice).toFixed(2)} ({discountPercent}%)
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-[#1D1D1F]">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 border-t border-gray-100 pt-6">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Overview</h3>
              <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
            </div>

            {/* Specifications Section */}
            <div className="space-y-3 border-t border-gray-100 pt-6">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Technical Specifications</h3>
              <div className="divide-y divide-gray-100 rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex flex-col py-2.5 sm:flex-row sm:justify-between text-xs">
                    <span className="font-semibold text-gray-400 sm:w-1/3 uppercase tracking-wider text-[10px]">{key}</span>
                    <span className="font-medium text-[#1D1D1F] sm:w-2/3 mt-0.5 sm:mt-0">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Returns Promise */}
            <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-100 p-4 sm:grid-cols-3">
              <div className="flex items-center gap-2.5 text-gray-600">
                <Truck className="h-4 w-4 text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Free Delivery</span>
                  <span className="text-[10px] text-gray-400">On orders over $150</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-gray-600">
                <RefreshCw className="h-4 w-4 text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">30-Day Returns</span>
                  <span className="text-[10px] text-gray-400">Hassle-free guarantee</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-gray-600">
                <ShieldCheck className="h-4 w-4 text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">2-Yr Warranty</span>
                  <span className="text-[10px] text-gray-400">Official support included</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer CTA Section */}
          <div className="border-t border-gray-100 bg-white px-6 py-4.5">
            {product.inStock ? (
              <button
                id="add-to-cart-drawer-btn"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xs transition-all duration-200 hover:bg-neutral-800 active:scale-98"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Shopping Cart</span>
              </button>
            ) : (
              <button
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 cursor-not-allowed border border-gray-200"
              >
                Currently Out of Stock
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
