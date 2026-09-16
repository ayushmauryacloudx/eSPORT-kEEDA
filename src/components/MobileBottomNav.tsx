import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Zap, Heart, ShoppingCart, User as UserIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleEsportsClick = () => {
    if (location.pathname !== '/') {
      navigate('/?scroll=esports');
    } else {
      const el = document.getElementById('esports-zone');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070A12]/95 backdrop-blur-md border-t border-[#1E293B] px-3 py-2 flex items-center justify-around shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
      
      {/* Home */}
      <Link 
        to="/" 
        className={`flex flex-col items-center gap-0.5 p-1 min-w-[54px] ${location.pathname === '/' ? 'text-[#00E5FF]' : 'text-[#94A3B8]'}`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-['Chakra_Petch'] font-semibold tracking-wider">HOME</span>
      </Link>

      {/* Esports */}
      <button 
        onClick={handleEsportsClick}
        className="flex flex-col items-center gap-0.5 p-1 min-w-[54px] text-[#94A3B8] hover:text-[#7C3AED]"
      >
        <Zap className="w-5 h-5 text-[#A3FF12]" />
        <span className="text-[10px] font-['Chakra_Petch'] font-semibold tracking-wider">ESPORTS</span>
      </button>

      {/* Wishlist */}
      <Link 
        to="/profile" 
        className="flex flex-col items-center gap-0.5 p-1 min-w-[54px] relative text-[#94A3B8] hover:text-[#EF4444]"
      >
        <Heart className="w-5 h-5" />
        {wishlist.length > 0 && (
          <span className="absolute top-0 right-3 w-3.5 h-3.5 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
            {wishlist.length}
          </span>
        )}
        <span className="text-[10px] font-['Chakra_Petch'] font-semibold tracking-wider">WISHLIST</span>
      </Link>

      {/* Cart */}
      <Link 
        to="/cart" 
        className={`flex flex-col items-center gap-0.5 p-1 min-w-[54px] relative ${location.pathname === '/cart' ? 'text-[#00E5FF]' : 'text-[#94A3B8]'}`}
      >
        <ShoppingCart className="w-5 h-5" />
        {totalCartCount > 0 && (
          <span className="absolute top-0 right-3 w-3.5 h-3.5 bg-[#00E5FF] text-[#070A12] text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
            {totalCartCount}
          </span>
        )}
        <span className="text-[10px] font-['Chakra_Petch'] font-semibold tracking-wider">CART</span>
      </Link>

      {/* Profile */}
      <Link 
        to="/profile" 
        className={`flex flex-col items-center gap-0.5 p-1 min-w-[54px] ${location.pathname === '/profile' ? 'text-[#00E5FF]' : 'text-[#94A3B8]'}`}
      >
        <UserIcon className="w-5 h-5" />
        <span className="text-[10px] font-['Chakra_Petch'] font-semibold tracking-wider">PROFILE</span>
      </Link>
    </div>
  );
}
