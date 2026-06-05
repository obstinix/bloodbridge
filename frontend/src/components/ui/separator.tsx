import React from 'react';

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Separator({ orientation = 'horizontal', className = '' }: SeparatorProps) {
  return (
    <div 
      className={`bg-border dark:bg-border-dk shrink-0 ${
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'w-[1px] h-full self-stretch'
      } ${className}`}
    />
  );
}
