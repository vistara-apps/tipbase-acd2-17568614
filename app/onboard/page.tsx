    'use client';

    import { useAccount } from 'wagmi';
    import { useRouter } from 'next/navigation';
    import { useState } from 'react';
    import { supabase } from '@/lib/supabase';
    import { Button } from '../components/Button';
    import { Input } from '../components/Input';
    import { Typography } from '../components/Typography';
    import { Card } from '../components/Card';
    import { Avatar } from '../components/Avatar';

    export default function Onboard() {
      const { address } = useAccount();
      const router = useRouter();
      const [displayName, setDisplayName] = useState('');
      const [bio, setBio] = useState('');
      const [loading, setLoading] = useState(false);

      const handleSubmit = async () => {
        if (!address || !displayName.trim()) return;
        setLoading(true);
        try {
          // Create User
          const { data: userData, error: userError } = await supabase
            .from('users')
            .insert({
              baseWalletAddress: address,
            })
            .select('userId')
            .single();

          if (userError) throw userError;

          if (userData) {
            // Create CreatorProfile
            const { error: profileError } = await supabase
              .from('creator_profiles')
              .insert({
                userId: userData.userId,
                displayName: displayName.trim(),
                bio: bio.trim() || null,
                vanityUrl: displayName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
              });

            if (profileError) throw profileError;
          }
          router.push('/dashboard');
        } catch (error) {
          console.error('Onboarding error:', error);
          alert('Error setting up profile. Please try again.');
        }
        setLoading(false);
      };

      return (
        <main className="flex min-h-screen flex-col items-center px-4 py-6 bg-bg">
          <Typography variant="heading1" className="mb-lg">Set Up Your Creator Profile</Typography>
          <Card className="w-full max-w-md">
            {address && (
              <div className="flex flex-col items-center mb-lg">
                <Avatar address={address} className="mb-md" />
                <Typography variant="caption">{address}</Typography>
              </div>
            )}
            <Input
              placeholder="Display Name *"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mb-md"
            />
            <Input
              variant="textarea"
              placeholder="Bio (optional)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mb-lg"
            />
            <Button onClick={handleSubmit} disabled={loading || !displayName.trim()} className="w-full">
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </Card>
        </main>
      );
    }
  