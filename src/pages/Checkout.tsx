import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Tag, ShieldCheck, Zap, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPlaced, setIsPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
  });

  const finalTotal = Math.max(0, cartTotal - discount);
  const formattedTotal = `₹${finalTotal.toLocaleString('en-IN')}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (code === 'ESPORT500') {
      setDiscount(500);
      setCouponError('');
    } else if (code === 'GAMER10') {
      setDiscount(Math.round(cartTotal * 0.1));
      setCouponError('');
    } else {
      setDiscount(0);
      setCouponError('Invalid tournament code. Try "GAMER10" or "ESPORT500"');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login or authenticate to complete equipment checkout.");
      return;
    }

    setLoading(true);
    
    try {
      // Create order document
      const orderData = {
        userId: user.uid,
        customerEmail: user.email,
        shippingDetails: formData,
        items: cart,
        subtotal: cartTotal,
        discountApplied: discount,
        totalAmount: finalTotal,
        status: 'PENDING',
        paymentStatus: 'PAID',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      try {
        await deleteDoc(doc(db, 'carts', user.uid));
      } catch (err) {
        // Safe fallback if cart doc didn't exist
      }

      setIsPlaced(true);
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Checkout failed. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !isPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-3xl font-bold font-['Chakra_Petch'] text-white mb-2 uppercase">
          NO GEAR IN CHECKOUT
        </h2>
        <p className="text-[#94A3B8] mb-6">Select your tournament gear from the arena catalog first.</p>
        <Link to="/" className="text-[#00E5FF] hover:underline font-mono text-sm">
          Return to Armory &rarr;
        </Link>
      </div>
    );
  }

  if (isPlaced) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4"
      >
        <div className="w-20 h-20 rounded-full bg-[#A3FF12]/20 border border-[#A3FF12] flex items-center justify-center text-[#A3FF12] mb-6 shadow-[0_0_30px_rgba(163,255,18,0.4)]">
          <CheckCircle2 size={48} />
        </div>
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#00E5FF] mb-1 font-semibold">
          TELEMETRY VERIFIED
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold font-['Chakra_Petch'] text-white mb-3 uppercase tracking-wider">
          ORDER AUTHORIZED!
        </h2>
        <p className="text-[#94A3B8] text-base mb-8 max-w-lg">
          Your esports equipment is being inspected, serialized, and safely packaged in anti-shock casing for express tournament dispatch.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => navigate('/profile')}
            className="bg-[#00E5FF] text-[#070A12] py-3.5 px-8 font-['Chakra_Petch'] text-sm font-bold uppercase tracking-wider rounded esport-btn shadow-[0_0_20px_rgba(0,229,255,0.4)]"
          >
            VIEW BATTLE LOG / ORDERS
          </button>
          <button 
            onClick={() => navigate('/')}
            className="bg-[#0D1220] border border-[#1E293B] text-white py-3.5 px-8 font-['Chakra_Petch'] text-sm font-bold uppercase tracking-wider rounded hover:border-white transition-colors"
          >
            RETURN TO STORE
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <Link 
        to="/cart" 
        className="inline-flex items-center gap-2 text-xs font-mono text-[#94A3B8] hover:text-[#00E5FF] transition-colors mb-6"
      >
        <ArrowLeft size={16} /> RETURN TO CART
      </Link>

      <div className="pb-4 border-b border-[#1E293B] mb-8">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#00E5FF] font-semibold block mb-1">
          SECURE DISPATCH PROTOCOL
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider">
          FINAL GEAR CHECKOUT
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="flex-grow space-y-6 w-full">
          
          {/* Section 1: Shipping */}
          <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6">
            <h2 className="text-lg font-bold font-['Chakra_Petch'] text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <span className="text-[#00E5FF] font-mono">01.</span> DISPATCH ADDRESS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="First Name" className="bg-[#0D1220] border border-[#1E293B] rounded text-white p-3 text-sm outline-none focus:border-[#00E5FF] transition-colors w-full" />
              <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder="Last Name" className="bg-[#0D1220] border border-[#1E293B] rounded text-white p-3 text-sm outline-none focus:border-[#00E5FF] transition-colors w-full" />
              <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email Address for Tracking" className="bg-[#0D1220] border border-[#1E293B] rounded text-white p-3 text-sm outline-none focus:border-[#00E5FF] transition-colors w-full md:col-span-2" />
              <input required name="address" value={formData.address} onChange={handleChange} type="text" placeholder="Street Address / Arena Unit" className="bg-[#0D1220] border border-[#1E293B] rounded text-white p-3 text-sm outline-none focus:border-[#00E5FF] transition-colors w-full md:col-span-2" />
              <input required name="city" value={formData.city} onChange={handleChange} type="text" placeholder="City" className="bg-[#0D1220] border border-[#1E293B] rounded text-white p-3 text-sm outline-none focus:border-[#00E5FF] transition-colors w-full" />
              <input required name="postalCode" value={formData.postalCode} onChange={handleChange} type="text" placeholder="Postal / ZIP Code" className="bg-[#0D1220] border border-[#1E293B] rounded text-white p-3 text-sm outline-none focus:border-[#00E5FF] transition-colors w-full" />
            </div>
          </div>

          {/* Section 2: Payment */}
          <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-['Chakra_Petch'] text-white flex items-center gap-2 uppercase tracking-wider">
                <span className="text-[#A3FF12] font-mono">02.</span> PAYMENT ENCRYPTION
              </h2>
              <span className="flex items-center gap-1.5 text-xs font-mono text-[#A3FF12]">
                <Lock className="w-3.5 h-3.5" /> 256-BIT SECURE
              </span>
            </div>
            
            <div className="space-y-4">
              <input required type="text" placeholder="Card Number (4242 •••• •••• ••••)" className="bg-[#0D1220] border border-[#1E293B] rounded text-white p-3 text-sm outline-none focus:border-[#00E5FF] transition-colors w-full font-mono" />
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="MM / YY" className="bg-[#0D1220] border border-[#1E293B] rounded text-white p-3 text-sm outline-none focus:border-[#00E5FF] transition-colors w-full font-mono" />
                <input required type="text" placeholder="CVV / CVC" className="bg-[#0D1220] border border-[#1E293B] rounded text-white p-3 text-sm outline-none focus:border-[#00E5FF] transition-colors w-full font-mono" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#00E5FF] text-[#070A12] font-['Chakra_Petch'] text-base font-bold uppercase tracking-wider rounded esport-btn transition-all shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.7)] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>{loading ? 'TRANSMITTING AUTHORIZATION...' : `AUTHORIZE PAYMENT — ${formattedTotal}`}</span>
          </button>
        </form>

        {/* Sidebar Column */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6 sticky top-24 space-y-6">
            <h2 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider pb-3 border-b border-[#1E293B]">
              TRANSMISSION SUMMARY
            </h2>
            
            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 items-center p-2 rounded bg-[#0D1220] border border-[#1E293B]">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded bg-[#070A12] p-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-['Chakra_Petch'] font-bold text-xs truncate">{item.name}</h4>
                    <div className="text-[#94A3B8] text-[11px] font-mono flex justify-between mt-1">
                      <span>QTY: {item.quantity}</span>
                      <span className="text-[#A3FF12] font-bold">
                        {typeof item.price === 'number' ? `₹${item.price.toLocaleString('en-IN')}` : item.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupons Section */}
            <div className="pt-4 border-t border-[#1E293B]">
              <div className="flex items-center gap-1.5 mb-2 text-xs font-mono text-[#94A3B8]">
                <Tag size={14} className="text-[#00E5FF]" />
                <span className="font-bold uppercase">TOURNAMENT COUPON</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="GAMER10 / ESPORT500"
                  className="bg-[#0D1220] border border-[#1E293B] rounded text-white px-3 py-2 text-xs font-mono outline-none focus:border-[#00E5FF] transition-colors flex-grow uppercase"
                />
                <button 
                  onClick={handleApplyCoupon}
                  type="button"
                  className="bg-[#0D1220] border border-[#00E5FF]/50 text-[#00E5FF] px-3 py-2 text-xs font-['Chakra_Petch'] font-bold uppercase hover:bg-[#00E5FF] hover:text-[#070A12] transition-colors"
                >
                  APPLY
                </button>
              </div>
              {couponError && <p className="text-[#EF4444] text-[11px] font-mono mt-1.5">{couponError}</p>}
              {discount > 0 && <p className="text-[#A3FF12] text-[11px] font-mono mt-1.5 font-bold">Coupon Applied: -₹{discount.toLocaleString('en-IN')}</p>}
            </div>

            <div className="pt-4 border-t border-[#1E293B] text-white font-mono space-y-2 text-xs">
              <div className="flex justify-between text-[#94A3B8]">
                <span>SUBTOTAL</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#A3FF12]">
                  <span>DISCOUNT</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-['Chakra_Petch'] font-bold pt-2 border-t border-[#1E293B] text-white">
                <span>TOTAL PAYABLE</span>
                <span className="text-[#A3FF12] text-xl">{formattedTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
