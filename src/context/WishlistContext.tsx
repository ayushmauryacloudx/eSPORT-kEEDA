import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number | string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        try {
          const docRef = await getDoc(doc(db, 'wishlists', user.uid));
          if (docRef.exists()) {
            setWishlist(docRef.data().items || []);
          } else {
            // Check local storage merge
            const local = localStorage.getItem('esport_wishlist');
            if (local) {
              const parsed = JSON.parse(local);
              setWishlist(parsed);
              await setDoc(doc(db, 'wishlists', user.uid), { items: parsed });
            }
          }
        } catch (error) {
          console.error("Error loading wishlist from Firestore:", error);
        }
      } else {
        try {
          const local = localStorage.getItem('esport_wishlist');
          if (local) setWishlist(JSON.parse(local));
          else setWishlist([]);
        } catch (e) {
          // ignore
        }
      }
      setIsLoaded(true);
    };

    loadWishlist();
  }, [user]);

  const saveWishlist = async (newList: Product[]) => {
    setWishlist(newList);
    if (user) {
      try {
        await setDoc(doc(db, 'wishlists', user.uid), { items: newList });
      } catch (error) {
        console.error("Error saving wishlist:", error);
      }
    } else {
      try {
        localStorage.setItem('esport_wishlist', JSON.stringify(newList));
      } catch (e) {
        // ignore
      }
    }
  };

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.find(item => item.id === product.id);
    if (exists) {
      saveWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      saveWishlist([...wishlist, product]);
    }
  };

  const isInWishlist = (productId: number | string) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
