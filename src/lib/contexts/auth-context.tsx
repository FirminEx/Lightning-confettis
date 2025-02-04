"use client";

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, isPremiumUser: boolean) => void;
  logout: () => void;
  userEmail: string | null;
  isPremiumUser: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userEmail: null,
  isPremiumUser: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check cookies for auth status on initial load
    const auth = Cookies.get('isAuthenticated');
    const email = Cookies.get('userEmail');
    const premium = Cookies.get('isPremiumUser') === 'true';
    setIsAuthenticated(auth === 'true');
    setUserEmail(email || null);
    setIsPremiumUser(premium);
  }, []);

  const login = (email: string, isPremium: boolean) => {
    Cookies.set('isAuthenticated', 'true', { sameSite: 'strict' });
    Cookies.set('userEmail', email, { sameSite: 'strict' });
    Cookies.set('isPremiumUser', String(isPremium), { sameSite: 'strict' });
    setIsAuthenticated(true);
    setUserEmail(email);
    setIsPremiumUser(isPremium);
    router.push('/');
  };

  const logout = () => {
    Cookies.remove('isAuthenticated');
    Cookies.remove('userEmail');
    Cookies.remove('isPremiumUser');
    setIsAuthenticated(false);
    setUserEmail(null);
    setIsPremiumUser(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, isPremiumUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 