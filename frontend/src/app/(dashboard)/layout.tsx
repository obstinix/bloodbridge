'use client';

import React from 'react';
import TopNav from '@/components/TopNav/TopNav';
import DashboardSidebar from '@/components/DashboardSidebar/DashboardSidebar';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
