import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 shadow-sm transition-all hover:translate-y-[-1px] hover:shadow-card ${className}`}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';
