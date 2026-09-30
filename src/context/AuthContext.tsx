import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  continueAsGuest: () => void;
  updateProfile: (name: string, email: string) => void;
}

const DEFAULT_USER: User = {
  id: 'usr_demo_101',
  name: 'Alex Morgan',
  email: 'alex.morgan@pdfstudio.app',
  createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  storageLimitBytes: 500 * 1024 * 1024, // 500 MB
  isGuest: false,
};

const GUEST_USER: User = {
  id: 'usr_guest',
  name: 'Guest User',
  email: 'guest@pdfstudio.local',
  createdAt: new Date().toISOString(),
  storageLimitBytes: 100 * 1024 * 1024, // 100 MB temporary
  isGuest: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('pdf_studio_active_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default to Alex Morgan for immediate, rich experience
    return DEFAULT_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('pdf_studio_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pdf_studio_active_user');
    }
  }, [user]);

  const login = async (email: string, _pass: string): Promise<boolean> => {
    // In browser client auth:
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      createdAt: new Date().toISOString(),
      storageLimitBytes: 500 * 1024 * 1024,
      isGuest: false,
    };
    setUser(newUser);
    return true;
  };

  const signup = async (name: string, email: string, _pass: string): Promise<boolean> => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      createdAt: new Date().toISOString(),
      storageLimitBytes: 500 * 1024 * 1024,
      isGuest: false,
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const continueAsGuest = () => {
    setUser(GUEST_USER);
  };

  const updateProfile = (name: string, email: string) => {
    if (!user) return;
    setUser({ ...user, name, email });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest: !!user?.isGuest,
        login,
        signup,
        logout,
        continueAsGuest,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
