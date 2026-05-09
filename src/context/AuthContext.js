import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('shopzone_warehouse_token');
    const storedUserRaw = localStorage.getItem('shopzone_warehouse_user');
    if (storedUserRaw) {
      try {
        setUser(JSON.parse(storedUserRaw));
      } catch {
        // ignore
      }
    }

    const bootstrap = async () => {
      if (!storedToken) {
        setLoading(false);
        return;
      }
      setToken(storedToken);
      try {
        const me = await authService.me();
  if (!me) throw new Error('Empty /me response');
        localStorage.setItem('shopzone_warehouse_user', JSON.stringify(me));
        setUser(me);
      } catch (err) {
        localStorage.removeItem('shopzone_warehouse_user');
        localStorage.removeItem('shopzone_warehouse_token');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = (newToken, userData) => {
    localStorage.setItem('shopzone_warehouse_user', JSON.stringify(userData));
    localStorage.setItem('shopzone_warehouse_token', newToken);
    setUser(userData);
    setToken(newToken);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // best-effort
    }
    localStorage.removeItem('shopzone_warehouse_user');
    localStorage.removeItem('shopzone_warehouse_token');
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      role: user?.role || null,
      isAuthenticated: Boolean(user && token),
      loading,
      login,
      logout
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
