'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const role = parsed.role || 'donor';
        router.replace(`/dashboard/${role}`);
      } catch (e) {
        router.replace('/login');
      }
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: 'var(--ink-muted)', fontFamily: 'var(--font-ui)' }}>
      <span>Redirecting to dashboard portal...</span>
    </div>
  );
}
