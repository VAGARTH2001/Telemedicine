import React, { createContext, useState, useContext, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('tele_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('tele_user');
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch (_) {
        localStorage.removeItem('tele_user');
        localStorage.removeItem('tele_token');
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('tele_token', data.token);
    localStorage.setItem('tele_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tele_token');
    localStorage.removeItem('tele_user');
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isDoctor: user?.role === 'doctor',
    isUser: user?.role === 'user' || !user?.role,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
