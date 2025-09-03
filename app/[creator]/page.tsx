    'use client';

    import { useAccount } from 'wagmi';
    import { useParams } from 'next/navigation';
    import { useEffect, useState } from 'react';
    import { Transaction, TransactionButton, TransactionStatus, TransactionStatusLabel, TransactionStatusAction } from '@coinbase/onchainkit/transaction';
    import { base } from 'viem/chains';
    import { encodeFunctionData, parseUnits } from 'viem';
    import { supabase } from '@/lib/supabase';
    import { Button } from '../components/Button';
    import { Input } from '../components/Input';
    import { Card } from '../components/Card';
    import { Typography } from '../components/Typography';
    import { Avatar } from '../components/Avatar';

    // USDC contract on Base
    const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
    const USDC_DECIMALS = 6;

    export default function CreatorProfile() {
      const params = useParams();
      const vanityUrl = params.creator as string;
      const { address: senderAddress } = useAccount();
      const [profile, setProfile] = useState<{ displayName: string; bio: string; creatorAddress: string } | null>(null);
      const [amount, setAmount] = useState('');
      const [message, setMessage] = useState('');
      const [customAmount, setCustomAmount] = useState(false);
      const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        fetchProfile(vanityUrl);
      }, [vanityUrl]);

      const fetchProfile = async (url: string) => {
        const { data: profileData } = await supabase.from('creator_profiles').select('*, users(baseWalletAddress)').eq('vanityUrl', url).single();
        if (profileData) {
          setProfile({
            displayName: profileData.displayName,
            bio: profileData.bio,
            creatorAddress: profileData.users.baseWalletAddress,
          });
        }
        setLoading(false);
      };

      const handleTip = async (tipAmount: number) => {
        if (!profile || !senderAddress) return;

        // Store tip in Supabase after tx
        if (txHash) {
          await supabase.from('tips').insert({
            senderAddress,
            receiverAddress: profile.creatorAddress,
            amount: tipAmount,
            currency: 'USDC',
            message,
            timestamp: new Date().toISOString(),
            transactionHash: txHash,
          });
          setMessage('');
          setAmount('');
          setCustomAmount(false);
          setTxHash(undefined);
        }
      };

      const calls = (tipAmount: number) => [{
        to: USDC_ADDRESS as `0x${string}`,
        data: encodeFunctionData({
          abi: [{ inputs: [{ name: 'to', type: 'address' }, { name: 'value', type: 'uint256' }], name: 'transfer', outputs: [{ name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' }],
          functionName: 'transfer',
          args: [profile?.creatorAddress as `0x${string}`, parseUnits(tipAmount.toString(), USDC_DECIMALS)],
        }),
      }];

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
              <Typography variant="heading1" className="mb-md">Send a Tip</Typography>
              <Card className="mb-md">
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
                <Button variant="secondary" onClick={() => setCustomAmount(!customAmount)} className="mb-md w-full">
                  Custom Amount
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
                <Input
                  variant="textarea"
                  placeholder="Personalized message (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-md w-full"
                />
              </Card>
            </>
          ) : (
            <Typography variant="body">Creator not found.</Typography>
          )}
        </main>
      );
    }
  