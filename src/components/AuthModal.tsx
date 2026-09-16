import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user document exists, if not create it
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'USER', // Default role
          createdAt: new Date().toISOString()
        });
      }
      
      onClose();
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1050] flex items-center justify-center p-4">
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-neon-blue)] shadow-[0_0_30px_rgba(0,240,255,0.2)] p-8 max-w-md w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-white text-2xl"
        >
          &times;
        </button>
        
        <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-wider text-center">
          Command <span className="text-[var(--color-neon-blue)]">Access</span>
        </h2>

        {user ? (
          <div className="text-center">
            <div className="w-20 h-20 bg-black/50 border-2 border-[var(--color-neon-green)] rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={40} className="text-[var(--color-neon-green)]" />
              )}
            </div>
            <h3 className="text-xl text-white font-bold mb-1">{user.displayName || 'Operator'}</h3>
            <p className="text-[var(--color-text-muted)] mb-2">{user.email}</p>
            <div className="inline-block bg-[rgba(57,255,20,0.1)] text-[var(--color-neon-green)] border border-[var(--color-neon-green)] px-3 py-1 text-xs font-bold uppercase tracking-widest mb-6">
              Role: {userData?.role || 'USER'}
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  onClose();
                  navigate('/profile');
                }}
                className="w-full bg-[rgba(0,240,255,0.1)] border border-[var(--color-neon-blue)] text-[var(--color-neon-blue)] py-3 font-bold uppercase hover:bg-[var(--color-neon-blue)] hover:text-black transition-all"
              >
                View Profile
              </button>
              
              {userData?.role === 'ADMIN' && (
                <button 
                  onClick={() => {
                    onClose();
                    navigate('/admin');
                  }}
                  className="w-full bg-[rgba(255,69,0,0.1)] border border-[var(--color-neon-orange)] text-[var(--color-neon-orange)] py-3 font-bold uppercase hover:bg-[var(--color-neon-orange)] hover:text-white transition-all"
                >
                  Admin Dashboard
                </button>
              )}
              
              {userData?.role === 'SELLER' && (
                <button 
                  onClick={() => {
                    onClose();
                    navigate('/seller');
                  }}
                  className="w-full bg-[rgba(255,215,0,0.1)] border border-[#ffd700] text-[#ffd700] py-3 font-bold uppercase hover:bg-[#ffd700] hover:text-black transition-all"
                >
                  Seller Dashboard
                </button>
              )}
              
              <button 
                onClick={handleLogout}
                className="w-full bg-transparent border border-white/20 text-[var(--color-text-muted)] py-3 font-bold uppercase hover:border-white hover:text-white transition-all flex items-center justify-center gap-2 mt-4"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-[var(--color-text-muted)] mb-8">
              Authenticate your account to access your personalized loadout, track orders, and secure your data.
            </p>
            
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white text-black py-4 font-bold text-lg uppercase flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>
            
            <p className="text-xs text-[var(--color-text-muted)] mt-6">
              By authenticating, you agree to the Terms of Service and Privacy Policy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
