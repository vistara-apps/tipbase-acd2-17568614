    'use client';

    import { ButtonHTMLAttributes, ReactNode } from 'react';

    export function Button({
      children,
      variant = 'primary',
      className = '',
      ...props
    }: {
      children: ReactNode;
      variant?: 'primary' | 'secondary' | 'icon';
      className?: string;
    } & ButtonHTMLAttributes<HTMLButtonElement>) {
      let baseClasses = 'px-md py-sm rounded-md font-medium transition duration-base ease-in-out';
      if (variant === 'primary') {
        baseClasses += ' bg-primary text-white hover:bg-opacity-90';
      } else if (variant === 'secondary') {
        baseClasses += ' bg-surface text-text-primary border border-primary hover:bg-primary hover:text-white';
      } else if (variant === 'icon') {
        baseClasses += ' p-xs bg-transparent hover:bg-surface';
      }

      return (
        <button className={`${baseClasses} ${className}`} {...props}>
          {children}
        </button>
      );
    }
  