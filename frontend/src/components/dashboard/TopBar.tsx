'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Search, ShieldAlert } from 'lucide-react';
import NotificationBell from '@/components/shared/NotificationBell';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { useAlertStore } from '@/stores/alertStore';
import DisasterModeToggle from '@/components/dashboard/DisasterModeToggle';

export default function TopBar() {
  const pathname = usePathname();
  const { disasterMode } = useAlertStore();

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Operations Overview';
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];
    if (lastPart) {
      return lastPart
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return 'Operations Center';
  };

  return (
    <div className="flex flex-col w-full z-20 sticky top-0 font-body">
      {/* Top Bar Contents */}
      <header className="h-16 px-6 bg-white dark:bg-[#1E293B] border-b border-border dark:border-border-dk flex items-center justify-between">
        {/* Left: Dynamic Title */}
        <h1 className="font-heading font-semibold text-base md:text-lg text-[var(--color-text)] dark:text-white">
          {getPageTitle()}
        </h1>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Search Box */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-border dark:border-border-dk bg-[#FAFAFA] dark:bg-[#263548] rounded-[6px] w-52 text-gray-400">
            <Search className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium flex-1">Search dashboard...</span>
            <kbd className="text-[9px] font-mono bg-white dark:bg-slate-700 px-1 border border-border dark:border-border-dk rounded shadow-sm">
              ⌘K
            </kbd>
          </div>

          {/* Disaster Mode Toggle */}
          <div className="border-r border-border dark:border-border-dk pr-4">
            <DisasterModeToggle />
          </div>

          <NotificationBell />
          <ThemeToggle />
        </div>
      </header>

      {/* Disaster Mode Warning Banner */}
      {disasterMode && (
        <div className="bg-amber-500 text-white px-6 py-2 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-sm">
          <ShieldAlert className="w-4 h-4 animate-bounce" />
          <span>⚠ DISASTER RESPONSE MODE ACTIVE — Priority alert coordinates enabled across all regions</span>
        </div>
      )}
    </div>
  );
}
