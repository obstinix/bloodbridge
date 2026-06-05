'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('bb_token');
    const role = localStorage.getItem('bb_role');
    if (!token || !role) {
      window.location.href = '/login';
    } else {
      setAuthorized(true);
    }
  }, []);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] dark:bg-[#0F172A] flex-col gap-3 font-body">
        <div className="w-8 h-8 border-2 border-t-[#A4161A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-gray-500">Authenticating operations dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-background)] dark:bg-[#0F172A]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
