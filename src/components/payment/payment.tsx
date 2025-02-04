'use client';

import { Invoice } from '@/app/api/payment/lightningServices';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { requestProvider } from 'webln';
import { Button } from '../ui/button';

export default function Payment() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    getInvoice();
  }, []);

  const getInvoice = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/payment');
      if (!response.ok) {
        throw new Error('Failed to get invoice');
      }
      const data = await response.json();
      setInvoice(data);
    } catch (err) {
      setError('Failed to get invoice');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const managePayment = async () => {
    try {
      if (!invoice) return;
      setIsLoading(true);

      // Get WebLN provider and send payment
      const webln = await requestProvider();
      await webln.sendPayment(invoice.request);

      // Verify payment with backend
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentRequest: invoice.request }),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const { success } = await response.json();
      if (success) {
        router.push('/dashboard');
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (err) {
      setError('Payment failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Button onClick={managePayment} disabled={isLoading || !invoice}>
      {isLoading ? 'Processing...' : 'Upgrade'}
    </Button>
  );
}
