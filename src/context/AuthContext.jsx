import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInAnonymously, 
  setPersistence, 
  browserLocalPersistence 
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((err) =>
      console.warn("Persistence error:", err)
    );

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        if (!user.isAnonymous) {
          localStorage.setItem('pimaga_logged_in_provider', 'google');
        }
      } else {
        // Fallback: signInAnonymously if not logged in
        try {
          await signInAnonymously(auth);
        } catch (e) {
          console.warn("Anonymous sign-in fallback:", e);
        }
        setCurrentUser(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      if (result && result.user) {
        localStorage.setItem('pimaga_logged_in_provider', 'google');
      }
      showToast("Đăng nhập Google thành công!", "success");
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }
      showToast("Không thể mở cửa sổ đăng nhập Google: " + error.message, "error");
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('pimaga_logged_in_provider');
      await signOut(auth);
      showToast("Đã đăng xuất!", "success");
      await signInAnonymously(auth);
    } catch (error) {
      showToast("Lỗi đăng xuất: " + error.message, "error");
    }
  };

  const isRealUser = currentUser && !currentUser.isAnonymous;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentUserId: currentUser?.uid || null,
        isRealUser,
        loadingAuth,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
