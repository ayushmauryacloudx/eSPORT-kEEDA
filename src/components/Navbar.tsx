import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Gamepad2, 
  Search, 
  ShoppingCart, 
  Heart, 
  User as UserIcon, 
  ShieldCheck, 
  Flame, 
  Zap, 
  Layers, 
  SlidersHorizontal,
  X
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname === '/admin';
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, userData } = useAuth();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (location.pathname !== '/') {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    } else {
      const event = new CustomEvent('esport_search', { detail: searchQuery });
      window.dispatchEvent(event);
    }
  };

  const handleCategoryClick = (catName: string) => {
    if (location.pathname !== '/') {
      navigate(`/?category=${encodeURIComponent(catName)}`);
    } else {
      const event = new CustomEvent('esport_category_filter', { detail: catName });
      window.dispatchEvent(event);
    }
    setMobileMenuOpen(false);
  };

  const scrollToEsports = () => {
    if (location.pathname !== '/') {
      navigate('/?scroll=esports');
    } else {
      const el = document.getElementById('esports-zone');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const scrollToDeals = () => {
    if (location.pathname !== '/') {
      navigate('/?scroll=deals');
    } else {
      const el = document.getElementById('flash-deals');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navCategories = [
    { label: 'Gaming', filter: 'ALL' },
    { label: 'Mobiles', filter: 'Gaming Phones' },
    { label: 'PC & Components', filter: 'Cooling' },
    { label: 'Monitors', filter: 'Gaming Monitors' },
    { label: 'Audio', filter: 'Gaming Headsets' },
    { label: 'Accessories', filter: 'Accessories' }
  ];

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#070A12]/90 backdrop-blur-md border-b border-[#1E293B] shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        {/* Thin cyan/purple esports energy accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00E5FF] via-40% to-[#7C3AED] opacity-90"></div>

        {/* Primary Navbar Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group flex-shrink-0"
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded bg-[#0D1220] border border-[#00E5FF]/40 flex items-center justify-center relative shadow-[0_0_15px_rgba(0,229,255,0.2)] group-hover:border-[#00E5FF] group-hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all">
              <Gamepad2 className="w-5 h-5 text-[#00E5FF] group-hover:scale-110 transition-transform" />
              <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#A3FF12] rounded-full ring-2 ring-[#070A12]"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-['Chakra_Petch'] text-xl font-bold tracking-wider text-white group-hover:text-[#00E5FF] transition-colors">
                  eSPORT
                </span>
                <span className="font-['Chakra_Petch'] text-xl font-bold tracking-wider text-[#A3FF12]">
                  kEEDA
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-[0.2em] text-[#94A3B8] uppercase -mt-1">
                ARENA MARKETPLACE
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          {!isAdmin && (
            <form 
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-xl mx-4 relative"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search 240Hz monitors, rapid trigger keyboards, cooling..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#111827] border border-[#1E293B] rounded-md px-4 py-2 pl-10 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] shadow-inner transition-all"
                  id="navbar-search-input"
                />
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => { setSearchQuery(''); handleSearch(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button 
                type="submit"
                className="ml-2 px-3.5 py-2 bg-[#0D1220] border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-semibold rounded hover:bg-[#00E5FF] hover:text-[#070A12] transition-colors uppercase tracking-wider font-['Chakra_Petch']"
              >
                AIM
              </button>
            </form>
          )}

          {/* Action Icons: Wishlist, Cart, Account */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Wishlist */}
            <Link 
              to="/profile" 
              className="relative p-2 rounded-md text-[#94A3B8] hover:text-[#00E5FF] hover:bg-[#111827] transition-all"
              title="Wishlist"
              id="navbar-wishlist-btn"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono ring-2 ring-[#070A12]">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 rounded-md text-[#94A3B8] hover:text-[#00E5FF] hover:bg-[#111827] transition-all"
              title="Tactical Cart"
              id="navbar-cart-btn"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#00E5FF] text-[#070A12] text-[10px] font-bold rounded-full flex items-center justify-center font-mono ring-2 ring-[#070A12]">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {/* User Account / Login */}
            <button
              onClick={() => {
                if (user) {
                  navigate('/profile');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-md bg-[#111827] border border-[#1E293B] hover:border-[#00E5FF]/50 text-sm text-[#F8FAFC] transition-all"
              id="navbar-account-btn"
            >
              {user ? (
                <>
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'Gamer'} 
                      className="w-6 h-6 rounded-full border border-[#00E5FF]/60" 
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#00E5FF]/20 border border-[#00E5FF]/40 flex items-center justify-center">
                      <UserIcon className="w-3.5 h-3.5 text-[#00E5FF]" />
                    </div>
                  )}
                  <span className="hidden sm:inline font-['Chakra_Petch'] font-semibold text-xs tracking-wide truncate max-w-[90px]">
                    {user.displayName?.split(' ')[0] || 'OPERATIVE'}
                  </span>
                </>
              ) : (
                <>
                  <UserIcon className="w-4 h-4 text-[#00E5FF]" />
                  <span className="hidden sm:inline font-['Chakra_Petch'] text-xs font-bold uppercase tracking-wider text-[#00E5FF]">
                    SIGN IN
                  </span>
                </>
              )}
            </button>

            {/* Admin Badge link if admin */}
            {userData?.role === 'ADMIN' && (
              <Link 
                to={isAdmin ? "/" : "/admin"}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#7C3AED]/20 border border-[#7C3AED]/50 text-[#A3FF12] text-xs font-['Chakra_Petch'] font-bold tracking-wider hover:bg-[#7C3AED]/30 transition-all uppercase"
                id="navbar-admin-link"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#A3FF12]" />
                {isAdmin ? "STORE" : "ADMIN"}
              </Link>
            )}
          </div>
        </div>

        {/* Secondary Category / Esports Navigation Bar */}
        <div className="border-t border-[#1E293B]/70 bg-[#070A12]/95 px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-['Chakra_Petch'] font-semibold tracking-wider uppercase">
            <div className="flex items-center space-x-6 sm:space-x-8">
              {navCategories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => handleCategoryClick(cat.filter)}
                  className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors whitespace-nowrap cursor-pointer hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]"
                >
                  {cat.label}
                </button>
              ))}

              <button
                onClick={scrollToEsports}
                className="flex items-center gap-1 text-[#7C3AED] hover:text-[#00E5FF] transition-colors whitespace-nowrap cursor-pointer font-bold"
              >
                <Zap className="w-3 h-3 text-[#A3FF12]" />
                Esports Zone
              </button>

              <button
                onClick={scrollToDeals}
                className="flex items-center gap-1 text-[#A3FF12] hover:text-white transition-colors whitespace-nowrap cursor-pointer font-bold"
              >
                <Flame className="w-3 h-3 text-[#F59E0B]" />
                Deals
              </button>
            </div>

            <div className="hidden xl:flex items-center gap-3 text-[11px] font-mono text-[#94A3B8]">
              <span className="flex items-center gap-1 text-[#A3FF12]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A3FF12] animate-pulse"></span>
                LAN TOURNAMENTS READY
              </span>
            </div>
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
