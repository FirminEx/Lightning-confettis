import { useCallback } from 'react';
import { Session } from '../types';

export const useAuth = () => {
  const getSession = useCallback(async (): Promise<Session> => {
    const response = await fetch('/api/auth/session');
    return response.json();
  }, []);

  const checkPaymentStatus = useCallback(async (): Promise<boolean> => {
    const response = await fetch('/api/payments/status');
    const data = await response.json();
    return data.paid;
  }, []);

  return { getSession, checkPaymentStatus };
};
