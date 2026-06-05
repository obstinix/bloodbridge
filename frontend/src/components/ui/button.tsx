import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-[6px] transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
    
    const variants = {
      primary: 'bg-[#A4161A] text-white hover:bg-[#660708] border border-transparent',
      secondary: 'bg-gray-100 dark:bg-slate-800 text-[var(--color-text)] dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700 border border-transparent',
      outline: 'border border-border dark:border-border-dk bg-transparent text-[var(--color-text)] dark:text-white hover:bg-black/5 dark:hover:bg-white/5',
      ghost: 'bg-transparent text-[var(--color-text)] dark:text-white hover:bg-black/5 dark:hover:bg-white/5',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
