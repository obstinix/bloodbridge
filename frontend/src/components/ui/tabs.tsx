import React from 'react';

export interface TabsProps {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
}

export function Tabs({ value, onValueChange, children }: TabsProps) {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { value, onValueChange } as any);
    }
    return child;
  });

  return <div className="space-y-4">{childrenWithProps}</div>;
}

export interface TabsListProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (val: string) => void;
}

export function TabsList({ children, value, onValueChange }: TabsListProps) {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { currentValue: value, onClick: onValueChange } as any);
    }
    return child;
  });

  return (
    <div className="flex bg-gray-100 dark:bg-slate-800 p-0.5 rounded border border-border dark:border-border-dk">
      {childrenWithProps}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  currentValue?: string;
  onClick?: (val: string) => void;
  children: React.ReactNode;
}

export function TabsTrigger({ value, currentValue, onClick, children }: TabsTriggerProps) {
  const isActive = value === currentValue;
  return (
    <button
      onClick={() => onClick?.(value)}
      className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all ${
        isActive ? 'bg-white dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white shadow-sm' : ''
      }`}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps {
  value: string;
  currentValue?: string;
  children: React.ReactNode;
}

export function TabsContent({ value, currentValue, children }: TabsContentProps) {
  if (value !== currentValue) return null;
  return <div className="animate-fade-in">{children}</div>;
}
