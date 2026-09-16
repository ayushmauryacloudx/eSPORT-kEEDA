import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Heart, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  LogOut, 
  Clock, 
  Trash2, 
  ShoppingCart,
  User as UserIcon,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

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
        <div className="w-10 h-10 border-2 border-[#1E293B] border-t-[#00E5FF] rounded-full animate-spin"></div>
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
    { id: 'orders', icon: <Package size={18} />, label: 'BATTLE LOG & ORDERS', desc: 'Hardware shipments & telemetry' },
    { id: 'wishlist', icon: <Heart size={18} />, label: 'ACQUIRED TARGETS', desc: 'Saved tournament gear' },
    { id: 'addresses', icon: <MapPin size={18} />, label: 'DISPATCH ADDRESSES', desc: 'LAN and home arena locations' },
    { id: 'payment', icon: <CreditCard size={18} />, label: 'PAYMENT TOKENS', desc: 'Encrypted checkout protocols' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <div className="pb-4 border-b border-[#1E293B] mb-8">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#00E5FF] font-semibold block mb-1">
          OPERATIVE PROFILE
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider">
          COMMAND DOSSIER
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Profile Card */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6 flex flex-col items-center text-center sticky top-24">
            <div className="w-24 h-24 bg-[#0D1220] border-2 border-[#00E5FF]/60 rounded-full flex items-center justify-center mb-4 overflow-hidden shadow-[0_0_20px_rgba(0,229,255,0.25)]">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-10 h-10 text-[#00E5FF]" />
              )}
            </div>
            
            <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white mb-0.5">{user.displayName || 'Gamer Operative'}</h2>
            <p className="text-xs text-[#94A3B8] font-mono mb-4">{user.email}</p>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D1220] border border-[#A3FF12]/40 text-[#A3FF12] text-xs font-mono font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A3FF12]" />
              <span>ROLE: {userData?.role || 'ESPORTS AGENT'}</span>
            </div>

            <div className="w-full space-y-1 mb-6">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all text-xs font-['Chakra_Petch'] font-bold tracking-wider ${
                    activeTab === item.id 
                      ? 'bg-[#00E5FF]/10 border border-[#00E5FF] text-white shadow-sm' 
                      : 'text-[#94A3B8] hover:bg-[#0D1220] hover:text-white'
                  }`}
                >
                  <span className={activeTab === item.id ? 'text-[#00E5FF]' : ''}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={handleLogout}
              className="w-full py-2.5 bg-[#0D1220] border border-[#1E293B] text-[#EF4444] rounded text-xs font-['Chakra_Petch'] font-bold uppercase hover:bg-[#EF4444]/10 hover:border-[#EF4444] transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={14} /> SIGN OUT OPERATIVE
            </button>
          </div>
        </div>

        {/* Right Column: Tab Content */}
        <div className="flex-grow w-full">
          {activeTab === 'orders' && (
            <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6 min-h-[450px]">
              <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider mb-6 pb-3 border-b border-[#1E293B]">
                BATTLE LOG & GEAR SHIPMENTS
              </h2>
              
              {ordersLoading ? (
                <div className="text-center py-20 text-[#94A3B8] font-mono text-xs">
                  <div className="w-8 h-8 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  SYNCHRONIZING SECURE TELEMETRY...
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-[#1E293B] rounded-lg">
                  <Package size={40} className="mx-auto text-[#94A3B8]/40 mb-3" />
                  <h3 className="font-['Chakra_Petch'] text-lg font-bold text-white mb-1 uppercase tracking-wide">NO RECENT SHIPMENTS</h3>
                  <p className="text-xs text-[#94A3B8] font-mono mb-4">No active or historical equipment orders found.</p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-5 py-2 bg-[#00E5FF] text-[#070A12] text-xs font-['Chakra_Petch'] font-bold uppercase tracking-wider rounded"
                  >
                    EXPLORE ARMORY
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {orders.map(order => (
                    <div key={order.id} className="border border-[#1E293B] bg-[#0D1220] rounded-lg overflow-hidden hover:border-[#00E5FF]/40 transition-colors">
                      <div className="flex flex-wrap justify-between items-center bg-[#070A12] p-3.5 border-b border-[#1E293B] text-xs font-mono gap-3">
                        <div className="flex gap-6">
                          <div>
                            <p className="text-[#94A3B8] text-[10px] uppercase">DEPLOYED DATE</p>
                            <p className="text-white font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-[#94A3B8] text-[10px] uppercase">AMOUNT</p>
                            <p className="text-[#A3FF12] font-bold">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#111827] text-[#00E5FF] border border-[#1E293B]">
                            {order.status || 'PROCESSING'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded bg-[#070A12] border border-[#1E293B] object-contain p-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-['Chakra_Petch'] font-bold text-xs truncate">{item.name}</h4>
                              <div className="text-[#94A3B8] text-[11px] font-mono flex justify-between mt-1">
                                <span>QTY: {item.quantity}</span>
                                <span className="text-[#A3FF12] font-bold">₹{item.price?.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6 min-h-[450px]">
              <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider mb-6 pb-3 border-b border-[#1E293B]">
                ACQUIRED TARGETS ({wishlist.length})
              </h2>
              
              {wishlist.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-[#1E293B] rounded-lg">
                  <Heart size={40} className="mx-auto text-[#94A3B8]/40 mb-3" />
                  <h3 className="font-['Chakra_Petch'] text-lg font-bold text-white mb-1 uppercase tracking-wide">WISHLIST VACANT</h3>
                  <p className="text-xs text-[#94A3B8] font-mono mb-4">No gear saved for future missions.</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="px-5 py-2 bg-[#00E5FF] text-[#070A12] text-xs font-['Chakra_Petch'] font-bold uppercase tracking-wider rounded"
                  >
                    LOCK ONTO GEAR
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map(product => (
                    <div key={product.id} className="p-4 rounded-lg bg-[#0D1220] border border-[#1E293B] hover:border-[#00E5FF]/40 transition-colors flex gap-3">
                      <img src={product.image} alt={product.name} className="w-20 h-20 rounded bg-[#070A12] object-contain p-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h3 className="text-white font-['Chakra_Petch'] font-bold text-xs truncate">{product.name}</h3>
                          <p className="text-[#A3FF12] font-bold text-sm font-['Chakra_Petch'] mt-1">
                            {typeof product.price === 'number' ? `₹${product.price.toLocaleString('en-IN')}` : product.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <button 
                            onClick={() => {
                              addToCart(product);
                              toggleWishlist(product);
                            }}
                            className="px-2.5 py-1.5 rounded bg-[#00E5FF] text-[#070A12] text-[10px] font-['Chakra_Petch'] font-bold uppercase flex items-center gap-1"
                          >
                            <ShoppingCart size={12} /> MOVE TO CART
                          </button>
                          <button 
                            onClick={() => toggleWishlist(product)}
                            className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] transition-colors"
                            title="Remove"
                          >
                            <Trash2 size={14} />
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
            <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-12 text-center">
              <ShieldCheck size={40} className="mx-auto text-[#00E5FF] mb-3" />
              <h3 className="font-['Chakra_Petch'] text-lg font-bold text-white uppercase tracking-wider mb-1">
                SECTOR SECURED
              </h3>
              <p className="text-xs text-[#94A3B8] font-mono max-w-sm mx-auto">
                Address details and payment settings are verified and synced with your tournament profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
