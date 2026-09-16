import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Package, Heart, MapPin, CreditCard, Bell, Star, Shield, LogOut, ArrowRight, Clock, Bot, Trash2, ShoppingCart } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export default function Profile() {
  const { user, userData, loading } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (user && activeTab === 'orders') {
      fetchOrders();
    }
  }, [user, activeTab]);

  const fetchOrders = async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const fetchedOrders: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() });
      });
      // Sort manually as complex index might be required
      fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[var(--color-neon-blue)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  const handleLogout = async () => {
    await signOut(auth);
  };

  const menuItems = [
    { id: 'orders', icon: <Package size={20} />, label: 'My Orders', desc: 'Track, return, or buy things again' },
    { id: 'wishlist', icon: <Heart size={20} />, label: 'Wishlist', desc: 'Your saved items for later' },
    { id: 'addresses', icon: <MapPin size={20} />, label: 'Addresses', desc: 'Edit delivery locations' },
    { id: 'payment', icon: <CreditCard size={20} />, label: 'Payment Methods', desc: 'Manage saved cards & UPI' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto p-5 pb-20">
      <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4 uppercase tracking-wider">
        Operator <span className="text-[var(--color-neon-blue)]">Profile</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Profile Card */}
        <div className="w-full lg:w-[350px] shrink-0">
          <div className="bg-[var(--color-bg-card)] border border-white/10 p-6 flex flex-col items-center text-center sticky top-24">
            <div className="w-32 h-32 bg-black/50 border-2 border-[var(--color-neon-blue)] rounded-full flex items-center justify-center mb-4 overflow-hidden relative group cursor-pointer">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-[var(--color-neon-blue)]">{user.displayName?.charAt(0) || 'U'}</span>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-1">{user.displayName || 'Guest Operator'}</h2>
            <p className="text-[var(--color-text-muted)] mb-4">{user.email}</p>
            
            <div className="inline-block bg-[rgba(0,240,255,0.1)] text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)] px-4 py-1.5 text-sm font-bold uppercase tracking-widest mb-8">
              Rank: {userData?.role || 'USER'}
            </div>

            <div className="w-full flex flex-col gap-2 mb-8">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 p-3 text-left transition-all ${
                    activeTab === item.id 
                      ? 'bg-[rgba(0,240,255,0.1)] border-l-2 border-[var(--color-neon-blue)] text-white' 
                      : 'text-[var(--color-text-muted)] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className={activeTab === item.id ? 'text-[var(--color-neon-blue)]' : ''}>
                    {item.icon}
                  </span>
                  <span className="font-semibold uppercase tracking-wide text-sm">{item.label}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={handleLogout}
              className="w-full bg-transparent border border-white/20 text-white py-3 font-bold uppercase hover:border-[var(--color-neon-orange)] hover:text-[var(--color-neon-orange)] hover:shadow-[0_0_15px_rgba(255,69,0,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="flex-grow">
          {activeTab === 'orders' && (
            <div className="bg-[var(--color-bg-card)] border border-white/10 p-6 min-h-[500px]">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase border-b border-white/10 pb-4">Deployment History</h2>
              
              {ordersLoading ? (
                <div className="text-center py-20 text-[var(--color-text-muted)]">
                  <div className="w-8 h-8 border-2 border-[var(--color-neon-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  Fetching secure logs...
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/20">
                  <Package size={48} className="mx-auto text-[var(--color-text-muted)] mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">NO DEPLOYMENTS YET</h3>
                  <p className="text-[var(--color-text-muted)]">Your operational history is clear.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="border border-white/10 bg-black/30 hover:border-[rgba(0,240,255,0.3)] transition-colors">
                      <div className="flex flex-wrap justify-between items-center bg-white/5 p-4 border-b border-white/5 gap-4">
                        <div className="flex gap-8">
                          <div>
                            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Order Placed</p>
                            <p className="text-white text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total</p>
                            <p className="text-[var(--color-neon-green)] text-sm font-bold">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Ship To</p>
                            <p className="text-[var(--color-neon-blue)] text-sm font-semibold">{order.shippingDetails?.firstName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Order ID</p>
                          <p className="text-white text-sm font-mono">{order.id.substring(0, 10).toUpperCase()}</p>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Clock size={16} className={order.status === 'DELIVERED' ? 'text-green-500' : 'text-[var(--color-neon-orange)]'} />
                          <span className={`font-bold uppercase tracking-wider text-sm ${order.status === 'DELIVERED' ? 'text-green-500' : 'text-[var(--color-neon-orange)]'}`}>
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="space-y-4">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-4 items-center">
                              <div className="w-20 h-20 bg-black/50 border border-white/10 flex items-center justify-center p-2 shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                              </div>
                              <div className="flex-grow">
                                <h4 className="text-white font-bold">{item.name}</h4>
                                <p className="text-[var(--color-text-muted)] text-sm mb-1">Qty: {item.quantity}</p>
                                <p className="text-[var(--color-neon-blue)] font-bold text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="bg-[var(--color-bg-card)] border border-white/10 p-6 min-h-[500px]">
              <h2 className="text-2xl font-bold text-white mb-6 uppercase border-b border-white/10 pb-4">Target Acquired</h2>
              
              {wishlist.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/20">
                  <Heart size={48} className="mx-auto text-[var(--color-text-muted)] mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">WISHLIST EMPTY</h3>
                  <p className="text-[var(--color-text-muted)] mb-6">You haven't locked onto any gear yet.</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="bg-transparent border border-[var(--color-neon-blue)] text-[var(--color-neon-blue)] px-6 py-2 font-main font-bold uppercase hover:bg-[var(--color-neon-blue)] hover:text-black transition-colors"
                  >
                    Browse Armory
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlist.map(product => (
                    <div key={product.id} className="flex gap-4 p-4 border border-white/10 bg-black/30 hover:border-[var(--color-neon-blue)] transition-colors group">
                      <div className="w-24 h-24 shrink-0 bg-black/50 border border-white/5 p-2">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-grow flex flex-col">
                        <h3 className="text-white font-bold mb-1 line-clamp-1">{product.name}</h3>
                        <p className="text-[var(--color-neon-blue)] font-bold text-lg mb-2">₹{product.price}</p>
                        <div className="mt-auto flex gap-2">
                          <button 
                            onClick={() => {
                              addToCart(product);
                              toggleWishlist(product);
                            }}
                            className="bg-[rgba(0,240,255,0.1)] border border-[var(--color-neon-blue)] text-[var(--color-neon-blue)] px-3 py-1 text-xs font-bold uppercase hover:bg-[var(--color-neon-blue)] hover:text-black flex items-center gap-1"
                          >
                            <ShoppingCart size={14} /> Move to Cart
                          </button>
                          <button 
                            onClick={() => toggleWishlist(product)}
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-neon-orange)] p-1 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab !== 'orders' && activeTab !== 'wishlist' && (
            <div className="bg-[var(--color-bg-card)] border border-white/10 p-6 min-h-[500px] flex items-center justify-center text-center">
              <div>
                <Bot size={48} className="mx-auto text-[var(--color-text-muted)] mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2 uppercase">MODULE UNDER CONSTRUCTION</h2>
                <p className="text-[var(--color-text-muted)]">This sector is currently being rebuilt by engineering.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
