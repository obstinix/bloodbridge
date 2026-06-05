import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-3 py-2 bg-white dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-[6px] text-sm text-[var(--color-text)] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[var(--color-primary)] dark:focus:border-[var(--color-accent)] transition-all ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
