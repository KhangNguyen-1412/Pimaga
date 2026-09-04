import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut, 
  setPersistence, 
  browserLocalPersistence 
} from "firebase/auth";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager, 
  getFirestore, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  collection, 
  addDoc 
} from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCLIx0c0xDqjmyocKelJXkoPZv1ogW5nJE",
  authDomain: "pimaga-e0dc5.firebaseapp.com",
  projectId: "pimaga-e0dc5",
  storageBucket: "pimaga-e0dc5.firebasestorage.app",
  messagingSenderId: "315533936180",
  appId: "1:315533936180:web:5f5991d31b7f8ea1672c61",
  measurementId: "G-QDJMNR9B3F"
};

export const app = initializeApp(firebaseConfig);

let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  });
} catch (e) {
  console.warn("Firestore cache fallback:", e);
  firestoreDb = getFirestore(app);
}

import { getStorage } from "firebase/storage";

export const db = firestoreDb;
export const auth = getAuth(app);
export const storage = getStorage(app);
setPersistence(auth, browserLocalPersistence).catch(err => console.warn("Persistence error:", err));

export const googleProvider = new GoogleAuthProvider();
export const sysAppId = typeof window !== 'undefined' && window.__app_id ? window.__app_id : 'default-pi-app';
