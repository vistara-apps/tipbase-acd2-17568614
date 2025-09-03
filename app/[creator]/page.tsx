'use client';

import { useAccount } from 'wagmi';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel, TransactionStatusAction } from '@coinbase/onchainkit/transaction';
import { base } from 'viem/chains';
import { supabase } from '@/lib/supabase';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Typography } from '../components/Typography';
import { Avatar } from '../components/Avatar';
import { createUSDCTransferCall } from '@/lib/transactions';

export default function CreatorProfile() {
  const params = useParams();
  const router = useRouter();
  const vanityUrl = params.creator as string;
  const { address: senderAddress, isConnected } = useAccount();
  const [profile, setProfile] = useState<{ displayName: string; bio: string; creatorAddress: string } | null>(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [customAmount, setCustomAmount] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [loading, setLoading] = useState(true);
  const [tipSent, setTipSent] = useState(false);

  useEffect(() => {
    fetchProfile(vanityUrl);
  }, [vanityUrl]);

  const fetchProfile = async (url: string) => {
    try {
      const { data: profileData } = await supabase
        .from('creator_profiles')
        .select('*, users(baseWalletAddress)')
        .eq('vanityUrl', url)
        .single();
        
      if (profileData) {
        setProfile({
          displayName: profileData.displayName,
          bio: profileData.bio,
          creatorAddress: profileData.users.baseWalletAddress,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    setLoading(false);
  };

  const handleTip = async (tipAmount: number) => {
    if (!profile || !senderAddress) return;

    // Store tip in Supabase after tx
    if (txHash) {
      try {
        await fetch('/api/tips', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderAddress,
            receiverAddress: profile.creatorAddress,
            amount: tipAmount,
            currency: 'USDC',
            message,
            transactionHash: txHash,
          }),
        });
        
        setMessage('');
        setAmount('');
        setCustomAmount(false);
        setTxHash(undefined);
        setTipSent(true);
        
        // Reset tip sent message after 3 seconds
        setTimeout(() => setTipSent(false), 3000);
      } catch (error) {
        console.error('Error recording tip:', error);
      }
    }
  };

  const calls = (tipAmount: number) => [
    createUSDCTransferCall(profile?.creatorAddress as `0x${string}`, tipAmount)
  ];

  const preSetAmounts = [1, 5, 10];

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col px-4 py-6 bg-bg">
        <Typography variant="body">Loading creator profile...</Typography>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col px-4 py-6 bg-bg">
      {profile ? (
        <>
          <div className="flex items-center mb-lg">
            <Avatar address={profile.creatorAddress as `0x${string}`} />
            <div className="ml-md">
              <Typography variant="heading1">{profile.displayName}</Typography>
              <Typography variant="body">{profile.bio}</Typography>
            </div>
          </div>
          
          {!isConnected ? (
            <Card className="mb-md">
              <Typography variant="body" className="mb-md">Connect your wallet to send a tip</Typography>
              <Button onClick={() => router.push('/')}>Connect Wallet</Button>
            </Card>
          ) : (
            <>
              <Typography variant="heading1" className="mb-md">Send a Tip</Typography>
              <Card className="mb-md">
                {tipSent && (
                  <div className="bg-accent bg-opacity-20 text-accent p-md rounded-md mb-md">
                    <Typography variant="body">Tip sent successfully! Thank you for your support.</Typography>
                  </div>
                )}
                
                <div className="space-y-md">
                  {preSetAmounts.map((amt, index) => (
                    <Transaction
                      key={index}
                      chainId={base.id}
                      calls={calls(amt)}
                      onSuccess={(hash) => {
                        setTxHash(hash);
                        handleTip(amt);
                      }}
                      onError={(err) => console.error('Tip error:', err)}
                    >
                      <TransactionButton className="w-full" text={`${amt} USDC`} />
                      <TransactionStatus>
                        <TransactionStatusLabel />
                        <TransactionStatusAction />
                      </TransactionStatus>
                    </Transaction>
                  ))}
                </div>
                
                <Button 
                  variant="secondary" 
                  onClick={() => setCustomAmount(!customAmount)} 
                  className="mb-md w-full mt-md"
                >
                  {customAmount ? 'Hide Custom Amount' : 'Custom Amount'}
                </Button>
                
                {customAmount && (
                  <div className="space-y-md">
                    <Input
                      type="number"
                      placeholder="Amount in USDC"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full"
                    />
                    {amount && parseFloat(amount) > 0 && (
                      <Transaction
                        chainId={base.id}
                        calls={calls(parseFloat(amount))}
                        onSuccess={(hash) => {
                          setTxHash(hash);
                          handleTip(parseFloat(amount));
                        }}
                        onError={(err) => console.error('Tip error:', err)}
                      >
                        <TransactionButton className="w-full" text={`Send ${amount} USDC`} />
                        <TransactionStatus>
                          <TransactionStatusLabel />
                          <TransactionStatusAction />
                        </TransactionStatus>
                      </Transaction>
                    )}
                  </div>
                )}
                
                <div className="mt-md">
                  <Typography variant="body" className="mb-xs">Add a personal message (optional)</Typography>
                  <Input
                    variant="textarea"
                    placeholder="Your message to the creator..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full"
                  />
                </div>
              </Card>
            </>
          )}
        </>
      ) : (
        <div className="text-center">
          <Typography variant="heading1" className="mb-md">Creator Not Found</Typography>
          <Typography variant="body" className="mb-lg">The creator profile you're looking for doesn't exist.</Typography>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      )}
    </main>
  );
}

