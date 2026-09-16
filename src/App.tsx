import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import MobileBottomNav from './components/MobileBottomNav';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import { useEffect } from 'react';
import { defaultProducts } from './data';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

export default function App() {
  useEffect(() => {
    try {
      if (!localStorage.getItem('esport_products')) {
        localStorage.setItem('esport_products', JSON.stringify(defaultProducts));
      }
    } catch (e) {
      console.warn("localStorage is blocked:", e);
    }
  }, []);

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-[#070A12] text-[#F8FAFC]">
              <Navbar />
              <main className="flex-grow pb-14 md:pb-0">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
              <Footer />
              <MobileBottomNav />
              <Chatbot />
            </div>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
