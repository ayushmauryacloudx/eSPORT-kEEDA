import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CATEGORIES } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { Heart } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'products'), limit(50));
        const querySnapshot = await getDocs(q);
        const fetchedProducts: Product[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
        });
        
        // If Firestore is empty (first load), fallback to an empty array for now until admin seeds it
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const handleSearch = (e: any) => {
      setSearchQuery(e.detail?.toLowerCase() || '');
      setActiveCategory(null);
    };

    window.addEventListener('esport_search', handleSearch);
    return () => window.removeEventListener('esport_search', handleSearch);
  }, []);

  const scrollToSection = (category: string) => {
    const safeId = category.replace(/\s+/g, '-').toLowerCase();
    const section = document.getElementById(safeId);
    if (section) {
      const offsetTop = section.offsetTop - 100;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product);
    navigate('/cart');
  };

  const renderProducts = (items: Product[]) => {
    if (items.length === 0) {
      return (
        <div className="col-span-full py-10 text-center border border-dashed border-white/20">
          <p className="text-[var(--color-text-muted)] text-xl">No gear found in the armory matching your criteria.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8">
        {items.map((product, idx) => {
          const wishlisted = isInWishlist(product.id);
          return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(idx * 0.1, 0.5) }}
            key={product.id}
            className="clip-path-card bg-[#12141d]/60 backdrop-blur-md border border-[rgba(0,240,255,0.15)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-5 relative transition-all duration-300 flex flex-col hover:bg-[rgba(0,240,255,0.05)] hover:-translate-y-1 hover:border-[var(--color-neon-blue)] hover:shadow-[0_8px_32px_0_rgba(0,240,255,0.15)] group"
          >
            <button 
              onClick={() => toggleWishlist(product)}
              className="absolute top-4 right-4 z-20 bg-black/50 border border-white/10 p-2 rounded-full transition-all hover:scale-110"
            >
              <Heart size={20} className={wishlisted ? "fill-red-500 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "text-white/70"} />
            </button>
            <div className="absolute inset-0 border border-transparent transition-all duration-300 pointer-events-none group-hover:border-[var(--color-neon-blue)] group-hover:shadow-[inset_0_0_20px_rgba(0,240,255,0.1)]"></div>
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-[200px] object-cover mb-4 border border-white/10"
                onError={(e: any) => e.target.src = 'https://via.placeholder.com/250x200/12141d/00f0ff?text=No+Image'}
              />
              {product.stock !== undefined && product.stock < 5 && product.stock > 0 && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
                  Only {product.stock} left
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute top-2 left-2 bg-gray-600 text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
                  Out of Stock
                </div>
              )}
            </div>
            <div className="flex-grow flex flex-col relative z-10">
              <h3 className="text-[1.4rem] font-semibold mb-2 text-white line-clamp-2">{product.name}</h3>
              <div className="flex items-baseline gap-2 mb-5 mt-auto">
                {product.originalPrice && (
                  <span className="line-through text-[var(--color-text-muted)] text-[1.1rem]">₹{product.originalPrice}</span>
                )}
                <span className="text-[1.6rem] font-bold text-[var(--color-neon-green)] drop-shadow-[0_0_5px_rgba(57,255,20,0.3)]">₹{product.price}</span>
              </div>
              <div className="mt-auto flex flex-col gap-3">
                <button 
                  onClick={() => handleBuyNow(product)}
                  disabled={product.stock === 0}
                  className="bg-[rgba(0,240,255,0.1)] border border-[var(--color-neon-blue)] text-[var(--color-neon-blue)] py-3 font-main text-xl font-bold uppercase cursor-pointer transition-all text-center hover:bg-[var(--color-neon-blue)] hover:text-[var(--color-bg-dark)] hover:shadow-[0_0_15px_var(--color-neon-blue)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {product.stock === 0 ? 'OUT OF STOCK' : 'BUY NOW'}
                </button>
                <button 
                  onClick={() => setSelectedProduct(product)}
                  className="bg-transparent border border-[var(--color-text-muted)] text-[var(--color-text-muted)] py-2 font-main text-lg font-bold uppercase cursor-pointer transition-all text-center hover:border-white hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:scale-105"
                >
                  VIEW DETAILS
                </button>
              </div>
            </div>
          </motion.div>
        )})}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[var(--color-neon-blue)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <header className="text-center py-16 px-5 bg-gradient-to-b from-[rgba(0,240,255,0.05)] to-transparent border-b border-white/5">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-6xl font-bold tracking-[4px] mb-3 text-white drop-shadow-[0_0_20px_var(--color-neon-blue)] uppercase"
        >
          GEAR UP FOR VICTORY
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl text-[var(--color-text-muted)]"
        >
          The ultimate arsenal for elite players.
        </motion.p>
      </header>

      {/* Quick Categories */}
      {!searchQuery && (
        <div className="flex justify-center flex-wrap gap-4 py-5 px-[5%] bg-black/40 border-b border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative z-20 sticky top-[80px]">
          {CATEGORIES.map((cat, i) => {
            return (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={cat}
                onClick={() => scrollToSection(cat)}
                className="clip-path-btn bg-[var(--color-bg-dark)] border border-white/20 text-white px-5 py-2.5 font-main text-[1.1rem] font-semibold cursor-pointer uppercase transition-all hover:border-[var(--color-neon-green)] hover:text-[var(--color-neon-green)] hover:shadow-[0_0_15px_rgba(57,255,20,0.2)]"
              >
                {cat}
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Dynamic Categories Container */}
      <div className="pb-16 pt-8">
        {searchQuery ? (
          <section className="p-10 px-[5%]">
            <div className="flex justify-between items-center mb-8 border-b-2 border-[var(--color-border-color)] pb-3">
              <h2 className="text-3xl text-[var(--color-neon-green)] drop-shadow-[0_0_10px_rgba(57,255,20,0.4)] uppercase tracking-[2px] flex items-center gap-3">
                <span className="inline-block w-4 h-4 bg-[var(--color-neon-green)] shadow-[0_0_10px_var(--color-neon-green)] rotate-45"></span>
                Search Results for "{searchQuery}"
              </h2>
            </div>
            {renderProducts(products.filter(p => p.name.toLowerCase().includes(searchQuery) || (p.category || '').toLowerCase().includes(searchQuery)))}
          </section>
        ) : (
          CATEGORIES.map(category => {
            const categoryProducts = products.filter(p => p.category === category);
            
            const safeId = category.replace(/\s+/g, '-').toLowerCase();

            return (
              <section key={category} id={safeId} className="p-10 px-[5%]">
                <div className="flex justify-between items-center mb-8 border-b-2 border-[var(--color-border-color)] pb-3">
                  <h2 className="text-3xl text-[var(--color-neon-green)] drop-shadow-[0_0_10px_rgba(57,255,20,0.4)] uppercase tracking-[2px] flex items-center gap-3">
                    <span className="inline-block w-4 h-4 bg-[var(--color-neon-green)] shadow-[0_0_10px_var(--color-neon-green)] rotate-45"></span>
                    {category}
                  </h2>
                  <button 
                    onClick={() => setActiveCategory(category)}
                    className="clip-path-view-all bg-transparent border border-[var(--color-neon-blue)] text-[var(--color-neon-blue)] px-5 py-2 font-main text-[1.1rem] font-semibold cursor-pointer uppercase transition-all hover:bg-[var(--color-neon-blue)] hover:text-[#090a0f] hover:shadow-[0_0_15px_var(--color-neon-blue)]"
                  >
                    View All
                  </button>
                </div>
                {renderProducts(categoryProducts.slice(0, 4))}
              </section>
            );
          })
        )}
      </div>

      {/* Category Modal */}
      <AnimatePresence>
        {activeCategory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#090a0f]/95 backdrop-blur-sm z-[1000] flex justify-center p-10 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[var(--color-bg-card)] w-full max-w-[1200px] p-10 border border-[var(--color-neon-blue)] shadow-[0_0_30px_rgba(0,240,255,0.2)] relative min-h-[80vh]"
            >
              <button 
                onClick={() => setActiveCategory(null)}
                className="absolute top-5 right-8 text-4xl text-[var(--color-neon-orange)] cursor-pointer hover:text-white hover:drop-shadow-[0_0_10px_var(--color-neon-orange)] transition-colors"
              >
                &times;
              </button>
              <h2 className="text-4xl text-[var(--color-neon-blue)] mb-8 font-bold tracking-widest uppercase drop-shadow-[0_0_10px_var(--color-neon-blue)] border-b border-[var(--color-border-color)] pb-4">
                {activeCategory}
              </h2>
              {renderProducts(products.filter(p => p.category === activeCategory))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#090a0f]/95 backdrop-blur-sm z-[1010] flex justify-center items-center p-5 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[var(--color-bg-card)] w-full max-w-[900px] border border-[var(--color-neon-blue)] shadow-[0_0_30px_rgba(0,240,255,0.2)] relative flex flex-col md:flex-row gap-8 p-8"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-5 text-4xl text-[var(--color-neon-orange)] cursor-pointer hover:text-white hover:drop-shadow-[0_0_10px_var(--color-neon-orange)] transition-colors z-10 leading-none"
              >
                &times;
              </button>
              
              <div className="w-full md:w-2/5 flex-shrink-0 flex items-center justify-center">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full object-contain border border-white/10"
                  onError={(e: any) => e.target.src = 'https://via.placeholder.com/400x400/12141d/00f0ff?text=No+Image'}
                />
              </div>
              
              <div className="w-full md:w-3/5 flex flex-col">
                <span className="text-[var(--color-neon-green)] uppercase tracking-widest text-sm mb-2 font-bold">{selectedProduct.category}</span>
                <h2 className="text-3xl text-white mb-3 font-bold">{selectedProduct.name}</h2>
                <div className="flex items-baseline gap-4 mb-6">
                  {selectedProduct.originalPrice && (
                    <span className="line-through text-[var(--color-text-muted)] text-xl">₹{selectedProduct.originalPrice}</span>
                  )}
                  <span className="text-3xl font-bold text-[var(--color-neon-blue)] drop-shadow-[0_0_5px_rgba(0,240,255,0.3)]">₹{selectedProduct.price}</span>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl text-[var(--color-neon-orange)] mb-4 border-b border-[rgba(255,69,0,0.3)] pb-2 uppercase tracking-wide font-semibold">Detailed Specifications</h3>
                  <ul className="list-disc pl-5 text-[var(--color-text-main)] space-y-3 mb-8 text-lg opacity-90">
                    {selectedProduct.specs && selectedProduct.specs.length > 0 ? (
                      selectedProduct.specs.map((spec, idx) => (
                        <li key={idx}>{spec}</li>
                      ))
                    ) : (
                      <>
                        <li>Premium build quality and extreme durability.</li>
                        <li>Optimized for low-latency, competitive gaming.</li>
                        <li>Ergonomic design crafted for marathon sessions.</li>
                        <li>Seamless compatibility across top eSports platforms.</li>
                        <li>1 Year exclusive Manufacturer Warranty included.</li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div className="flex gap-4 mt-auto">
                  <button 
                    onClick={() => {
                      handleBuyNow(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    disabled={selectedProduct.stock === 0}
                    className="flex-1 bg-[var(--color-neon-blue)] text-[var(--color-bg-dark)] py-3 px-6 font-main text-xl font-bold uppercase cursor-pointer transition-all text-center hover:shadow-[0_0_20px_var(--color-neon-blue)] hover:scale-[1.02] border-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedProduct.stock === 0 ? 'OUT OF STOCK' : 'PURCHASE NOW'}
                  </button>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="bg-transparent border border-white/20 text-white py-3 px-6 font-main text-xl font-bold uppercase cursor-pointer transition-all hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-[1.02]"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
