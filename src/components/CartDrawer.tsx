import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ShoppingCart, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isOpen) return null;

  // Calculate calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const activePrice = item.product.discountPrice ?? item.product.price;
    return acc + activePrice * item.quantity;
  }, 0);

  const shipping = subtotal === 0 || subtotal >= 150 ? 0 : 15.0;
  const estimatedTax = subtotal * 0.08; // 8% sales tax
  const total = subtotal + shipping + estimatedTax;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      onClearCart();
    }, 1800);
  };

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

        {/* Sliding panel */}
        <motion.div
          id="cart-drawer-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-gray-100 bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-[#1D1D1F]" />
              <h2 className="text-base font-bold text-[#1D1D1F]">Your Cart</h2>
              {cartItems.length > 0 && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white uppercase tracking-widest">
                  {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
                </span>
              )}
            </div>
            <button
              id="close-cart-btn"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-black transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto p-5">
            {checkoutSuccess ? (
              /* Success Checkout View */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex h-full flex-col items-center justify-center text-center space-y-4"
              >
                <div className="rounded-full bg-emerald-50 p-4 border border-emerald-100">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                </div>
                <h3 className="text-base font-bold text-[#1D1D1F]">Order Placed Successfully!</h3>
                <p className="max-w-xs text-xs leading-relaxed text-gray-500">
                  Thank you for your purchase. We have sent a confirmation email with details and a tracking code.
                </p>
                <button
                  onClick={() => {
                    setCheckoutSuccess(false);
                    onClose();
                  }}
                  className="rounded-lg border border-gray-200 px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Continue Browsing
                </button>
              </motion.div>
            ) : cartItems.length === 0 ? (
              /* Empty Cart View */
              <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
                <div className="rounded-full bg-gray-50 p-4 border border-gray-100">
                  <ShoppingBag className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-sm font-bold text-[#1D1D1F]">Your cart is empty</h3>
                <p className="max-w-xs text-xs leading-relaxed text-gray-500">
                  Explore our curated workspace accessories and minimal products to add them here.
                </p>
                <button
                  onClick={onClose}
                  className="rounded-lg bg-black px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-neutral-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              /* Active Cart Items List */
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const activePrice = item.product.discountPrice ?? item.product.price;
                  return (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:border-gray-200 bg-white"
                    >
                      {/* Image Preview */}
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-50 border border-gray-100">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Item Info & Quantity adjustments */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[9px] font-bold tracking-widest uppercase text-gray-400">
                              {item.product.category}
                            </span>
                            <h4 className="text-xs font-medium text-[#1D1D1F] line-clamp-1">
                              {item.product.name}
                            </h4>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-red-500 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2.5">
                          {/* Price */}
                          <div className="text-xs font-bold text-[#1D1D1F]">
                            ${(activePrice * item.quantity).toFixed(2)}
                            {item.quantity > 1 && (
                              <span className="text-[10px] font-medium text-gray-400 ml-1.5">
                                (${activePrice.toFixed(2)} each)
                              </span>
                            )}
                          </div>

                          {/* Incrementor */}
                          <div className="flex items-center gap-1 rounded-lg border border-gray-100 p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="flex h-5 w-5 items-center justify-center rounded-md text-gray-500 hover:bg-gray-50 active:scale-90 disabled:opacity-30"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="flex h-5 w-5 items-center justify-center rounded-md text-gray-500 hover:bg-gray-50 active:scale-90"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Checkout pricing details & footer trigger */}
          {cartItems.length > 0 && !checkoutSuccess && (
            <div className="border-t border-gray-100 bg-gray-50/50 p-5 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-950">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-950">
                    {shipping === 0 ? 'Free Shipping' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-gray-950">${estimatedTax.toFixed(2)}</span>
                </div>
                {shipping > 0 && (
                  <div className="rounded-lg bg-gray-100 px-3 py-2 text-[10px] text-gray-600">
                    💡 Add <span className="font-bold">${(150 - subtotal).toFixed(2)}</span> more to your cart to unlock <span className="font-bold text-black">Free Shipping</span>!
                  </div>
                )}
                <div className="border-t border-gray-200/60 pt-2.5 flex justify-between text-sm font-bold text-[#1D1D1F]">
                  <span>Estimated Total</span>
                  <span className="text-base">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                id="checkout-trigger-btn"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xs transition-all hover:bg-neutral-800 active:scale-98 disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
