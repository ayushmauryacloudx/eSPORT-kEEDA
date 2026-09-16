import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, Zap, Star, ShieldCheck, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onViewDetails: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  priorityBadge?: string;
  showTimer?: boolean;
}

export default function ProductCard({
  product,
  onViewDetails,
  onBuyNow,
  priorityBadge,
  showTimer
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  // Compute discount percentage
  const numPrice = typeof product.price === 'number' 
    ? product.price 
    : parseInt(String(product.price).replace(/[^0-9]/g, '') || '0', 10);
  const numOriginalPrice = typeof product.originalPrice === 'number' 
    ? product.originalPrice 
    : parseInt(String(product.originalPrice).replace(/[^0-9]/g, '') || '0', 10);
  
  const discountPercent = numOriginalPrice > numPrice 
    ? Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100) 
    : null;

  // Extract key performance chips from performanceSpecs or specs
  const keySpecs: string[] = [];
  if (product.performanceSpecs) {
    if (product.performanceSpecs.display) keySpecs.push(product.performanceSpecs.display);
    if (product.performanceSpecs.response) keySpecs.push(product.performanceSpecs.response);
    if (product.performanceSpecs.sensorOrSwitch) keySpecs.push(product.performanceSpecs.sensorOrSwitch);
    if (product.performanceSpecs.connectivity) keySpecs.push(product.performanceSpecs.connectivity);
    if (product.performanceSpecs.audio) keySpecs.push(product.performanceSpecs.audio);
    if (product.performanceSpecs.battery && keySpecs.length < 3) keySpecs.push(product.performanceSpecs.battery);
  } else if (product.specs && product.specs.length > 0) {
    keySpecs.push(...product.specs.slice(0, 2));
  }

  const badge = priorityBadge || product.badge;

  const getBadgeStyle = (b?: string) => {
    switch (b) {
      case 'PRO PICK':
        return 'bg-[#7C3AED]/20 border-[#7C3AED] text-[#A3FF12]';
      case 'HOT DEAL':
        return 'bg-[#EF4444]/20 border-[#EF4444] text-[#F87171]';
      case 'BESTSELLER':
        return 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#FBBF24]';
      case 'LOW STOCK':
        return 'bg-[#DC2626]/20 border-[#DC2626] text-white';
      case 'NEW':
        return 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]';
      default:
        return 'bg-[#1E293B] border-[#334155] text-[#94A3B8]';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="group relative bg-[#111827] border border-[#1E293B] rounded-lg overflow-hidden flex flex-col hover:border-[#00E5FF]/60 hover:shadow-[0_0_25px_rgba(0,229,255,0.15)] hover:-translate-y-1 transition-all duration-300"
      id={`product-card-${product.id}`}
    >
      {/* Top Header info & Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
        {badge ? (
          <span className={`px-2 py-0.5 text-[10px] font-['Chakra_Petch'] font-bold tracking-widest uppercase border rounded ${getBadgeStyle(badge)} shadow-sm`}>
            {badge}
          </span>
        ) : discountPercent ? (
          <span className="px-2 py-0.5 text-[10px] font-['Chakra_Petch'] font-bold tracking-wider uppercase bg-[#EF4444]/90 text-white rounded shadow-sm">
            -{discountPercent}% OFF
          </span>
        ) : (
          <span />
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="pointer-events-auto p-2 rounded-full bg-[#070A12]/80 backdrop-blur-md border border-[#1E293B] text-[#94A3B8] hover:text-[#EF4444] hover:scale-110 active:scale-95 transition-all shadow-md"
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#EF4444] text-[#EF4444]' : ''}`} />
        </button>
      </div>

      {/* Product Image Stage with Zoom */}
      <div 
        onClick={() => onViewDetails(product)}
        className="relative w-full h-52 bg-[#0D1220] p-4 flex items-center justify-center overflow-hidden cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#111827]/80 pointer-events-none"></div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-300"
          onError={(e: any) => {
            e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Quick View overlay on hover */}
        <div className="absolute inset-0 bg-[#070A12]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3 py-1.5 bg-[#00E5FF] text-[#070A12] text-xs font-['Chakra_Petch'] font-bold uppercase tracking-wider rounded flex items-center gap-1.5 shadow-[0_0_15px_#00E5FF]">
            <Eye className="w-3.5 h-3.5" /> SPEC SHEET
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#00E5FF] font-semibold truncate max-w-[65%]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[#FBBF24]">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-bold font-mono text-[#F8FAFC]">
                {product.rating ? product.rating.toFixed(1) : '4.8'}
              </span>
              {product.reviewsCount && (
                <span className="text-[10px] text-[#94A3B8]">({product.reviewsCount})</span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetails(product)}
            className="font-['Chakra_Petch'] font-bold text-sm text-[#F8FAFC] line-clamp-2 cursor-pointer hover:text-[#00E5FF] transition-colors mb-2.5"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Performance Specs Chips */}
          {keySpecs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {keySpecs.slice(0, 2).map((spec, i) => (
                <span 
                  key={i} 
                  className="px-1.5 py-0.5 rounded bg-[#0D1220] border border-[#1E293B] text-[10px] font-mono text-[#94A3B8] group-hover:border-[#00E5FF]/30 group-hover:text-[#F8FAFC] transition-colors truncate max-w-[140px]"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Strip */}
        <div className="pt-2 border-t border-[#1E293B]/70 mt-auto">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-['Chakra_Petch'] text-[#A3FF12] tracking-wide">
                {typeof product.price === 'number' ? `₹${product.price.toLocaleString('en-IN')}` : product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs line-through text-[#94A3B8] font-mono">
                  {typeof product.originalPrice === 'number' ? `₹${product.originalPrice.toLocaleString('en-IN')}` : product.originalPrice}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            {product.stock !== undefined && (
              <span className={`text-[10px] font-mono font-medium ${product.stock <= 3 ? 'text-[#EF4444]' : 'text-[#94A3B8]'}`}>
                {product.stock === 0 ? 'Out of Stock' : product.stock <= 4 ? `Only ${product.stock} left` : 'In Stock'}
              </span>
            )}
          </div>

          {/* Interactive CTAs */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={product.stock === 0}
              onClick={() => addToCart(product)}
              className="px-2 py-2 bg-[#0D1220] border border-[#1E293B] text-[#F8FAFC] hover:border-[#00E5FF] hover:text-[#00E5FF] text-xs font-['Chakra_Petch'] font-bold uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:pointer-events-none"
              title="Add to cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>CART</span>
            </button>

            <button
              type="button"
              disabled={product.stock === 0}
              onClick={() => onBuyNow(product)}
              className="px-2 py-2 bg-[#00E5FF] text-[#070A12] hover:bg-[#00E5FF]/90 text-xs font-['Chakra_Petch'] font-bold uppercase tracking-wider rounded flex items-center justify-center gap-1 transition-all shadow-[0_0_12px_rgba(0,229,255,0.3)] hover:shadow-[0_0_18px_rgba(0,229,255,0.5)] disabled:opacity-40 disabled:pointer-events-none"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>BUY NOW</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
