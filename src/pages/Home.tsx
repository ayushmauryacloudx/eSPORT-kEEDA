import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Monitor, 
  Mouse, 
  Keyboard, 
  Headphones, 
  Gamepad, 
  Fan, 
  Cpu, 
  Smartphone,
  Flame, 
  Zap, 
  Trophy, 
  Clock, 
  Crosshair, 
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  X,
  Layers
} from 'lucide-react';
import { 
  Product, 
  GAMING_CATEGORIES, 
  ESPORTS_GAMES, 
  SETUP_BUNDLES 
} from '../types';
import { defaultProducts } from '../data';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [activeSetup, setActiveSetup] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Flash deal countdown timer state (real countdown)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 22 });

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Load products from Firestore, fallback to curated esports armory
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'products'), limit(60));
        const querySnapshot = await getDocs(q);
        const fetchedProducts: Product[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
        });

        if (fetchedProducts.length > 0) {
          // Merge with default properties if any fields missing
          const merged = fetchedProducts.map(fp => {
            const fallback = defaultProducts.find(dp => dp.name.toLowerCase() === fp.name.toLowerCase());
            return {
              ...fallback,
              ...fp
            } as Product;
          });
          setProducts(merged);
        } else {
          setProducts(defaultProducts);
        }
      } catch (error) {
        console.warn("Using default curated esports armory:", error);
        setProducts(defaultProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle URL query parameters or custom navbar events
  useEffect(() => {
    const qSearch = searchParams.get('search');
    const qCat = searchParams.get('category');
    const qScroll = searchParams.get('scroll');

    if (qSearch) setSearchQuery(qSearch.toLowerCase());
    if (qCat) setActiveCategory(qCat);
    if (qScroll === 'esports') {
      setTimeout(() => {
        document.getElementById('esports-zone')?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else if (qScroll === 'deals') {
      setTimeout(() => {
        document.getElementById('flash-deals')?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }

    const handleSearchEvent = (e: any) => {
      setSearchQuery(e.detail?.toLowerCase() || '');
      setActiveCategory(null);
      setActiveGame(null);
      setActiveSetup(null);
      window.scrollTo({ top: 500, behavior: 'smooth' });
    };

    const handleCategoryEvent = (e: any) => {
      if (e.detail === 'ALL') {
        setActiveCategory(null);
      } else {
        setActiveCategory(e.detail);
      }
      setActiveGame(null);
      setActiveSetup(null);
      setSearchQuery('');
      window.scrollTo({ top: 550, behavior: 'smooth' });
    };

    const handleGameEvent = (e: any) => {
      setActiveGame(e.detail);
      setActiveCategory(null);
      setActiveSetup(null);
      setSearchQuery('');
    };

    window.addEventListener('esport_search', handleSearchEvent);
    window.addEventListener('esport_category_filter', handleCategoryEvent);
    window.addEventListener('esport_game_filter', handleGameEvent);

    return () => {
      window.removeEventListener('esport_search', handleSearchEvent);
      window.removeEventListener('esport_category_filter', handleCategoryEvent);
      window.removeEventListener('esport_game_filter', handleGameEvent);
    };
  }, [searchParams]);

  // Flash deal timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBuyNow = (product: Product) => {
    addToCart(product);
    navigate('/cart');
  };

  // Helper for Category Icon component
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2': return <Smartphone className="w-6 h-6 text-[#00E5FF]" />;
      case 'Monitor': return <Monitor className="w-6 h-6 text-[#00E5FF]" />;
      case 'Mouse': return <Mouse className="w-6 h-6 text-[#A3FF12]" />;
      case 'Keyboard': return <Keyboard className="w-6 h-6 text-[#7C3AED]" />;
      case 'Headphones': return <Headphones className="w-6 h-6 text-[#00E5FF]" />;
      case 'Gamepad': return <Gamepad className="w-6 h-6 text-[#A3FF12]" />;
      case 'Armchair': return <Trophy className="w-6 h-6 text-[#7C3AED]" />;
      case 'Fan': return <Fan className="w-6 h-6 text-[#00E5FF]" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-[#A3FF12]" />;
      default: return <Gamepad2 className="w-6 h-6 text-[#00E5FF]" />;
    }
  };

  // Filtered lists
  const flashDeals = products.filter(p => p.isFlashDeal || p.badge === 'HOT DEAL');
  const proPicks = products.filter(p => p.badge === 'PRO PICK' || (p.rating && p.rating >= 4.9));
  const setupGear = activeSetup ? products.filter(p => p.setupCategory === activeSetup) : products;

  // Main catalog filtering
  let filteredCatalog = products;
  if (searchQuery) {
    filteredCatalog = filteredCatalog.filter(p => 
      p.name.toLowerCase().includes(searchQuery) || 
      p.category.toLowerCase().includes(searchQuery) ||
      (p.specs && p.specs.some(s => s.toLowerCase().includes(searchQuery)))
    );
  } else if (activeGame) {
    filteredCatalog = filteredCatalog.filter(p => 
      p.esportsGames && p.esportsGames.includes(activeGame)
    );
  } else if (activeCategory) {
    filteredCatalog = filteredCatalog.filter(p => p.category === activeCategory);
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 border-2 border-[#1E293B] border-t-[#00E5FF] border-r-[#7C3AED] rounded-full animate-spin"></div>
        <span className="font-['Chakra_Petch'] text-xs uppercase tracking-[0.25em] text-[#00E5FF] animate-pulse">
          INITIALIZING CYBER ARMORY...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      
      {/* 1. HERO SECTION: Dramatic Esports-Inspired Hero */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#1E293B]">
        {/* Subtle background arena energy lines */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-[#00E5FF]/10 via-[#7C3AED]/10 to-transparent blur-3xl pointer-events-none -z-10 rounded-full"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1220] border border-[#00E5FF]/30 text-xs font-mono text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[#A3FF12] animate-ping"></span>
              <span className="font-['Chakra_Petch'] font-bold tracking-wider uppercase">
                COMPETITIVE ARENA SEASON 2026
              </span>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-['Chakra_Petch'] text-white tracking-tight uppercase leading-[1.05]"
            >
              LEVEL UP <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#F8FAFC] to-[#7C3AED]">
                YOUR GAME.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg sm:text-xl text-[#94A3B8] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              Premium gaming gear built for competitive performance. Engineered with ultra-high refresh rates, 0.1ms rapid triggers, and tournament acoustics.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                onClick={() => {
                  const el = document.getElementById('arsenal-catalog');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3.5 bg-[#00E5FF] text-[#070A12] font-['Chakra_Petch'] font-bold text-sm sm:text-base uppercase tracking-wider rounded esport-btn shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                id="hero-shop-gear-btn"
              >
                <span>SHOP GAMING GEAR</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('flash-deals');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3.5 bg-[#0D1220] border border-[#7C3AED]/60 text-white font-['Chakra_Petch'] font-bold text-sm sm:text-base uppercase tracking-wider rounded esport-btn hover:border-[#7C3AED] hover:bg-[#7C3AED]/20 hover:text-[#A3FF12] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all flex items-center gap-2"
                id="hero-explore-deals-btn"
              >
                <Flame className="w-4 h-4 text-[#F59E0B]" />
                <span>EXPLORE DEALS</span>
              </button>
            </motion.div>

            {/* Telemetry Stats strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1E293B]/70 max-w-lg mx-auto lg:mx-0">
              <div>
                <span className="font-['Chakra_Petch'] text-2xl font-bold text-[#A3FF12] block">0.1ms</span>
                <span className="text-[11px] font-mono text-[#94A3B8] uppercase">RAPID TRIGGER</span>
              </div>
              <div>
                <span className="font-['Chakra_Petch'] text-2xl font-bold text-[#00E5FF] block">360Hz</span>
                <span className="text-[11px] font-mono text-[#94A3B8] uppercase">FAST OLED / IPS</span>
              </div>
              <div>
                <span className="font-['Chakra_Petch'] text-2xl font-bold text-white block">100%</span>
                <span className="text-[11px] font-mono text-[#94A3B8] uppercase">TOURNAMENT LEGAL</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Gaming Hardware Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-2xl bg-gradient-to-b from-[#111827] to-[#0D1220] border border-[#1E293B] p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] cyber-corner">
              
              {/* Product Hero Image */}
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"
                alt="Esports Battle Arena Gear"
                className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,229,255,0.2)] hover:scale-105 transition-transform duration-500"
              />

              {/* Float Badge 1: Low Latency */}
              <div className="absolute top-4 left-4 p-2.5 rounded-lg bg-[#070A12]/90 border border-[#00E5FF]/40 backdrop-blur-md text-xs font-mono flex items-center gap-2 shadow-lg">
                <Crosshair className="w-4 h-4 text-[#00E5FF]" />
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">TACTICAL AIM</span>
                  <span className="font-bold text-white font-['Chakra_Petch']">NATIVE 8000Hz</span>
                </div>
              </div>

              {/* Float Badge 2: Tournament Choice */}
              <div className="absolute bottom-4 right-4 p-2.5 rounded-lg bg-[#070A12]/90 border border-[#A3FF12]/40 backdrop-blur-md text-xs font-mono flex items-center gap-2 shadow-lg">
                <Trophy className="w-4 h-4 text-[#A3FF12]" />
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">OFFICIAL PARTNER</span>
                  <span className="font-bold text-white font-['Chakra_Petch']">TIER 1 PRO MAJORS</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. SHOP BY GAMING CATEGORY */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="categories-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#00E5FF] font-semibold block mb-1">
              GEAR DIRECTORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider flex items-center gap-3">
              <span>SHOP BY GAMING CATEGORY</span>
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveCategory(null);
              setActiveGame(null);
              setActiveSetup(null);
              setSearchQuery('');
            }}
            className="text-xs font-mono text-[#94A3B8] hover:text-[#00E5FF] flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            VIEW FULL ARSENAL <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {GAMING_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.name;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveCategory(isSelected ? null : cat.name);
                  setActiveGame(null);
                  setActiveSetup(null);
                  setSearchQuery('');
                  const el = document.getElementById('arsenal-catalog');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`p-4 rounded-lg text-left transition-all border flex flex-col justify-between h-32 relative overflow-hidden group ${
                  isSelected 
                    ? 'bg-[#111827] border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.25)]' 
                    : 'bg-[#0D1220] border-[#1E293B] hover:border-[#00E5FF]/40 hover:bg-[#111827]'
                }`}
              >
                {/* Category Icon */}
                <div className="w-10 h-10 rounded bg-[#070A12] border border-[#1E293B] flex items-center justify-center group-hover:border-[#00E5FF]/60 transition-colors">
                  {renderCategoryIcon(cat.icon)}
                </div>

                <div>
                  <h3 className="font-['Chakra_Petch'] font-bold text-sm text-white group-hover:text-[#00E5FF] transition-colors leading-tight">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-mono text-[#94A3B8]">
                    {cat.count}
                  </span>
                </div>

                {/* Subtle bottom neon indicator when active */}
                {isSelected && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#00E5FF]"></span>
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* 3. ESPORTS ZONE */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[#0D1220]/70 border-y border-[#1E293B] relative" id="esports-zone">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-[#A3FF12]" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#A3FF12] font-semibold">
                  PRO TITLE CALIBRATION
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider">
                ESPORTS ZONE
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-xl">
                Choose your competitive title to inspect gear calibrated for that game's engine, audio footprint, and tick rates.
              </p>
            </div>

            {activeGame && (
              <button
                onClick={() => setActiveGame(null)}
                className="px-3 py-1.5 rounded bg-[#111827] border border-[#EF4444]/40 text-[#EF4444] text-xs font-mono flex items-center gap-1.5 hover:bg-[#EF4444]/10 self-start sm:self-auto"
              >
                <X className="w-3.5 h-3.5" /> Clear Filter: {activeGame}
              </button>
            )}
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            {ESPORTS_GAMES.map((game) => {
              const isSelected = activeGame === game.name;
              return (
                <div
                  key={game.id}
                  onClick={() => {
                    setActiveGame(isSelected ? null : game.name);
                    setActiveCategory(null);
                    setActiveSetup(null);
                    setSearchQuery('');
                    const el = document.getElementById('arsenal-catalog');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`p-5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between min-h-[140px] ${
                    isSelected
                      ? 'bg-[#111827] border-[#A3FF12] shadow-[0_0_25px_rgba(163,255,18,0.2)]'
                      : 'bg-[#070A12] border-[#1E293B] hover:border-[#00E5FF]/50 hover:bg-[#111827]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">
                      {game.genre}
                    </span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: game.accentColor }}></span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-['Chakra_Petch'] text-white group-hover:text-[#00E5FF] transition-colors tracking-wide">
                      {game.name}
                    </h3>
                    <p className="text-[11px] text-[#94A3B8] mt-1 line-clamp-2">
                      {game.recommendedGear}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono font-semibold" style={{ color: game.accentColor }}>
                    <span>{isSelected ? 'ACTIVE SELECTION' : 'EXPLORE LOADOUT'}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. FLASH DEALS (⚡ FLASH DEALS) */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="flash-deals">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 p-5 rounded-xl bg-gradient-to-r from-[#111827] via-[#0D1220] to-[#111827] border border-[#EF4444]/30 shadow-[0_0_30px_rgba(239,68,68,0.08)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444]">
              <Zap className="w-6 h-6 fill-current animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EF4444] text-white uppercase">
                  LIMITED TIME
                </span>
                <span className="text-xs font-mono text-[#94A3B8]">WARHOUSE ALLOCATION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider mt-0.5">
                ⚡ FLASH DEALS
              </h2>
            </div>
          </div>

          {/* Real Active Expiry Countdown */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Clock className="w-4 h-4 text-[#EF4444]" />
            <span className="text-xs font-mono text-[#94A3B8] uppercase mr-1">OFFERS EXPIRE IN:</span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-sm">
              <span className="px-2.5 py-1 bg-[#070A12] border border-[#1E293B] rounded text-[#F8FAFC]">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span className="text-[#EF4444]">:</span>
              <span className="px-2.5 py-1 bg-[#070A12] border border-[#1E293B] rounded text-[#F8FAFC]">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span className="text-[#EF4444]">:</span>
              <span className="px-2.5 py-1 bg-[#070A12] border border-[#EF4444]/60 rounded text-[#EF4444]">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Flash Deals Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashDeals.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={setSelectedProduct}
              onBuyNow={handleBuyNow}
              priorityBadge="HOT DEAL"
              showTimer={true}
            />
          ))}
        </div>
      </section>

      {/* 5. PRO GAMER PICKS (🏆 PRO GAMER PICKS) */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[#0D1220]/60 border-y border-[#1E293B]">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-[#A3FF12]" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#A3FF12] font-semibold">
                  TIER 1 HARDWARE
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider">
                🏆 PRO GAMER PICKS
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                Selected strictly based on rating (4.8+), tournament telemetry, and pro scrim durability.
              </p>
            </div>

            <button
              onClick={() => {
                setActiveCategory(null);
                setActiveGame(null);
                setActiveSetup('Pro Setup');
                const el = document.getElementById('arsenal-catalog');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-mono text-[#00E5FF] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              ALL PRO CERTIFIED HARDWARE <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {proPicks.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={setSelectedProduct}
                onBuyNow={handleBuyNow}
                priorityBadge="PRO PICK"
              />
            ))}
          </div>

        </div>
      </section>

      {/* 6. GAMING SETUP SECTION ("BUILD YOUR SETUP") */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="build-setup">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#7C3AED] font-semibold block mb-1">
            OPTIMIZED BUNDLES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider">
            BUILD YOUR SETUP
          </h2>
          <p className="text-sm text-[#94A3B8] mt-2">
            Engineered hardware combinations tailored for your competitive rank, scrim frequency, and streaming demands.
          </p>
        </div>

        {/* Setup Tiers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {SETUP_BUNDLES.map((setup) => {
            const isSelected = activeSetup === setup.id;
            return (
              <div
                key={setup.id}
                onClick={() => {
                  setActiveSetup(isSelected ? null : (setup.id as any));
                  setActiveCategory(null);
                  setActiveGame(null);
                  const el = document.getElementById('arsenal-catalog');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`p-6 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-[#111827] border-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.2)]' 
                    : 'bg-[#0D1220] border-[#1E293B] hover:border-[#7C3AED]/60 hover:bg-[#111827]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#94A3B8]">
                      TIER LOADOUT
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#070A12] border border-[#1E293B] text-white">
                      {setup.priceEstimate}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-['Chakra_Petch'] text-white mb-1">
                    {setup.title}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mb-4">
                    {setup.subtitle}
                  </p>

                  <ul className="space-y-1.5 text-xs text-[#F8FAFC]/90">
                    {setup.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#A3FF12] flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 mt-4 border-t border-[#1E293B] flex items-center justify-between text-xs font-['Chakra_Petch'] font-bold uppercase tracking-wider text-[#00E5FF]">
                  <span>{isSelected ? 'ACTIVE FILTER' : 'VIEW GEAR'}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. ALL GEAR ARSENAL / SEARCH & FILTER RESULTS */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1E293B]" id="arsenal-catalog">
        
        {/* Active Filter Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-[#1E293B] gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#00E5FF] font-semibold block mb-1">
              ARMORY CATALOG
            </span>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider">
                {searchQuery ? `SEARCH: "${searchQuery}"` : activeCategory ? activeCategory : activeGame ? `GAME: ${activeGame}` : activeSetup ? `SETUP: ${activeSetup}` : 'ALL GAMING EQUIPMENT'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#0D1220] border border-[#1E293B] text-xs font-mono text-[#A3FF12]">
                {filteredCatalog.length} Items
              </span>
            </div>
          </div>

          {/* Quick Filter Reset */}
          {(searchQuery || activeCategory || activeGame || activeSetup) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory(null);
                setActiveGame(null);
                setActiveSetup(null);
              }}
              className="px-3.5 py-2 rounded bg-[#111827] border border-[#1E293B] text-xs font-mono text-[#94A3B8] hover:text-white hover:border-[#00E5FF] flex items-center gap-1.5 transition-all self-start md:self-auto"
            >
              <X className="w-3.5 h-3.5" /> RESET ALL FILTERS
            </button>
          )}
        </div>

        {/* Catalog Grid */}
        {filteredCatalog.length === 0 ? (
          <div className="py-16 text-center bg-[#0D1220] border border-dashed border-[#1E293B] rounded-xl p-8">
            <Crosshair className="w-12 h-12 text-[#94A3B8]/40 mx-auto mb-3" />
            <h3 className="font-['Chakra_Petch'] text-xl font-bold text-white uppercase tracking-wider mb-2">
              NO HARDWARE FOUND IN ARMORY
            </h3>
            <p className="text-sm text-[#94A3B8] max-w-md mx-auto mb-6">
              No tournament equipment matches your current filter or search parameters. Try clearing your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory(null);
                setActiveGame(null);
                setActiveSetup(null);
              }}
              className="px-6 py-2.5 bg-[#00E5FF] text-[#070A12] font-['Chakra_Petch'] font-bold text-xs uppercase tracking-wider rounded"
            >
              SHOW ALL EQUIPMENT
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCatalog.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={setSelectedProduct}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        )}
      </section>

      {/* 8. PRODUCT SPECIFICATIONS & DETAILS MODAL */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={handleBuyNow}
      />

    </div>
  );
}
