import React from 'react';

export interface AvatarProps {
  src?: string;
  fallback: string;
  className?: string;
}

export function Avatar({ src, fallback, className = '' }: AvatarProps) {
  return (
    <div className={`relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border dark:border-border-dk bg-gray-100 dark:bg-slate-800 items-center justify-center ${className}`}>
      {src ? (
        <img src={src} alt="avatar" className="aspect-square h-full w-full object-cover" />
      ) : (
        <span className="font-heading font-bold text-xs text-[var(--color-primary)] dark:text-[#F87171] uppercase">
          {fallback}
        </span>
      )}
    </div>
  );
}
