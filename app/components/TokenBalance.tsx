'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface TokenBalanceProps {
  className?: string;
}

export default function TokenBalance({ className = '' }: TokenBalanceProps) {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/user/subscription');
          const data = await response.json();
          setBalance(data.generations);
        } catch (error) {
          console.error('Error fetching token balance:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBalance();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (balance === null) {
    return null;
  }

  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-sm font-medium text-gray-600">
        {balance} token{balance !== 1 ? 's' : ''} available
      </span>
      {balance < 10 && (
        <span className="ml-2 text-xs text-red-500">Low balance!</span>
      )}
    </div>
  );
} 