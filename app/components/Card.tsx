    import { ReactNode } from 'react';

    export function Card({
      children,
      className = '',
    }: {
      children: ReactNode;
      className?: string;
    }) {
      return (
        <div className={`p-md bg-surface rounded-lg shadow-card ${className}`}>
          {children}
        </div>
      );
    }
  