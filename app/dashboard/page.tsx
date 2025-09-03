    'use client';

    import { useAccount, useDisconnect } from 'wagmi';
    import { useEffect, useState } from 'react';
    import { supabase } from '@/lib/supabase';
    import { Card } from '../components/Card';
    import { Typography } from '../components/Typography';
    import { Button } from '../components/Button';
    import { Avatar } from '../components/Avatar';

    type Tip = {
      tipId: string;
      amount: number;
      currency: string;
      message: string;
      timestamp: string;
      senderAddress: string;
    };

    export default function Dashboard() {
      const { address } = useAccount();
      const { disconnect } = useDisconnect();
      const [tips, setTips] = useState<Tip[]>([]);
      const [total, setTotal] = useState(0);
      const [profile, setProfile] = useState<{ displayName: string; bio: string; vanityUrl: string } | null>(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        if (address) {
          fetchProfileAndTips(address);
        }
      }, [address]);

      const fetchProfileAndTips = async (addr: string) => {
        setLoading(true);
        try {
          // Fetch profile
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('userId')
            .eq('baseWalletAddress', addr)
            .single();

          if (userError) throw userError;

          const { data: profileData, error: profileError } = await supabase
            .from('creator_profiles')
            .select('*')
            .eq('userId', userData.userId)
            .single();

          if (profileError) throw profileError;
          setProfile(profileData);

          // Fetch tips
          const { data: tipsData, error: tipsError } = await supabase
            .from('tips')
            .select('*')
            .eq('receiverAddress', addr)
            .order('timestamp', { ascending: false });

          if (tipsError) throw tipsError;
          setTips(tipsData ?? []);
          const totalAmount = (tipsData ?? []).reduce((sum, tip) => sum + tip.amount, 0);
          setTotal(totalAmount);
        } catch (error) {
          console.error('Dashboard error:', error);
        }
        setLoading(false);
      };

      if (loading) {
        return (
          <main className="flex min-h-screen flex-col px-4 py-6 bg-bg">
            <Typography variant="body">Loading...</Typography>
          </main>
        );
      }

      return (
        <main className="flex min-h-screen flex-col px-4 py-6 bg-bg">
          <div className="flex justify-between items-center mb-lg">
            <Typography variant="heading1">Your Tipping Dashboard</Typography>
            <Button variant="icon" onClick={() => disconnect()}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </Button>
          </div>
          {profile && (
            <Card className="mb-lg">
              <div className="flex items-center mb-md">
                {address && <Avatar address={address} />}
                <div className="ml-md">
                  <Typography variant="heading1">{profile.displayName}</Typography>
                  <Typography variant="body">{profile.bio}</Typography>
                  <Typography variant="caption">/{profile.vanityUrl}</Typography>
                </div>
              </div>
              <Typography variant="body">Total Tips Received: {total} USDC</Typography>
            </Card>
          )}
          <Typography variant="heading1" className="mb-sm">Recent Tips</Typography>
          {tips.length === 0 ? (
            <Typography variant="body">No tips yet. Share your profile to receive tips!</Typography>
          ) : (
            tips.map((tip) => (
              <Card key={tip.tipId} className="mb-sm">
                <div className="flex justify-between">
                  <div>
                    <Typography variant="body">From: {tip.senderAddress.slice(0, 6)}...{tip.senderAddress.slice(-4)}</Typography>
                    <Typography variant="caption">{new Date(tip.timestamp).toLocaleString()}</Typography>
                    {tip.message && (
                      <Typography variant="body" className="mt-xs italic">"{tip.message}"</Typography>
                    )}
                  </div>
                  <Typography variant="body">{tip.amount} {tip.currency}</Typography>
                </div>
              </Card>
            ))
          )}
        </main>
      );
    }
  