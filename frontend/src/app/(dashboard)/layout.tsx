'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopNav from '@/components/TopNav/TopNav';
import DashboardSidebar from '@/components/DashboardSidebar/DashboardSidebar';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.replace('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--canvas)',
        color: 'var(--ink-muted)',
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--text-body)'
      }}>
        <span>Authenticating dashboard session...</span>
      </div>
    );
  }

  return (
    <div className={styles.dashboardRoot}>
      <TopNav />
      <div className={styles.dashboardBody}>
        <DashboardSidebar />
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}
