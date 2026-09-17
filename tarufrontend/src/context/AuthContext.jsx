import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refresh user data by hitting GET /auth/me
  const refreshUser = useCallback(async () => {
    try {
      const data = await getCurrentUser();
      if (data && data.success && data.user) {
        setUser(data.user);
        return data.user;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      // 401 or network error on startup means not authenticated
      setUser(null);
      return null;
    }
  }, []);

  // Check auth session on startup
  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      try {
        const data = await getCurrentUser();
        if (mounted && data && data.success && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();
    return () => {
      mounted = false;
    };
  }, []);

  // Login handler
  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await loginUser(credentials);
      // Backend sets httpOnly cookie; we refresh user to sync state
      const currentUser = await refreshUser();
      return { success: true, user: currentUser || res.user };
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await registerUser(userData);
      return res;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
    } catch (error) {
      console.warn("Logout error:", error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isBuyer: user?.role === "BUYER",
    isSeller: user?.role === "SELLER",
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

