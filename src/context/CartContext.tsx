import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();
  
  // Track initial load to prevent saving empty cart over existing data
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // Load from Firestore
        try {
          const cartDoc = await getDoc(doc(db, 'carts', user.uid));
          if (cartDoc.exists()) {
            setCart(cartDoc.data().items || []);
          } else {
            // Check if there's a local cart to merge
            try {
              const storedCart = localStorage.getItem('esport_cart');
              if (storedCart) {
                const parsed = JSON.parse(storedCart);
                setCart(parsed);
                // Save it to firestore
                await setDoc(doc(db, 'carts', user.uid), { items: parsed });
              }
            } catch (e) {
               // ignore
            }
          }
        } catch (error) {
          console.error("Error loading cart from Firestore:", error);
        }
      } else {
        // Load from localStorage
        try {
          const storedCart = localStorage.getItem('esport_cart');
          if (storedCart) {
            setCart(JSON.parse(storedCart));
          } else {
            setCart([]);
          }
        } catch (e) {
          console.warn("localStorage is blocked:", e);
        }
      }
      setIsLoaded(true);
    };

    loadCart();
  }, [user]);

  const saveCart = async (newCart: CartItem[]) => {
    setCart(newCart);
    
    if (user) {
      try {
        await setDoc(doc(db, 'carts', user.uid), { items: newCart });
      } catch (error) {
        console.error("Error saving cart to Firestore:", error);
      }
    } else {
      try {
        localStorage.setItem('esport_cart', JSON.stringify(newCart));
      } catch (e) {
        console.warn("localStorage is blocked:", e);
      }
    }
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      const newCart = cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCart(newCart);
    } else {
      saveCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number | string) => {
    saveCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number | string, quantity: number) => {
    if (quantity < 1) return;
    saveCart(cart.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    saveCart([]);
  };

  const parsePrice = (priceStr: string | number) => {
    if (typeof priceStr === 'number') return priceStr;
    const match = priceStr.replace(/,/g, '').match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  const cartTotal = cart.reduce((total, item) => total + parsePrice(item.price) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
