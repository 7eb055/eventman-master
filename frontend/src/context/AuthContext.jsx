import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, getToken, logout as authLogout } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(true);

  // Always sync user state with localStorage on mount and when storage changes
  useEffect(() => {
    const syncUser = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('storage', syncUser);
    syncUser();
    setLoading(false);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
