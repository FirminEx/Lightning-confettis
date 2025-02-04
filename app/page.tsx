'use client';

import Payment from '@/src/components/payment/payment';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { useAuth } from '@/src/lib/contexts/auth-context';
import { useConfetti } from '@/src/lib/hooks/use-confetti';
import { Crown, LogOut } from 'lucide-react';

export default function Home() {
  const { logout, userEmail, isPremiumUser } = useAuth();
  useConfetti(isPremiumUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Our App</h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg text-gray-600">
            Logged in as: <span className="font-semibold">{userEmail}</span>
          </p>
          <Badge variant={isPremiumUser ? 'default' : 'secondary'} className="flex items-center gap-1">
            <Crown className="h-3 w-3" />
            {isPremiumUser ? 'Premium User' : 'Free User'}
          </Badge>
          {!isPremiumUser && <Payment />}
        </div>
        <Button onClick={logout} variant="outline" className="inline-flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
