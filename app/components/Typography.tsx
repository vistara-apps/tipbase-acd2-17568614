    import { ReactNode } from 'react';

    export function Typography({
      children,
      variant = 'body',
      className = '',
    }: {
      children: ReactNode;
      variant?: 'display' | 'heading1' | 'body' | 'caption';
      className?: string;
    }) {
      const baseClasses = {
        display: 'text-display',
        heading1: 'text-heading1',
        body: 'text-body',
        caption: 'text-caption',
      }[variant];

      return <p className={`${baseClasses} ${className}`}>{children}</p>;
    }
  