    'use client';

    import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

    type InputProps = {
      variant?: 'default' | 'textarea';
      className?: string;
    } & (InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>);

    export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
      ({ variant = 'default', className = '', ...props }, ref) => {
        const baseClasses = 'px-md py-sm rounded-md border border-text-secondary focus:border-primary focus:outline-none transition duration-base ease-in-out bg-bg text-text-primary placeholder-text-secondary';

        if (variant === 'textarea') {
          return (
            <textarea
              className={`${baseClasses} min-h-[100px] ${className}`}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          );
        }

        return (
          <input
            className={`${baseClasses} ${className}`}
            ref={ref as React.Ref<HTMLInputElement>}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        );
      }
    );

    Input.displayName = 'Input';
  