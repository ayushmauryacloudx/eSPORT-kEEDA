import { Link } from 'react-router-dom';
import { 
  Gamepad2, 
  ShieldAlert, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';

export default function Footer() {
  const scrollToCategory = (cat: string) => {
    const event = new CustomEvent('esport_category_filter', { detail: cat });
    window.dispatchEvent(event);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const scrollToGame = (game: string) => {
    const event = new CustomEvent('esport_game_filter', { detail: game });
    window.dispatchEvent(event);
    const el = document.getElementById('esports-zone');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#070A12] border-t border-[#1E293B] text-[#94A3B8] text-sm relative mt-20">
      {/* Top subtle arena accent glow */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent"></div>

      {/* Trust & Guarantee Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-[#1E293B]/60">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#111827] border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Chakra_Petch'] font-bold text-white text-xs uppercase tracking-wider">
                100% Genuine Gear
              </h4>
              <p className="text-[11px] text-[#94A3B8]">Direct brand warranties</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#111827] border border-[#A3FF12]/30 flex items-center justify-center text-[#A3FF12]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Chakra_Petch'] font-bold text-white text-xs uppercase tracking-wider">
                Priority Dispatch
              </h4>
              <p className="text-[11px] text-[#94A3B8]">Safe anti-shock packaging</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#111827] border border-[#7C3AED]/30 flex items-center justify-center text-[#7C3AED]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Chakra_Petch'] font-bold text-white text-xs uppercase tracking-wider">
                7-Day Replacement
              </h4>
              <p className="text-[11px] text-[#94A3B8]">Zero hassle RMA exchange</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#111827] border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Chakra_Petch'] font-bold text-white text-xs uppercase tracking-wider">
                Esports Verified
              </h4>
              <p className="text-[11px] text-[#94A3B8]">Tested for tournament FPS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Column 1: SHOP */}
          <div>
            <h3 className="font-['Chakra_Petch'] font-bold text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full"></span>
              SHOP
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button onClick={() => scrollToCategory('Gaming Phones')} className="hover:text-[#00E5FF] transition-colors cursor-pointer text-left">
                  Gaming Phones
                </button>
              </li>
              <li>
                <button onClick={() => scrollToCategory('Cooling')} className="hover:text-[#00E5FF] transition-colors cursor-pointer text-left">
                  Gaming PC & Cooling
                </button>
              </li>
              <li>
                <button onClick={() => scrollToCategory('Gaming Monitors')} className="hover:text-[#00E5FF] transition-colors cursor-pointer text-left">
                  Monitors
                </button>
              </li>
              <li>
                <button onClick={() => scrollToCategory('Gaming Mouse')} className="hover:text-[#00E5FF] transition-colors cursor-pointer text-left">
                  Mouse
                </button>
              </li>
              <li>
                <button onClick={() => scrollToCategory('Mechanical Keyboards')} className="hover:text-[#00E5FF] transition-colors cursor-pointer text-left">
                  Keyboard
                </button>
              </li>
              <li>
                <button onClick={() => scrollToCategory('Gaming Headsets')} className="hover:text-[#00E5FF] transition-colors cursor-pointer text-left">
                  Headsets
                </button>
              </li>
              <li>
                <button onClick={() => scrollToCategory('Accessories')} className="hover:text-[#00E5FF] transition-colors cursor-pointer text-left">
                  Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: ESPORTS */}
          <div>
            <h3 className="font-['Chakra_Petch'] font-bold text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full"></span>
              ESPORTS
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button onClick={() => scrollToGame('BGMI')} className="hover:text-[#00E5FF] transition-colors cursor-pointer text-left">
                  BGMI
                </button>
              </li>
              <li>
                <button onClick={() => scrollToGame('PUBG MOBILE')} className="hover:text-[#00E5FF] transition-colors cursor-pointer text-left">
                  PUBG Mobile
                </button>
              </li>
              <li>
                <button onClick={() => scrollToGame('FREE FIRE')} className="hover:text-[#00E5FF] transition-colors cursor-pointer text-left">
                  Free Fire
                </button>
              </li>
              <li>
                <button onClick={() => scrollToGame('VALORANT')} className="hover:text-[#00E5FF] transition-colors cursor-pointer text-left">
                  Valorant
                </button>
              </li>
              <li>
                <button onClick={() => scrollToGame('CS2')} className="hover:text-[#00E5FF] transition-colors cursor-pointer text-left">
                  CS2
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: ACCOUNT */}
          <div>
            <h3 className="font-['Chakra_Petch'] font-bold text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#A3FF12] rounded-full"></span>
              ACCOUNT
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/profile" className="hover:text-[#00E5FF] transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-[#00E5FF] transition-colors">
                  Orders & Battle Log
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-[#00E5FF] transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#00E5FF] transition-colors">
                  Tactical Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: SUPPORT */}
          <div>
            <h3 className="font-['Chakra_Petch'] font-bold text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full"></span>
              SUPPORT
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a href="#support" onClick={(e) => { e.preventDefault(); alert("Arena Comms: support@esportkeeda.com | Response within 2 hours"); }} className="hover:text-[#00E5FF] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#returns" onClick={(e) => { e.preventDefault(); alert("7-day RMA replacement warranty on defective hardware."); }} className="hover:text-[#00E5FF] transition-colors">
                  Returns & RMA
                </a>
              </li>
              <li>
                <a href="#shipping" onClick={(e) => { e.preventDefault(); alert("Express delivery dispatched in 24 hours across tier-1 hubs."); }} className="hover:text-[#00E5FF] transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#faqs" onClick={(e) => { e.preventDefault(); alert("Check our AI Arena bot in the bottom right corner for immediate answers!"); }} className="hover:text-[#00E5FF] transition-colors">
                  Tournament FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: SOCIAL */}
          <div>
            <h3 className="font-['Chakra_Petch'] font-bold text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full"></span>
              SOCIAL
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1.5">
                  Instagram <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1.5">
                  YouTube <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
                </a>
              </li>
              <li>
                <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1.5">
                  Discord <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
                </a>
              </li>
              <li>
                <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-[#00E5FF] transition-colors flex items-center gap-1.5">
                  X (Twitter) <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright & Disclaimer */}
      <div className="bg-[#05070D] border-t border-[#1E293B]/70 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <span className="font-['Chakra_Petch'] font-bold text-white">eSPORT kEEDA</span>
            <span>&copy; 2026. Built for competitive players.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="text-[#00E5FF]">SECURE 256-BIT ENCRYPTION</span>
            <span className="text-gray-600">|</span>
            <span className="text-[#A3FF12]">FPS OPTIMIZED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
