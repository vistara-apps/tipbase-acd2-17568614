    'use client';

    import { Avatar as OnchainAvatar } from '@coinbase/onchainkit/identity';

    export function Avatar({
      address,
      variant = 'default',
      className = '',
    }: {
      address: `0x${string}`;
      variant?: 'default' | 'small';
      className?: string;
    }) {
      const size = variant === 'small' ? 24 : 48;
      return (
        <OnchainAvatar
          address={address}
          className={`rounded-full ${className}`}
          style={{ width: size, height: size }}
        />
      );
    }
  