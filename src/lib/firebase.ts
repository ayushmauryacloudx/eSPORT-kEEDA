import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0383638130",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:18478938993:web:16c89f5c8dbc6be1a654d0",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0383638130.firebaseapp.com",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0383638130.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "18478938993",
};

export const app = initializeApp(firebaseConfig);
const databaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || "ai-studio-e7b7de2e-615f-4a55-8fe7-e889f28ff7f0";
export const db = getFirestore(app, databaseId);
export const auth = getAuth(app);

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration or network connectivity.");
    }
  }
}
testConnection();
