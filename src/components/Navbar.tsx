import { Link, useLocation } from 'react-router-dom';
import { Gamepad, Search, Lock, Store, ShoppingCart, User as UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useCart();
  const { user, userData } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSearch = () => {
    // Custom event to handle search in Home
    const event = new CustomEvent('esport_search', { detail: searchQuery });
    window.dispatchEvent(event);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <>
      <nav className="flex justify-between items-center py-4 px-[5%] bg-[#090a0f]/90 backdrop-blur-md border-b border-[var(--color-border-color)] sticky top-0 z-50 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
        <Link to="/" className="text-3xl font-bold flex items-center gap-2 text-[var(--color-neon-blue)] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)] tracking-widest uppercase">
          <Gamepad size={32} />
          <span>eSPORT kEEDA</span>
        </Link>

        {!isAdmin && (
          <div className="flex items-center bg-[var(--color-bg-card)] border border-[var(--color-border-color)] rounded focus-within:border-[var(--color-neon-blue)] focus-within:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all px-4 py-1 w-2/5">
            <input
              type="text"
              placeholder="Search for gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none text-white p-2 w-full font-main text-lg outline-none"
            />
            <button onClick={handleSearch} className="bg-transparent border-none text-[var(--color-neon-blue)] cursor-pointer text-xl">
              <Search />
            </button>
          </div>
        )}

        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative text-[var(--color-neon-blue)] hover:text-white transition-colors mr-2">
            <ShoppingCart size={28} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[var(--color-neon-orange)] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>
          
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-neon-blue)] transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            {user ? (
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-[var(--color-neon-blue)]" />
                ) : (
                  <div className="w-8 h-8 rounded-full border border-[var(--color-neon-blue)] flex items-center justify-center bg-black/50">
                    <UserIcon size={16} className="text-[var(--color-neon-blue)]" />
                  </div>
                )}
                <span className="hidden md:inline font-bold text-sm max-w-[100px] truncate">
                  {user.displayName?.split(' ')[0] || 'User'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-[rgba(0,240,255,0.1)] border border-[var(--color-neon-blue)] px-3 py-1.5 rounded hover:bg-[var(--color-neon-blue)] hover:text-black transition-all">
                <UserIcon size={18} />
                <span className="font-bold text-sm uppercase">Login</span>
              </div>
            )}
          </button>

          {userData?.role === 'ADMIN' && !isAdmin && (
            <Link to="/admin" className="text-[var(--color-neon-orange)] drop-shadow-[0_0_5px_rgba(255,69,0,0.5)] font-semibold text-sm flex items-center gap-1 hover:text-white hover:drop-shadow-[0_0_15px_var(--color-neon-orange)] transition-all uppercase border border-[var(--color-neon-orange)] px-2 py-1">
              <Lock size={14} /> Admin
            </Link>
          )}
          
          {isAdmin && (
            <Link to="/" className="text-[var(--color-neon-blue)] drop-shadow-[0_0_5px_var(--color-neon-blue)] font-semibold text-sm flex items-center gap-1 hover:text-white hover:drop-shadow-[0_0_15px_var(--color-neon-blue)] transition-all uppercase border border-[var(--color-neon-blue)] px-2 py-1">
              <Store size={14} /> Store
            </Link>
          )}
        </div>
      </nav>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
