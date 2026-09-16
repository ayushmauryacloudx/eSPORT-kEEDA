import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Pen, Trash2, ShieldAlert } from 'lucide-react';
import { Product, CATEGORIES } from '../types';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';

export default function Admin() {
  const { user, userData, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [geminiKey, setGeminiKey] = useState('');
  const [apiSaveMsg, setApiSaveMsg] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', category: CATEGORIES[0], image: '', originalPrice: '', price: '', link: '', stock: '10'
  });

  useEffect(() => {
    if (userData?.role === 'ADMIN') {
      fetchProducts();
      try {
        const key = localStorage.getItem('esport_gemini_key');
        if (key) setGeminiKey(key);
      } catch (e) {
        // ignore
      }
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

  const handleSaveApi = () => {
    if (geminiKey.trim()) {
      try {
        localStorage.setItem('esport_gemini_key', geminiKey.trim());
      } catch (e) {
        console.warn("localStorage is blocked:", e);
      }
      setApiSaveMsg(true);
      setTimeout(() => setApiSaveMsg(false), 3000);
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
      fetchProducts();
      alert("Product saved successfully!");
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
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error deleting product.");
      }
    }
  };

  if (loading) return <div className="flex justify-center p-20"><div className="w-12 h-12 border-4 border-[var(--color-neon-blue)] border-t-transparent rounded-full animate-spin"></div></div>;

  if (!user || userData?.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-5">
        <ShieldAlert size={80} className="text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h2 className="text-4xl font-bold text-white mb-2 uppercase tracking-widest">ACCESS DENIED</h2>
        <p className="text-[var(--color-text-muted)] text-xl mb-8">You do not have the required clearance to access this sector.</p>
      </div>
    );
  }

  return (
    <div className="p-10 px-[5%] max-w-[1400px] mx-auto">
      {/* API Config */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-bg-card)] p-8 border border-[var(--color-border-color)] mb-10 shadow-[0_0_20px_rgba(0,240,255,0.1)]"
      >
        <h2 className="text-[var(--color-neon-blue)] text-3xl mb-6 flex items-center gap-3 font-bold uppercase">
          <Bot size={32} /> GEAR AI Configuration
        </h2>
        <div className="flex flex-col gap-2">
          <label className="text-[var(--color-text-muted)]">Google AI Studio API Key (Gemini)</label>
          <div className="flex gap-4">
            <input 
              type="password" 
              value={geminiKey}
              onChange={e => setGeminiKey(e.target.value)}
              className="flex-grow bg-black/50 border border-white/10 text-white p-3 font-main outline-none focus:border-[var(--color-neon-orange)] transition-colors"
              placeholder="Paste your API key here to activate the Chatbot"
            />
            <button onClick={handleSaveApi} className="bg-[var(--color-neon-blue)] text-black border-none px-8 font-main text-lg font-bold uppercase cursor-pointer transition-all hover:shadow-[0_0_15px_var(--color-neon-blue)]">
              Save Key
            </button>
          </div>
          {apiSaveMsg && <p className="text-[var(--color-neon-green)] mt-2">API Key saved successfully!</p>}
        </div>
      </motion.div>

      {/* Product Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--color-bg-card)] p-8 border border-[var(--color-border-color)] mb-10 shadow-[0_0_20px_rgba(0,240,255,0.1)]"
      >
        <h2 className="text-[var(--color-neon-orange)] text-3xl mb-6 font-bold uppercase">
          {editId ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[var(--color-text-muted)]">Product Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-black/50 border border-white/10 text-white p-3 font-main outline-none focus:border-[var(--color-neon-orange)] transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[var(--color-text-muted)]">Category</label>
            <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-black/50 border border-white/10 text-white p-3 font-main outline-none focus:border-[var(--color-neon-orange)] transition-colors">
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[var(--color-text-muted)]">Image URL</label>
            <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="bg-black/50 border border-white/10 text-white p-3 font-main outline-none focus:border-[var(--color-neon-orange)] transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[var(--color-text-muted)]">Stock Quantity</label>
            <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="bg-black/50 border border-white/10 text-white p-3 font-main outline-none focus:border-[var(--color-neon-orange)] transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[var(--color-text-muted)]">Original Price (Number only, e.g., 9999)</label>
            <input required type="text" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} className="bg-black/50 border border-white/10 text-white p-3 font-main outline-none focus:border-[var(--color-neon-orange)] transition-colors" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[var(--color-text-muted)]">Discounted Price (Number only, e.g., 7999)</label>
            <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="bg-black/50 border border-white/10 text-white p-3 font-main outline-none focus:border-[var(--color-neon-orange)] transition-colors" />
          </div>
          
          <div className="md:col-span-2 flex gap-4 mt-4">
            <button type="submit" className="bg-[var(--color-neon-orange)] text-white border-none px-8 py-3 font-main text-lg font-bold uppercase cursor-pointer transition-all hover:shadow-[0_0_15px_var(--color-neon-orange)]">
              Save Product
            </button>
            {editId && (
              <button type="button" onClick={resetForm} className="bg-[#333] text-white border-none px-8 py-3 font-main text-lg font-bold uppercase cursor-pointer transition-all hover:bg-gray-600">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Product List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[var(--color-bg-card)] p-8 border border-white/10 overflow-x-auto shadow-[0_0_20px_rgba(0,0,0,0.5)]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[var(--color-neon-blue)] text-3xl font-bold uppercase">Manage Products</h2>
          <button onClick={fetchProducts} className="text-[var(--color-neon-green)] text-sm border border-[var(--color-neon-green)] px-3 py-1 hover:bg-[var(--color-neon-green)] hover:text-black">
            Refresh
          </button>
        </div>
        
        {fetching ? (
          <div className="text-center py-10 text-[var(--color-text-muted)]">Loading products...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b border-white/5 text-[var(--color-neon-blue)] font-semibold uppercase">Image</th>
                <th className="p-4 border-b border-white/5 text-[var(--color-neon-blue)] font-semibold uppercase">Name</th>
                <th className="p-4 border-b border-white/5 text-[var(--color-neon-blue)] font-semibold uppercase">Category</th>
                <th className="p-4 border-b border-white/5 text-[var(--color-neon-blue)] font-semibold uppercase">Price</th>
                <th className="p-4 border-b border-white/5 text-[var(--color-neon-blue)] font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                  <td className="p-4">
                    <img src={p.image} alt="Img" className="w-[50px] h-[50px] object-cover rounded border border-white/10" onError={(e: any) => e.target.src = 'https://via.placeholder.com/50x50/12141d/00f0ff?text=No+Img'} />
                  </td>
                  <td className="p-4 text-white font-medium">{p.name}</td>
                  <td className="p-4 text-[var(--color-text-muted)]">{p.category}</td>
                  <td className="p-4 text-[var(--color-neon-green)] font-bold">₹{p.price}</td>
                  <td className="p-4">
                    <button onClick={() => editProduct(p)} className="bg-transparent border-none text-[var(--color-neon-blue)] cursor-pointer text-xl mr-4 hover:scale-110 transition-transform">
                      <Pen size={20} />
                    </button>
                    <button onClick={() => handleDeleteProduct(p.id as string)} className="bg-transparent border-none text-[var(--color-neon-orange)] cursor-pointer text-xl hover:scale-110 transition-transform">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-[var(--color-text-muted)] py-10">No products found in Firestore. Add some above.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
}
