// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

import app from "../firebaseconfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const db = getDatabase(app);

  // Check if user is admin
  const checkAdminStatus = async (uid) => {
    try {
      const adminRef = ref(db, `admins/${uid}`);
      const snapshot = await get(adminRef);
      return snapshot.exists();
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const isUserAdmin = await checkAdminStatus(userCredential.user.uid);
      if (!isUserAdmin) {
        await signOut(auth);
        throw new Error("Unauthorized access: User is not an admin");
      }
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    return signOut(auth);
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const adminStatus = await checkAdminStatus(user.uid);
        setIsAdmin(adminStatus);
        setUser(user);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    isAdmin,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
