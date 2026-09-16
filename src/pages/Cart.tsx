import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const formattedTotal = `₹${cartTotal.toLocaleString('en-IN')}`;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-5">
        <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">YOUR CART IS EMPTY</h2>
        <p className="text-[var(--color-text-muted)] text-xl mb-8">Gear up before heading into the battlefield.</p>
        <Link 
          to="/" 
          className="bg-[rgba(0,240,255,0.1)] border border-[var(--color-neon-blue)] text-[var(--color-neon-blue)] py-3 px-8 font-main text-xl font-bold uppercase cursor-pointer transition-all hover:bg-[var(--color-neon-blue)] hover:text-[var(--color-bg-dark)] hover:shadow-[0_0_15px_var(--color-neon-blue)]"
        >
          RETURN TO STORE
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto p-5 pb-20">
      <Link to="/" className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-neon-blue)] transition-colors mb-6 font-bold text-lg">
        <ArrowLeft size={20} /> CONTINUE SHOPPING
      </Link>
      
      <h1 className="text-4xl font-bold text-white mb-8 border-b border-white/10 pb-4 uppercase tracking-wider">
        Command Center <span className="text-[var(--color-neon-blue)]">Cart</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow space-y-4">
          {cart.map((item) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={item.id} 
              className="bg-[var(--color-bg-card)] border border-white/5 p-4 flex flex-col md:flex-row gap-4 items-center"
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-24 h-24 object-contain bg-black/30 border border-white/10 p-2"
                onError={(e: any) => e.target.src = 'https://via.placeholder.com/100x100/12141d/00f0ff?text=No+Image'}
              />
              
              <div className="flex-grow text-center md:text-left">
                <span className="text-[var(--color-neon-green)] text-xs uppercase font-bold tracking-widest">{item.category}</span>
                <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                <p className="text-[var(--color-neon-blue)] font-bold text-lg">{item.price}</p>
              </div>

              <div className="flex items-center gap-4 bg-black/40 border border-white/10 p-1">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center text-white hover:text-[var(--color-neon-orange)] transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="text-xl font-bold w-6 text-center text-white">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-white hover:text-[var(--color-neon-green)] transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-neon-orange)] p-2 transition-colors md:ml-2"
                title="Remove Item"
              >
                <Trash2 size={24} />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="w-full lg:w-[350px] shrink-0">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-neon-blue)] p-6 shadow-[0_0_15px_rgba(0,240,255,0.1)] sticky top-24">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">ORDER SUMMARY</h2>
            
            <div className="space-y-3 mb-6 text-lg text-[var(--color-text-muted)] font-semibold">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formattedTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-[var(--color-neon-green)]">FREE</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-white/10 text-white text-2xl font-bold">
                <span>Total</span>
                <span className="text-[var(--color-neon-blue)] drop-shadow-[0_0_5px_rgba(0,240,255,0.3)]">{formattedTotal}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-[var(--color-neon-blue)] text-[var(--color-bg-dark)] py-3 font-main text-xl font-bold uppercase transition-all hover:shadow-[0_0_20px_var(--color-neon-blue)] hover:scale-[1.02]"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
