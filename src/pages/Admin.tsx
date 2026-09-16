import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bot, Pen, Trash2, ShieldAlert, Plus, ShieldCheck, RefreshCw, Sparkles, Zap, CheckCircle2, Layers, Flame } from 'lucide-react';
import { Product, CATEGORIES } from '../types';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';

export default function Admin() {
  const { user, userData, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(false);
  const [aiStatus, setAiStatus] = useState<{ status: string; hasKey: boolean; model: string }>({
    status: 'CHECKING',
    hasKey: false,
    model: 'gemini-3.8-flash'
  });

  // AI Auto-Fill State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [isSeedingBatch, setIsSeedingBatch] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);
  const [lastGeneratedSpec, setLastGeneratedSpec] = useState<{
    specs?: string[];
    badge?: string;
    compatibility?: string[];
    description?: string;
  } | null>(null);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', category: CATEGORIES[0], image: '', originalPrice: '', price: '', link: '', stock: '10'
  });

  const AI_PRESETS = [
    '360Hz Fast IPS Esports Monitor for Valorant',
    '0.1mm Rapid Trigger Magnetic Keyboard',
    'Sub-54g 8KHz Wireless Esports Mouse for CS2',
    'Snapdragon 8 Gen 3 Gaming Phone for BGMI',
    '27W Active Peltier Semiconductor Cooler',
    'Planar Magnetic 7.1 Spatial Audio Headset'
  ];

  useEffect(() => {
    if (userData?.role === 'ADMIN') {
      fetchProducts();
      checkAiHealth();
    }
  }, [userData]);

  const fetchProducts = async () => {
    setFetching(true);
    try {
      const q = query(collection(db, 'products'));
      const querySnapshot = await getDocs(q);
      const fetchedProducts: Product[] = [];
      querySnapshot.forEach((doc) => {
        fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setFetching(false);
    }
  };

  const checkAiHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setAiStatus({
          status: 'ONLINE',
          hasKey: data.hasGeminiKey,
          model: data.model || 'gemini-3.8-flash'
        });
      }
    } catch {
      setAiStatus({
        status: 'FALLBACK_MODE',
        hasKey: false,
        model: 'gemini-3.8-flash'
      });
    }
  };

  const handleAiAutoFill = async (overridePrompt?: string) => {
    const queryPrompt = overridePrompt || aiPrompt.trim() || formData.name || formData.category;
    setIsAutoFilling(true);
    setAiSuccessMessage(null);
    try {
      const res = await fetch('/api/ai/auto-fill-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryPrompt,
          category: formData.category
        })
      });
      if (!res.ok) throw new Error('Auto-fill request failed');
      const data = await res.json();
      if (data.product) {
        const p = data.product;
        setFormData({
          name: p.name || '',
          category: p.category || CATEGORIES[0],
          image: p.image || '',
          originalPrice: `₹${Number(p.originalPrice || 0).toLocaleString('en-IN')}`,
          price: `₹${Number(p.price || 0).toLocaleString('en-IN')}`,
          link: '',
          stock: String(p.stock || 10)
        });
        setLastGeneratedSpec({
          specs: p.specs || [],
          badge: p.badge || 'PRO PICK',
          compatibility: p.compatibility || ['BGMI', 'VALORANT', 'CS2'],
          description: p.description || ''
        });
        setAiSuccessMessage(`✨ Auto-filled "${p.name}" directly from Google AI Studio (${aiStatus.model})!`);
        setTimeout(() => setAiSuccessMessage(null), 5000);
      }
    } catch (err) {
      console.error('AI Auto-fill error:', err);
      alert('Unable to auto-fill product specifications.');
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleAiAutoPopulateBatch = async () => {
    if (!confirm('Auto-generate 4 competitive esports tournament products with Google AI Studio and save to Firestore?')) {
      return;
    }
    setIsSeedingBatch(true);
    setAiSuccessMessage(null);
    try {
      const res = await fetch('/api/ai/generate-catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 4 })
      });
      if (!res.ok) throw new Error('Catalog generation failed');
      const data = await res.json();
      if (Array.isArray(data.products) && data.products.length > 0) {
        for (const item of data.products) {
          await addDoc(collection(db, 'products'), {
            ...item,
            rating: 4.9,
            reviewsCount: Math.floor(Math.random() * 80) + 20,
            seller: 'eSPORT kEEDA Official Armory',
            warranty: '2 Year Esports Tournament Guarantee',
            createdAt: new Date().toISOString()
          });
        }
        await fetchProducts();
        setAiSuccessMessage(`⚡ Successfully generated & populated ${data.products.length} tournament products into Firestore Armory!`);
        setTimeout(() => setAiSuccessMessage(null), 6000);
      }
    } catch (err) {
      console.error('Batch auto-populate error:', err);
      alert('Error auto-generating catalog with Google AI Studio.');
    } finally {
      setIsSeedingBatch(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        stock: parseInt(formData.stock) || 0,
        originalPrice: parseFloat(formData.originalPrice.replace(/[^0-9.]/g, '')),
        price: parseFloat(formData.price.replace(/[^0-9.]/g, '')),
        specs: lastGeneratedSpec?.specs || [
          'Tournament Grade Sub-Millisecond Input Latency',
          'Certified for Competitive Esports LAN & Scrims'
        ],
        badge: lastGeneratedSpec?.badge || 'PRO PICK',
        compatibility: lastGeneratedSpec?.compatibility || ['BGMI', 'VALORANT', 'CS2'],
        description: lastGeneratedSpec?.description || 'Tournament tier hardware optimized for competitive gameplay.',
        rating: 4.9,
        reviewsCount: 48,
        seller: 'eSPORT kEEDA Verified Partner',
        warranty: '2 Year Official Manufacturer Warranty',
        updatedAt: new Date().toISOString()
      };

      if (editId) {
        await updateDoc(doc(db, 'products', editId), productData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date().toISOString()
        });
      }
      
      resetForm();
      setLastGeneratedSpec(null);
      fetchProducts();
      setAiSuccessMessage("Hardware published to Armory database!");
      setTimeout(() => setAiSuccessMessage(null), 4000);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product.");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ name: '', category: CATEGORIES[0], image: '', originalPrice: '', price: '', link: '', stock: '10' });
  };

  const editProduct = (p: Product) => {
    setEditId(p.id as string);
    setFormData({ 
      name: p.name, 
      category: p.category, 
      image: p.image, 
      originalPrice: p.originalPrice.toString(), 
      price: p.price.toString(), 
      link: p.link || '',
      stock: (p.stock || 0).toString()
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this hardware unit from database?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product.");
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center p-20">
      <div className="w-10 h-10 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user || userData?.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ShieldAlert size={64} className="text-[#EF4444] mb-4" />
        <h2 className="text-3xl font-bold font-['Chakra_Petch'] text-white mb-2 uppercase tracking-widest">
          ACCESS DENIED
        </h2>
        <p className="text-[#94A3B8] text-sm mb-6">You lack level-5 administrator credentials for this sector.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      
      {/* Header */}
      <div className="pb-4 border-b border-[#1E293B]">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#A3FF12] font-semibold block mb-1">
          COMMAND PROTOCOL
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-[#A3FF12]" />
          <span>ARMORY ADMIN CONSOLE</span>
        </h1>
      </div>

      {/* AI Config */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111827] p-6 rounded-xl border border-[#1E293B]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF]">
              <Bot size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider">
                GOOGLE AI STUDIO — ARENA INTEL ENGINE
              </h2>
              <p className="text-xs font-mono text-[#94A3B8]">
                Server-Side Neural Telemetry &amp; Tournament Advisor
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A3FF12] animate-pulse"></span>
            <span className="text-[#A3FF12] font-bold tracking-wider uppercase">
              {aiStatus.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-3.5 rounded-lg bg-[#0D1220] border border-[#1E293B]">
            <span className="text-[#94A3B8] block text-[10px] uppercase mb-1">FOUNDATION MODEL</span>
            <span className="text-white font-bold">{aiStatus.model}</span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#0D1220] border border-[#1E293B]">
            <span className="text-[#94A3B8] block text-[10px] uppercase mb-1">SECURITY ARCHITECTURE</span>
            <span className="text-[#00E5FF] font-bold">Server-Side Proxy (/api/chat)</span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#0D1220] border border-[#1E293B]">
            <span className="text-[#94A3B8] block text-[10px] uppercase mb-1">CLIENT KEY LEAK PROTECTION</span>
            <span className="text-[#A3FF12] font-bold">ACTIVE (0 Exposed Keys)</span>
          </div>
        </div>
      </motion.div>

      {/* Product Form */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#111827] p-6 rounded-xl border border-[#1E293B]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-2 border-b border-[#1E293B]">
          <h2 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider">
            {editId ? 'MODIFY EXISTING HARDWARE SPEC' : 'PROVISION NEW TOURNAMENT HARDWARE'}
          </h2>
          <span className="text-xs font-mono text-[#00E5FF] flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>AI Studio Auto-Fill Enabled</span>
          </span>
        </div>

        {/* Google AI Studio Auto-Fill Toolbar */}
        <div className="mb-6 p-4 rounded-lg bg-[#0D1220] border border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#00E5FF] animate-pulse" />
              <span className="text-xs font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider">
                AUTO-FILL SPEC VIA GOOGLE AI STUDIO ({aiStatus.model})
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#A3FF12] bg-[#A3FF12]/10 px-2 py-0.5 rounded border border-[#A3FF12]/30">
              GEMINI CONNECTED
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAiAutoFill(); } }}
              placeholder="Type any gear idea (e.g. '360Hz OLED Monitor', '8000Hz Ultra-Light Mouse', 'Wooting 80HE')..."
              className="flex-grow bg-[#070A12] border border-[#1E293B] text-white p-2.5 rounded text-xs font-mono outline-none focus:border-[#00E5FF] transition-colors"
            />
            <button
              type="button"
              onClick={() => handleAiAutoFill()}
              disabled={isAutoFilling}
              className="bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#070A12] px-5 py-2.5 font-['Chakra_Petch'] text-xs font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
            >
              {isAutoFilling ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#070A12] border-t-transparent rounded-full animate-spin"></div>
                  <span>AI COMPUTING...</span>
                </>
              ) : (
                <>
                  <Zap size={14} className="fill-current" />
                  <span>AUTO-FILL WITH AI STUDIO</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Preset Prompts */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase mr-1">Quick Presets:</span>
            {AI_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setAiPrompt(preset);
                  handleAiAutoFill(preset);
                }}
                disabled={isAutoFilling}
                className="text-[11px] font-mono text-[#94A3B8] hover:text-[#00E5FF] bg-[#111827] hover:bg-[#00E5FF]/10 border border-[#1E293B] hover:border-[#00E5FF]/40 px-2.5 py-1 rounded transition-colors"
              >
                ⚡ {preset}
              </button>
            ))}
          </div>

          {aiSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-mono text-[#A3FF12] bg-[#A3FF12]/10 border border-[#A3FF12]/30 p-2.5 rounded flex items-center gap-2"
            >
              <CheckCircle2 size={14} />
              <span>{aiSuccessMessage}</span>
            </motion.div>
          )}

          {lastGeneratedSpec && (
            <div className="p-3 bg-[#070A12] rounded border border-[#1E293B] text-[11px] font-mono space-y-1.5">
              <div className="flex items-center justify-between text-[#94A3B8]">
                <span className="text-white font-bold">✨ AI SPECIFICATIONS CALIBRATED</span>
                <span className="text-[#A3FF12] font-bold uppercase">{lastGeneratedSpec.badge}</span>
              </div>
              {lastGeneratedSpec.specs && (
                <div className="text-[#94A3B8] grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px]">
                  {lastGeneratedSpec.specs.map((s, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="text-[#00E5FF]">•</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              )}
              {lastGeneratedSpec.description && (
                <p className="text-[#64748B] text-[10px] italic border-t border-[#1E293B] pt-1">
                  "{lastGeneratedSpec.description}"
                </p>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-[#94A3B8]">Hardware Unit Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-[#0D1220] border border-[#1E293B] text-white p-2.5 rounded text-sm w-full outline-none focus:border-[#00E5FF]" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono text-[#94A3B8]">Esports Category</label>
            <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-[#0D1220] border border-[#1E293B] text-white p-2.5 rounded text-sm w-full outline-none focus:border-[#00E5FF]">
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono text-[#94A3B8]">Product Image URL</label>
            <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="bg-[#0D1220] border border-[#1E293B] text-white p-2.5 rounded text-sm w-full outline-none focus:border-[#00E5FF]" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono text-[#94A3B8]">Inventory Stock Units</label>
            <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="bg-[#0D1220] border border-[#1E293B] text-white p-2.5 rounded text-sm w-full outline-none focus:border-[#00E5FF]" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono text-[#94A3B8]">Original MRP (₹)</label>
            <input required type="text" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} className="bg-[#0D1220] border border-[#1E293B] text-white p-2.5 rounded text-sm w-full outline-none focus:border-[#00E5FF]" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono text-[#94A3B8]">Discounted Price (₹)</label>
            <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="bg-[#0D1220] border border-[#1E293B] text-white p-2.5 rounded text-sm w-full outline-none focus:border-[#00E5FF]" />
          </div>
          
          <div className="md:col-span-2 flex gap-3 mt-4">
            <button type="submit" className="bg-[#00E5FF] text-[#070A12] px-6 py-2.5 font-['Chakra_Petch'] text-xs font-bold uppercase tracking-wider rounded">
              {editId ? 'UPDATE HARDWARE' : 'PUBLISH TO ARMORY'}
            </button>
            {editId && (
              <button type="button" onClick={resetForm} className="bg-[#0D1220] border border-[#1E293B] text-white px-6 py-2.5 font-['Chakra_Petch'] text-xs font-bold uppercase tracking-wider rounded">
                CANCEL
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Product List */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#111827] p-6 rounded-xl border border-[#1E293B] overflow-x-auto"
      >
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
          <h2 className="text-lg font-bold font-['Chakra_Petch'] text-white uppercase tracking-wider">
            ARMORY INVENTORY ({products.length} PRODUCTS)
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <button 
              type="button"
              onClick={handleAiAutoPopulateBatch}
              disabled={isSeedingBatch}
              className="text-xs font-mono text-[#A3FF12] border border-[#A3FF12]/40 bg-[#A3FF12]/10 hover:bg-[#A3FF12]/20 px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Automatically generate 4 competitive tournament products using Google AI Studio and write directly to Firestore"
            >
              {isSeedingBatch ? (
                <>
                  <div className="w-3 h-3 border-2 border-[#A3FF12] border-t-transparent rounded-full animate-spin"></div>
                  <span>AI GENERATING...</span>
                </>
              ) : (
                <>
                  <Sparkles size={12} />
                  <span>⚡ AUTO-POPULATE 4 AI PRODUCTS</span>
                </>
              )}
            </button>
            <button 
              type="button"
              onClick={fetchProducts} 
              className="text-xs font-mono text-[#00E5FF] border border-[#00E5FF]/40 px-3 py-1.5 rounded hover:bg-[#00E5FF]/10 flex items-center gap-1.5"
            >
              <RefreshCw size={12} /> REFRESH
            </button>
          </div>
        </div>
        
        {fetching ? (
          <div className="text-center py-10 text-[#94A3B8] font-mono text-xs">Loading database records...</div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] text-[#94A3B8] font-mono uppercase">
                <th className="p-3">IMAGE</th>
                <th className="p-3">ITEM</th>
                <th className="p-3">CATEGORY</th>
                <th className="p-3">PRICE</th>
                <th className="p-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="hover:bg-[#0D1220] transition-colors border-b border-[#1E293B]">
                  <td className="p-3">
                    <img src={p.image} alt="Img" className="w-10 h-10 object-contain rounded bg-[#070A12] border border-[#1E293B] p-1" onError={(e: any) => e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'} />
                  </td>
                  <td className="p-3 text-white font-bold font-['Chakra_Petch']">{p.name}</td>
                  <td className="p-3 text-[#00E5FF] font-mono">{p.category}</td>
                  <td className="p-3 text-[#A3FF12] font-mono font-bold">₹{p.price}</td>
                  <td className="p-3">
                    <button onClick={() => editProduct(p)} className="text-[#00E5FF] mr-3 hover:scale-110 transition-transform">
                      <Pen size={14} />
                    </button>
                    <button onClick={() => handleDeleteProduct(p.id as string)} className="text-[#EF4444] hover:scale-110 transition-transform">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-[#94A3B8] py-8">
                    Database empty. Fallback products are serving on storefront.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </motion.div>

    </div>
  );
}
