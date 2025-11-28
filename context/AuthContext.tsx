
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types';
import mockApi from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect is for verifying the token on app load.
    // In a real app, you would have a `verifyToken` API call.
    // Here we'll just simulate it.
    const verifyUser = () => {
        const storedUser = localStorage.getItem('admin_user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }
    verifyUser();
  }, [token]);

  const login = async (email: string, pass: string) => {
    const response = await mockApi.login(email, pass);
    if (response) {
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('admin_user', JSON.stringify(response.user));
    } else {
        throw new Error('Email atau password salah');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  const value = {
    isAuthenticated: !!token,
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
