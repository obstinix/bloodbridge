'use client';

import { MOCK_EMERGENCY_REQUESTS } from '@/lib/mockData';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  HeartHandshake,
  History,
  Contact2,
  Settings,
  BarChart3,
  Database,
  MessageSquarePlus,
  Activity,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import styles from './DashboardSidebar.module.css';

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
}

export default function DashboardSidebar({
  collapsed,
  onToggle,
  className = '',
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<'donor' | 'hospital' | 'admin'>('donor');
  const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com' });
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: parsed.name || 'John Doe',
          email: parsed.email || 'john@example.com',
        });
        setUserRole(parsed.role || 'donor');
      } catch (e) {
        // Fallback
      }
    }
    setHasMounted(true);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  // Define menu items by role
  const getMenuItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/dashboard/admin' },
          { icon: <Users size={20} />, label: 'Users', path: '/dashboard/admin' },
          { icon: <Database size={20} />, label: 'Inventory', path: '/inventory' },
          { icon: <History size={20} />, label: 'Requests', path: '/emergency' },
          { icon: <BarChart3 size={20} />, label: 'Demand Forecast', path: '/analytics' },
          { icon: <Activity size={20} />, label: 'Predictive Alerts', path: '/dashboard/admin/alerts' },
          { icon: <MessageSquarePlus size={20} />, label: 'Embed Widget', path: '/widget' },
          { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/settings' },
        ];
      case 'hospital':
        return [
          { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard/hospital' },
          { icon: <Database size={20} />, label: 'Blood Inventory', path: '/inventory' },
          { icon: <MessageSquarePlus size={20} />, label: 'Submit Request', path: '/dashboard/hospital/submit-request' },
          { icon: <History size={20} />, label: 'Request History', path: '/emergency' },
          { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/analytics' },
          { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/settings' },
        ];
      case 'donor':
      default:
        return [
          { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard/donor' },
          { icon: <HeartHandshake size={20} />, label: 'Donate Now', path: '/dashboard/donor/donate' },
          { icon: <History size={20} />, label: 'My History', path: '/dashboard/donor/history' },
          { icon: <Contact2 size={20} />, label: 'My Donor Card', path: '/donor-card' },
          { icon: <Activity size={20} />, label: 'Impact Tracker', path: '/dashboard/donor/impact' },
          { icon: <BarChart3 size={20} />, label: 'Schedule', path: '/dashboard/donor/schedule' },
          { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/settings' },
        ];
    }
  };

  /* Derive 6 activity events from mock data (3 templates × first 3 items) */
  const activityEvents = MOCK_EMERGENCY_REQUESTS.slice(0, 3).flatMap((r) => [
    `● ${r.bloodType} request matched — ${r.postedAt}`,
    `● ${r.bloodType} inventory updated — ${r.postedAt}`,
    `● New donor registered — ${r.postedAt}`,
  ]);
  /* Duplicate for seamless infinite scroll */
  const feedItems = [...activityEvents, ...activityEvents];

  const menuItems = getMenuItems();
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside
      className={`${styles.sidebar} ${
        collapsed ? styles.collapsed : styles.expanded
      } ${className}`}
    >
      <div className={styles.topSection}>
        {/* User Card */}
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{hasMounted ? initials : '—'}</div>
          {!collapsed && (
            <div className={styles.userMeta}>
              <span className={styles.userName}>{hasMounted ? user.name : ''}</span>
              <span className={styles.userRole}>{hasMounted ? userRole : ''}</span>
            </div>
          )}
        </div>

        {/* Navigation items */}
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className={`${styles.navItem} ${
                isActive(item.path) ? styles.activeItem : ''
              }`}
            >
              <span className={styles.icon}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className={styles.bottomSection}>
        {/* Live Activity Feed */}
        {!collapsed && (
          <div className={styles.activityFeed}>
            <div className={styles.activityTrack}>
              {feedItems.map((evt, i) => (
                <span key={i} className={styles.activityItem}>
                  {evt}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`${styles.navItem} ${styles.logout}`}
        >
          <span className={styles.icon}>
            <LogOut size={20} />
          </span>
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Toggle Collapse */}
        <button
          onClick={onToggle}
          className={styles.toggleBtn}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
}
