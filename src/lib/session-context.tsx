import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from './types';
import { useAuth } from './hooks/use-auth';

interface SessionContextType {
  session: Session | null;
  userId: string;
  userPremium: boolean;
  isReady: boolean;
  checkPayment: () => Promise<boolean>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [userPremium, setUserPremium] = useState(false);
  const [isReady, setReady] = useState(false);

  const { getSession, checkPaymentStatus } = useAuth();

  const checkPayment = async () => {
    const paid = await checkPaymentStatus();
    setUserPremium(paid);
    return paid;
  };

  const updateSession = async () => {
    const newSession = await getSession();
    setSession(newSession);
    setUserId(newSession?.user?.id || '');
  };

  useEffect(() => {
    const initialize = async () => {
      await updateSession();
      await checkPayment();
      setReady(true);
    };

    initialize();

    // Set up event listener for auth changes
    window.addEventListener('auth-change', updateSession);
    return () => window.removeEventListener('auth-change', updateSession);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        session,
        userId,
        userPremium,
        isReady,
        checkPayment,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
