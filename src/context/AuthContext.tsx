import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  loginWithOAuth: (provider: 'google' | 'microsoft') => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    pass: string,
    consent?: { termsVersion: string; privacyVersion: string }
  ) => Promise<boolean>;
  logout: () => void;
  continueAsGuest: () => void;
  updateProfile: (name: string, email: string) => void;
  deleteAccount: () => void;
}

const DEFAULT_USER: User = {
  id: 'usr_demo_101',
  name: 'Alex Morgan',
  displayName: 'Alex Morgan',
  email: 'alex.morgan@pdfstudio.app',
  createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  storageLimitBytes: 500 * 1024 * 1024, // 500 MB
  isGuest: false,
  provider: 'email',
  termsAcceptedAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  termsVersion: 'v1.0',
  privacyVersion: 'v1.0',
};

const GUEST_USER: User = {
  id: 'usr_guest',
  name: 'Guest User',
  displayName: 'Guest User',
  email: 'guest@pdfstudio.local',
  createdAt: new Date().toISOString(),
  storageLimitBytes: 100 * 1024 * 1024, // 100 MB temporary
  isGuest: true,
  provider: 'guest',
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
    const formattedName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: formattedName,
      displayName: formattedName,
      email,
      provider: 'email',
      createdAt: new Date().toISOString(),
      storageLimitBytes: 500 * 1024 * 1024,
      isGuest: false,
      termsAcceptedAt: new Date().toISOString(),
      termsVersion: 'v1.0',
      privacyVersion: 'v1.0',
    };
    setUser(newUser);
    return true;
  };

  const loginWithOAuth = async (provider: 'google' | 'microsoft'): Promise<boolean> => {
    const name = provider === 'google' ? 'Google User' : 'Microsoft User';
    const email = provider === 'google' ? 'user@gmail.com' : 'user@outlook.com';
    const newUser: User = {
      id: `usr_oauth_${Date.now()}`,
      name,
      displayName: name,
      email,
      provider,
      avatarUrl: provider === 'google' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' : undefined,
      createdAt: new Date().toISOString(),
      storageLimitBytes: 1024 * 1024 * 1024, // 1 GB for OAuth accounts
      isGuest: false,
      termsAcceptedAt: new Date().toISOString(),
      termsVersion: 'v1.0',
      privacyVersion: 'v1.0',
    };
    setUser(newUser);
    return true;
  };

  const signup = async (
    name: string,
    email: string,
    _pass: string,
    consent?: { termsVersion: string; privacyVersion: string }
  ): Promise<boolean> => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      displayName: name,
      email,
      provider: 'email',
      createdAt: new Date().toISOString(),
      storageLimitBytes: 500 * 1024 * 1024,
      isGuest: false,
      termsAcceptedAt: new Date().toISOString(),
      termsVersion: consent?.termsVersion || 'v1.0',
      privacyVersion: consent?.privacyVersion || 'v1.0',
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
    setUser({ ...user, name, displayName: name, email });
  };

  const deleteAccount = () => {
    setUser(null);
    localStorage.removeItem('pdf_studio_active_user');
    localStorage.removeItem('pdf_studio_documents');
    localStorage.removeItem('pdf_studio_folders');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest: !!user?.isGuest,
        login,
        loginWithOAuth,
        signup,
        logout,
        continueAsGuest,
        updateProfile,
        deleteAccount,
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
