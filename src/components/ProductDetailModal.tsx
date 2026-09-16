import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Star, 
  ShoppingCart, 
  Zap, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Cpu, 
  Monitor, 
  Activity, 
  Radio, 
  HardDrive, 
  BatteryMedium,
  CheckCircle2,
  Gamepad2
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onBuyNow
}: ProductDetailModalProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [activeImage, setActiveImage] = useState<string>('');

  if (!product) return null;

  const currentImage = activeImage || product.image;
  const wishlisted = isInWishlist(product.id);

  // Compute discount
  const numPrice = typeof product.price === 'number' 
    ? product.price 
    : parseInt(String(product.price).replace(/[^0-9]/g, '') || '0', 10);
  const numOriginalPrice = typeof product.originalPrice === 'number' 
    ? product.originalPrice 
    : parseInt(String(product.originalPrice).replace(/[^0-9]/g, '') || '0', 10);
  
  const discountPercent = numOriginalPrice > numPrice 
    ? Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100) 
    : null;

  const perf = product.performanceSpecs;
  const hasPerf = perf && (perf.display || perf.response || perf.memory || perf.storage || perf.connectivity || perf.sensorOrSwitch || perf.audio);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#070A12]/90 backdrop-blur-md">
        
        {/* Backdrop click */}
        <div className="fixed inset-0" onClick={onClose}></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-[#111827] border border-[#1E293B] shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Top Cyber Accent line */}
          <div className="h-1 w-full bg-gradient-to-r from-[#00E5FF] via-[#7C3AED] to-[#A3FF12]"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#070A12]/80 border border-[#1E293B] text-[#94A3B8] hover:text-white hover:border-[#00E5FF] transition-all shadow-md"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Scrollable Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Left Column: Gallery & Images */}
              <div className="space-y-4">
                <div className="relative w-full aspect-square bg-[#0D1220] border border-[#1E293B] rounded-lg p-6 flex items-center justify-center overflow-hidden">
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-['Chakra_Petch'] font-bold tracking-wider uppercase bg-[#7C3AED]/30 border border-[#7C3AED] text-[#A3FF12] rounded">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Thumbnail selector if gallery available */}
                {product.gallery && product.gallery.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {[product.image, ...product.gallery].map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(img)}
                        className={`w-14 h-14 rounded border p-1 bg-[#0D1220] flex-shrink-0 transition-all ${currentImage === img ? 'border-[#00E5FF] shadow-[0_0_10px_#00E5FF]' : 'border-[#1E293B]'}`}
                      >
                        <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Trust badges */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono text-[#94A3B8]">
                  <div className="flex items-center gap-1.5 p-2 bg-[#0D1220] border border-[#1E293B] rounded">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>Genuine</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-[#0D1220] border border-[#1E293B] rounded">
                    <Truck className="w-3.5 h-3.5 text-[#A3FF12]" />
                    <span>Fast Dispatch</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 bg-[#0D1220] border border-[#1E293B] rounded">
                    <RotateCcw className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>7-Day RMA</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Title, Rating, Price, Core Info */}
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] font-semibold">
                      {product.category}
                    </span>
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#EF4444] transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#EF4444] text-[#EF4444]' : ''}`} />
                      <span>{wishlisted ? 'Wishlisted' : 'Save to Wishlist'}</span>
                    </button>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold font-['Chakra_Petch'] text-white leading-tight">
                    {product.name}
                  </h1>

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 bg-[#0D1220] border border-[#1E293B] px-2 py-0.5 rounded text-xs">
                      <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                      <span className="font-bold text-white font-mono">{product.rating || 4.8}</span>
                    </div>
                    <span className="text-xs text-[#94A3B8]">
                      {product.reviewsCount || 120} Verified Tournament Players
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-lg bg-[#0D1220] border border-[#1E293B] flex items-baseline justify-between">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold font-['Chakra_Petch'] text-[#A3FF12]">
                      {typeof product.price === 'number' ? `₹${product.price.toLocaleString('en-IN')}` : product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm line-through text-[#94A3B8] font-mono">
                        {typeof product.originalPrice === 'number' ? `₹${product.originalPrice.toLocaleString('en-IN')}` : product.originalPrice}
                      </span>
                    )}
                  </div>
                  {discountPercent && (
                    <span className="px-2.5 py-1 rounded bg-[#EF4444]/20 border border-[#EF4444] text-[#F87171] text-xs font-['Chakra_Petch'] font-bold">
                      SAVE {discountPercent}%
                    </span>
                  )}
                </div>

                {/* Stock & Seller */}
                <div className="text-xs space-y-1.5 text-[#94A3B8] font-mono">
                  <div className="flex items-center justify-between">
                    <span>Availability:</span>
                    <span className={product.stock === 0 ? 'text-[#EF4444] font-bold' : 'text-[#A3FF12] font-bold'}>
                      {product.stock === 0 ? 'Out of Stock' : `${product.stock || 10} Units Ready in Depot`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Seller:</span>
                    <span className="text-white">{product.seller || 'Official eSPORT kEEDA Flagship'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Warranty:</span>
                    <span className="text-[#00E5FF]">{product.warranty || '1 Year Direct Brand Warranty'}</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    disabled={product.stock === 0}
                    onClick={() => {
                      addToCart(product);
                      onClose();
                    }}
                    className="py-3 px-4 rounded-lg bg-[#0D1220] border border-[#00E5FF]/50 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#070A12] font-['Chakra_Petch'] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    ADD TO CART
                  </button>

                  <button
                    disabled={product.stock === 0}
                    onClick={() => {
                      onBuyNow(product);
                      onClose();
                    }}
                    className="py-3 px-4 rounded-lg bg-[#00E5FF] text-[#070A12] hover:bg-[#00E5FF]/90 font-['Chakra_Petch'] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:opacity-40"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    BUY NOW
                  </button>
                </div>
              </div>
            </div>

            {/* GAMING PERFORMANCE SECTION: Prominently visual specification panel */}
            {hasPerf && (
              <div className="border-t border-[#1E293B] pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-[#00E5FF]" />
                  <h3 className="font-['Chakra_Petch'] text-base font-bold uppercase tracking-wider text-white">
                    GAMING PERFORMANCE TELEMETRY
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {perf.display && (
                    <div className="p-3 bg-[#0D1220] border border-[#1E293B] rounded-lg">
                      <span className="text-[10px] font-mono uppercase text-[#94A3B8] block mb-1">Display / Panel</span>
                      <span className="font-['Chakra_Petch'] font-bold text-sm text-[#00E5FF]">{perf.display}</span>
                    </div>
                  )}

                  {perf.response && (
                    <div className="p-3 bg-[#0D1220] border border-[#1E293B] rounded-lg">
                      <span className="text-[10px] font-mono uppercase text-[#94A3B8] block mb-1">Response Time</span>
                      <span className="font-['Chakra_Petch'] font-bold text-sm text-[#A3FF12]">{perf.response}</span>
                    </div>
                  )}

                  {perf.sensorOrSwitch && (
                    <div className="p-3 bg-[#0D1220] border border-[#1E293B] rounded-lg">
                      <span className="text-[10px] font-mono uppercase text-[#94A3B8] block mb-1">Switch / Sensor</span>
                      <span className="font-['Chakra_Petch'] font-bold text-sm text-white">{perf.sensorOrSwitch}</span>
                    </div>
                  )}

                  {perf.connectivity && (
                    <div className="p-3 bg-[#0D1220] border border-[#1E293B] rounded-lg">
                      <span className="text-[10px] font-mono uppercase text-[#94A3B8] block mb-1">Connectivity</span>
                      <span className="font-['Chakra_Petch'] font-bold text-sm text-[#7C3AED]">{perf.connectivity}</span>
                    </div>
                  )}

                  {perf.memory && (
                    <div className="p-3 bg-[#0D1220] border border-[#1E293B] rounded-lg">
                      <span className="text-[10px] font-mono uppercase text-[#94A3B8] block mb-1">Memory</span>
                      <span className="font-['Chakra_Petch'] font-bold text-sm text-white">{perf.memory}</span>
                    </div>
                  )}

                  {perf.storage && (
                    <div className="p-3 bg-[#0D1220] border border-[#1E293B] rounded-lg">
                      <span className="text-[10px] font-mono uppercase text-[#94A3B8] block mb-1">Storage</span>
                      <span className="font-['Chakra_Petch'] font-bold text-sm text-white">{perf.storage}</span>
                    </div>
                  )}

                  {perf.audio && (
                    <div className="p-3 bg-[#0D1220] border border-[#1E293B] rounded-lg">
                      <span className="text-[10px] font-mono uppercase text-[#94A3B8] block mb-1">Spatial Audio</span>
                      <span className="font-['Chakra_Petch'] font-bold text-sm text-[#00E5FF]">{perf.audio}</span>
                    </div>
                  )}

                  {perf.battery && (
                    <div className="p-3 bg-[#0D1220] border border-[#1E293B] rounded-lg">
                      <span className="text-[10px] font-mono uppercase text-[#94A3B8] block mb-1">Battery Run</span>
                      <span className="font-['Chakra_Petch'] font-bold text-sm text-[#A3FF12]">{perf.battery}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Competitive Game Compatibility */}
            {product.compatibility && product.compatibility.length > 0 && (
              <div className="border-t border-[#1E293B] pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Gamepad2 className="w-5 h-5 text-[#A3FF12]" />
                  <h3 className="font-['Chakra_Petch'] text-sm font-bold uppercase tracking-wider text-white">
                    COMPETITIVE ESPORTS CERTIFICATION & COMPATIBILITY
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.map((item, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 rounded bg-[#0D1220] border border-[#1E293B] text-xs font-['Chakra_Petch'] font-semibold text-[#F8FAFC] flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A3FF12]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Feature Points */}
            <div className="border-t border-[#1E293B] pt-6">
              <h3 className="font-['Chakra_Petch'] text-sm font-bold uppercase tracking-wider text-white mb-3">
                HARDWARE SPECIFICATIONS & FEATURES
              </h3>
              <ul className="space-y-2 text-sm text-[#94A3B8]">
                {product.specs && product.specs.length > 0 ? (
                  product.specs.map((spec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] mt-2 flex-shrink-0"></span>
                      <span>{spec}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] mt-2 flex-shrink-0"></span>
                      <span>Ultra-low latency architecture engineered for competitive tournament play.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] mt-2 flex-shrink-0"></span>
                      <span>Premium ergonomic construction tested under prolonged scrims.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] mt-2 flex-shrink-0"></span>
                      <span>Official 1 Year Manufacturer Warranty with quick RMA replacement support.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t border-[#1E293B] pt-6">
                <h3 className="font-['Chakra_Petch'] text-sm font-bold uppercase tracking-wider text-white mb-2">
                  TACTICAL OVERVIEW
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
