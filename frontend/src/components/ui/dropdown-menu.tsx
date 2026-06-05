import React, { useState, useRef, useEffect } from 'react';

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export function DropdownMenu({ trigger, children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card shadow-lg z-50 py-1 divide-y divide-border/50 dark:divide-border-dk/50 animate-scale-in">
          {children}
        </div>
      )}
    </div>
  );
}

export interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function DropdownMenuItem({ children, className = '', ...props }: DropdownMenuItemProps) {
  return (
    <button
      className={`w-full text-left px-4 py-2 text-xs font-medium text-[var(--color-text)] dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
