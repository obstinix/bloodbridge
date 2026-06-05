import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'critical';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'primary', ...props }, ref) => {
    const baseStyle = 'inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold font-mono tracking-wider uppercase border';

    const variants = {
      primary: 'bg-red-50 text-[#A4161A] border-red-200 dark:bg-red-950/20 dark:text-[#F87171] dark:border-red-900/30',
      secondary: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700/50',
      success: 'bg-[#D1FAE5] text-[#2D6A4F] border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
      warning: 'bg-[#FEF3C7] text-[#F77F00] border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
      critical: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50',
    };

    return (
      <span
        ref={ref}
        className={`${baseStyle} ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
