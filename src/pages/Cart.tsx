import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShieldCheck, ShoppingCart, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const formattedTotal = `₹${cartTotal.toLocaleString('en-IN')}`;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4">
        <div className="w-16 h-16 rounded-full bg-[#111827] border border-[#1E293B] flex items-center justify-center text-[#94A3B8] mb-4">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-['Chakra_Petch'] text-white mb-2 uppercase tracking-wider">
          TACTICAL CART IS EMPTY
        </h2>
        <p className="text-[#94A3B8] text-base mb-8 max-w-md">
          Gear up with tournament-approved monitors, magnetic switches, and low-latency mice before entering the arena.
        </p>
        <Link 
          to="/" 
          className="bg-[#00E5FF] text-[#070A12] py-3.5 px-8 font-['Chakra_Petch'] text-sm font-bold uppercase tracking-wider rounded esport-btn shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] transition-all"
        >
          RETURN TO ARENA ARMORY
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-xs font-mono text-[#94A3B8] hover:text-[#00E5FF] transition-colors mb-6"
      >
        <ArrowLeft size={16} /> CONTINUE EXPLORING GEAR
      </Link>
      
      <div className="flex items-center justify-between pb-4 border-b border-[#1E293B] mb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#00E5FF] font-semibold block mb-1">
            PRE-DEPLOYMENT LOADOUT
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider">
            TACTICAL CART ({cart.reduce((a, b) => a + b.quantity, 0)} ITEMS)
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#A3FF12]">
          <ShieldCheck className="w-4 h-4" />
          <span>OFFICIAL PRO INVENTORY</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Cart Item List */}
        <div className="flex-grow space-y-4 w-full">
          {cart.map((item) => (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              key={item.id} 
              className="bg-[#111827] border border-[#1E293B] rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center hover:border-[#00E5FF]/40 transition-colors"
            >
              <div className="w-24 h-24 rounded-lg bg-[#0D1220] border border-[#1E293B] p-2 flex items-center justify-center flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-contain"
                  onError={(e: any) => {
                    e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
              
              <div className="flex-grow text-center sm:text-left space-y-1">
                <span className="text-[#00E5FF] text-[10px] font-mono uppercase font-bold tracking-widest block">
                  {item.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold font-['Chakra_Petch'] text-white line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-[#A3FF12] font-bold font-['Chakra_Petch'] text-base sm:text-lg">
                  {typeof item.price === 'number' ? `₹${item.price.toLocaleString('en-IN')}` : item.price}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 bg-[#0D1220] border border-[#1E293B] rounded px-2 py-1">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-bold font-mono w-6 text-center text-white">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Delete Button */}
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-[#94A3B8] hover:text-[#EF4444] p-2 transition-colors sm:ml-2"
                title="Remove Item"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6 shadow-xl sticky top-24 space-y-6">
            <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider pb-3 border-b border-[#1E293B]">
              ORDER SUMMARY
            </h2>
            
            <div className="space-y-3 text-sm font-mono text-[#94A3B8]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-bold">{formattedTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Esports Insured Courier</span>
                <span className="text-[#A3FF12] font-bold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Priority Allocation</span>
                <span className="text-[#00E5FF] font-bold">INCLUDED</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-[#1E293B] text-white text-xl font-bold font-['Chakra_Petch']">
                <span>TOTAL</span>
                <span className="text-[#A3FF12] text-2xl">{formattedTotal}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-[#00E5FF] text-[#070A12] font-['Chakra_Petch'] text-sm font-bold uppercase tracking-wider rounded esport-btn transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.7)] flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>PROCEED TO SECURE CHECKOUT</span>
            </button>

            <div className="space-y-2 pt-2 border-t border-[#1E293B] text-[11px] font-mono text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#A3FF12]" />
                <span>Zero Latency Replacement Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Anti-Shock Tournament Packaging</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
