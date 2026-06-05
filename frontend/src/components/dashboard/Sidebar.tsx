'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, LogOut, Droplet, User as UserIcon } from 'lucide-react';
import { NAV_ITEMS } from '@/constants/navItems';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [name, setName] = useState('Vetted Entity');
  const [role, setRole] = useState('donor');

  useEffect(() => {
    setName(localStorage.getItem('bb_name') || 'Vetted Entity');
    setRole(localStorage.getItem('bb_role') || 'donor');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('bb_token');
    localStorage.removeItem('bb_role');
    localStorage.removeItem('bb_name');
    localStorage.removeItem('bb_username');
    localStorage.removeItem('bb_donor_id');
    localStorage.removeItem('bb_blood_group');
    localStorage.removeItem('bb_contact');
    window.location.href = '/';
  };

  return (
    <aside
      className={cn(
        'bg-surface dark:bg-[#1E293B] border-r border-border dark:border-border-dk flex flex-col justify-between h-screen sticky top-0 transition-all duration-300 z-30 font-body',
        isCollapsed ? 'w-16' : 'w-60'
      )}
    >
      <div>
        {/* Top Branding Header */}
        <div className="h-16 px-4 border-b border-border dark:border-border-dk flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
            <Droplet className="w-6 h-6 text-[#A4161A] fill-[#A4161A] flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-heading font-semibold text-base tracking-tight text-[var(--color-text)] dark:text-white transition-opacity duration-300">
                Blood<span className="text-[#A4161A]">Bridge</span>
              </span>
            )}
          </Link>
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-gray-400 hover:text-[var(--color-text)] dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="text-gray-400 hover:text-[var(--color-text)] dark:hover:text-white transition-colors mx-auto"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.label}
                href={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-[6px] transition-all group relative',
                  isActive
                    ? 'bg-[#A4161A]/8 dark:bg-[#DC2626]/10 text-[#A4161A] dark:text-[#FCA5A5] border-l-[3px] border-[#A4161A] dark:border-[#DC2626] rounded-l-none'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] hover:text-[var(--color-text)] dark:hover:text-white'
                )}
              >
                <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-[#A4161A] dark:text-[#FCA5A5]' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200')} strokeWidth={2} />
                {!isCollapsed && (
                  <span className="truncate transition-opacity duration-300">{item.label}</span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile details & Logout */}
      <div className="p-3 border-t border-border dark:border-border-dk bg-[#FAFAFA] dark:bg-[#263548]/30">
        <div className={cn('flex items-center justify-between', isCollapsed ? 'flex-col gap-3' : '')}>
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0">
              <UserIcon className="w-3.5 h-3.5" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h5 className="text-[10px] font-bold text-[var(--color-text)] dark:text-white truncate leading-tight">{name}</h5>
                <span className="text-[9px] text-gray-400 capitalize">{role}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors focus:outline-none"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
