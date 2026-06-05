import React from 'react';
import { X } from 'lucide-react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 animate-fade-in" 
        onClick={onClose} 
      />
      {/* Dialog container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div 
          className="bg-white dark:bg-[#1E293B] border border-border dark:border-border-dk w-full max-w-md p-6 rounded-card shadow-lift pointer-events-auto animate-scale-in"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            {title && <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white">{title}</h3>}
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Content */}
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
