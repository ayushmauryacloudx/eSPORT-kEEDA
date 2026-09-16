import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Tag } from 'lucide-react';
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
    if (code === 'FLIPKART500') {
      setDiscount(500);
      setCouponError('');
    } else if (code === 'GAMER10') {
      setDiscount(cartTotal * 0.1);
      setCouponError('');
    } else {
      setDiscount(0);
      setCouponError('Invalid or expired coupon code.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to place an order.");
      return;
    }

    setLoading(true);
    
    try {
      // Create the order document
      const orderData = {
        userId: user.uid,
        customerEmail: user.email,
        shippingDetails: formData,
        items: cart,
        subtotal: cartTotal,
        discountApplied: discount,
        totalAmount: finalTotal,
        status: 'PENDING', // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
        paymentStatus: 'PAID', // In a real app this would depend on a payment gateway
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      // Clear cart in firestore
      await deleteDoc(doc(db, 'carts', user.uid));

      setIsPlaced(true);
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !isPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-5">
        <h2 className="text-3xl font-bold text-white mb-4">No items to checkout.</h2>
        <Link to="/" className="text-[var(--color-neon-blue)] hover:underline text-xl">Return to Store</Link>
      </div>
    );
  }

  if (isPlaced) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center p-5"
      >
        <CheckCircle size={80} className="text-[var(--color-neon-green)] mb-6 drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]" />
        <h2 className="text-4xl font-bold text-white mb-2 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">ORDER SECURED!</h2>
        <p className="text-[var(--color-text-muted)] text-xl mb-8">Your gear is being prepped for deployment. Check your profile to track status.</p>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/profile')}
            className="bg-[rgba(0,240,255,0.1)] border border-[var(--color-neon-blue)] text-[var(--color-neon-blue)] py-3 px-8 font-main text-xl font-bold uppercase cursor-pointer transition-all hover:bg-[var(--color-neon-blue)] hover:text-[var(--color-bg-dark)] hover:shadow-[0_0_15px_var(--color-neon-blue)]"
          >
            VIEW ORDERS
          </button>
          <button 
            onClick={() => navigate('/')}
            className="bg-transparent border border-white/20 text-white py-3 px-8 font-main text-xl font-bold uppercase cursor-pointer transition-all hover:border-white"
          >
            RETURN TO BASE
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto p-5 pb-20">
      <Link to="/cart" className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-neon-blue)] transition-colors mb-6 font-bold text-lg">
        <ArrowLeft size={20} /> BACK TO CART
      </Link>

      <h1 className="text-4xl font-bold text-white mb-8 border-b border-white/10 pb-4 uppercase tracking-wider">
        Checkout <span className="text-[var(--color-neon-orange)]">Protocol</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <form onSubmit={handleSubmit} className="flex-grow space-y-6">
          <div className="bg-[var(--color-bg-card)] border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-[var(--color-neon-blue)]">01.</span> SHIPPING COMMS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="First Name" className="bg-black/50 border border-white/20 text-white p-3 font-main text-lg outline-none focus:border-[var(--color-neon-blue)] transition-colors w-full" />
              <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder="Last Name" className="bg-black/50 border border-white/20 text-white p-3 font-main text-lg outline-none focus:border-[var(--color-neon-blue)] transition-colors w-full" />
              <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email Address" className="bg-black/50 border border-white/20 text-white p-3 font-main text-lg outline-none focus:border-[var(--color-neon-blue)] transition-colors w-full md:col-span-2" />
              <input required name="address" value={formData.address} onChange={handleChange} type="text" placeholder="Shipping Address" className="bg-black/50 border border-white/20 text-white p-3 font-main text-lg outline-none focus:border-[var(--color-neon-blue)] transition-colors w-full md:col-span-2" />
              <input required name="city" value={formData.city} onChange={handleChange} type="text" placeholder="City" className="bg-black/50 border border-white/20 text-white p-3 font-main text-lg outline-none focus:border-[var(--color-neon-blue)] transition-colors w-full" />
              <input required name="postalCode" value={formData.postalCode} onChange={handleChange} type="text" placeholder="Postal Code" className="bg-black/50 border border-white/20 text-white p-3 font-main text-lg outline-none focus:border-[var(--color-neon-blue)] transition-colors w-full" />
            </div>
          </div>

          <div className="bg-[var(--color-bg-card)] border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-[var(--color-neon-blue)]">02.</span> PAYMENT OVERRIDE
            </h2>
            <div className="space-y-4">
              <input required type="text" placeholder="Card Number (Mock)" className="bg-black/50 border border-white/20 text-white p-3 font-main text-lg outline-none focus:border-[var(--color-neon-blue)] transition-colors w-full" />
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="MM/YY" className="bg-black/50 border border-white/20 text-white p-3 font-main text-lg outline-none focus:border-[var(--color-neon-blue)] transition-colors w-full" />
                <input required type="text" placeholder="CVV" className="bg-black/50 border border-white/20 text-white p-3 font-main text-lg outline-none focus:border-[var(--color-neon-blue)] transition-colors w-full" />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-neon-orange)] text-white py-4 font-main text-2xl font-bold uppercase transition-all hover:shadow-[0_0_20px_rgba(255,69,0,0.6)] hover:scale-[1.01] tracking-widest border-2 border-transparent hover:border-white/50 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'PROCESSING...' : `CONFIRM AUTHORIZATION - ${formattedTotal}`}
          </button>
        </form>

        <div className="w-full lg:w-[350px] shrink-0">
          <div className="bg-[var(--color-bg-card)] border border-white/10 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">TRANSMISSION SUMMARY</h2>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-black/40 border border-white/5 p-1" />
                  <div>
                    <h4 className="text-white font-bold text-sm leading-tight">{item.name}</h4>
                    <div className="text-[var(--color-text-muted)] text-sm flex justify-between mt-1">
                      <span>QTY: {item.quantity}</span>
                      <span className="text-[var(--color-neon-blue)]">₹{item.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupons Section */}
            <div className="mb-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2 text-[var(--color-text-muted)]">
                <Tag size={16} />
                <span className="text-sm font-bold uppercase">Apply Coupon</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. GAMER10"
                  className="bg-black/50 border border-white/20 text-white px-3 py-2 font-main outline-none focus:border-[var(--color-neon-blue)] transition-colors flex-grow uppercase"
                />
                <button 
                  onClick={handleApplyCoupon}
                  type="button"
                  className="bg-[rgba(0,240,255,0.1)] border border-[var(--color-neon-blue)] text-[var(--color-neon-blue)] px-4 font-bold uppercase hover:bg-[var(--color-neon-blue)] hover:text-black transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
              {discount > 0 && <p className="text-[var(--color-neon-green)] text-xs mt-2 font-bold uppercase">Coupon Applied! -₹{discount.toLocaleString('en-IN')}</p>}
            </div>

            <div className="pt-4 border-t border-white/10 text-white font-bold flex flex-col gap-2">
              <div className="flex justify-between text-[var(--color-text-muted)] text-sm">
                <span>SUBTOTAL</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[var(--color-neon-green)] text-sm">
                  <span>DISCOUNT</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-xl mt-2">
                <span>TOTAL</span>
                <span className="text-[var(--color-neon-blue)]">{formattedTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
