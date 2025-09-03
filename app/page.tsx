    'use client';

    import { useAccount } from 'wagmi';
    import { useRouter } from 'next/navigation';
    import { useEffect } from 'react';
    import { supabase } from '@/lib/supabase';
    import { ConnectWallet } from '@coinbase/onchainkit/wallet';
    import { Typography } from './components/Typography';
    import { Card } from './components/Card';
    import { Button } from './components/Button';

    export default function Home() {
      const { address, isConnected } = useAccount();
      const router = useRouter();

      useEffect(() => {
        if (isConnected && address) {
          checkProfile(address);
        }
      }, [isConnected, address]);

      const checkProfile = async (addr: string) => {
        const { data, error } = await supabase
          .from('users')
          .select('userId, creator_profiles(vanityUrl)')
          .eq('baseWalletAddress', addr)
          .single();

        if (error || !data?.creator_profiles) {
          router.push('/onboard');
        } else {
          router.push('/dashboard');
        }
      };

      return (
        <main className="flex min-h-screen flex-col items-center justify-center px-4 py-6 bg-bg">
          <Typography variant="display" className="text-center mb-lg">TipBase</Typography>
          <Typography variant="body" className="text-center mb-xl">
            Effortlessly tip creators on Base with personalized messages.
          </Typography>
          {!isConnected ? (
            <ConnectWallet />
          ) : (
            <Card className="w-full max-w-md">
              <Typography variant="heading1" className="mb-md">Wallet Connected</Typography>
              <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
            </Card>
          )}
        </main>
      );
    }
  