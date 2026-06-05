import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`px-3 py-1.5 border border-border dark:border-border-dk bg-white dark:bg-[#1E293B] rounded-[6px] outline-none text-xs text-gray-500 dark:text-gray-300 font-medium transition-all focus:border-[var(--color-primary)] dark:focus:border-[var(--color-accent)] ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';
