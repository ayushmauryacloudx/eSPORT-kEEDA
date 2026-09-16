import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "gen-lang-client-0383638130",
  appId: "1:18478938993:web:16c89f5c8dbc6be1a654d0",
  apiKey: "AIzaSyD7YFRMkyLA_UGZI25bK1KqNfSN_1uNe4M",
  authDomain: "gen-lang-client-0383638130.firebaseapp.com",
  storageBucket: "gen-lang-client-0383638130.firebasestorage.app",
  messagingSenderId: "18478938993",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-e7b7de2e-615f-4a55-8fe7-e889f28ff7f0");
export const auth = getAuth(app);
