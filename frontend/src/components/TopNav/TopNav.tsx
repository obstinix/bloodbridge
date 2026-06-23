'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '../Button/Button';
import LiveBadge from '../LiveBadge/LiveBadge';
import styles from './TopNav.module.css';

export default function TopNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitials, setUserInitials] = useState('JD');
  const [userRole, setUserRole] = useState<'donor' | 'hospital' | 'admin'>('donor');

  useEffect(() => {
    // Check local storage for auth details
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      try {
        const parsed = JSON.parse(user);
        const name = parsed.name || 'John Doe';
        const initials = name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        setUserInitials(initials);
        setUserRole(parsed.role || 'donor');
      } catch (e) {
        setUserInitials('JD');
      }
    }
  }, [pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </span>
          <span className={styles.logoText}>
            <span className={styles.logoTextItalic}>Blood</span>Bridge
          </span>
        </Link>

        {/* Center menu (Logged In only) */}
        {isLoggedIn ? (
          <div className={styles.centerMenu}>
            <Link
              href="/dashboard"
              className={`${styles.navLink} ${
                isActive('/dashboard') ? styles.activeLink : ''
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/inventory"
              className={`${styles.navLink} ${
                isActive('/inventory') ? styles.activeLink : ''
              }`}
            >
              Inventory
            </Link>
            <Link
              href="/emergency"
              className={`${styles.navLink} ${
                isActive('/emergency') ? styles.activeLink : ''
              }`}
            >
              Requests
            </Link>
            <Link
              href="/map"
              className={`${styles.navLink} ${
                isActive('/map') ? styles.activeLink : ''
              }`}
            >
              Live Map
            </Link>
            <Link
              href="/analytics"
              className={`${styles.navLink} ${
                isActive('/analytics') ? styles.activeLink : ''
              }`}
            >
              Analytics
            </Link>
            <Link
              href="/compatibility"
              className={`${styles.navLink} ${
                isActive('/compatibility') ? styles.activeLink : ''
              }`}
            >
              Compatibility
            </Link>
          </div>
        ) : (
          <div className={styles.centerMenu}>
            <Link
              href="/leaderboard"
              className={`${styles.navLink} ${
                isActive('/leaderboard') ? styles.activeLink : ''
              }`}
            >
              Leaderboard
            </Link>
            <Link
              href="/rare-blood"
              className={`${styles.navLink} ${
                isActive('/rare-blood') ? styles.activeLink : ''
              }`}
            >
              Rare Blood
            </Link>
          </div>
        )}

        {/* Right Actions */}
        <div className={styles.rightActions}>
          <LiveBadge connected={true} className="hidden md:flex" />

          {isLoggedIn ? (
            <>
              <Link href={userRole === 'hospital' ? '/dashboard/hospital/submit-request' : '/emergency'}>
                <Button variant="primary" size="sm">
                  Emergency Request
                </Button>
              </Link>
              <Link href="/dashboard/settings" className={styles.avatar}>
                {userInitials}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className={`${styles.navLink} hidden md:inline`}>
                Sign In
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}

          {/* Hamburger toggle */}
          <button
            className={`${styles.hamburger} ${
              isOpen ? styles.hamburgerOpen : ''
            }`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`${styles.mobileDrawer} ${
          isOpen ? styles.drawerOpen : ''
        }`}
      >
        <Link href="/" onClick={toggleMenu} className={styles.mobileDrawerLink}>
          Home
        </Link>
        {isLoggedIn ? (
          <>
            <Link
              href="/dashboard"
              onClick={toggleMenu}
              className={styles.mobileDrawerLink}
            >
              Dashboard
            </Link>
            <Link
              href="/inventory"
              onClick={toggleMenu}
              className={styles.mobileDrawerLink}
            >
              Inventory
            </Link>
            <Link
              href="/emergency"
              onClick={toggleMenu}
              className={styles.mobileDrawerLink}
            >
              Requests
            </Link>
            <Link
              href="/map"
              onClick={toggleMenu}
              className={styles.mobileDrawerLink}
            >
              Live Map
            </Link>
            <Link
              href="/analytics"
              onClick={toggleMenu}
              className={styles.mobileDrawerLink}
            >
              Analytics
            </Link>
            <Link
              href="/compatibility"
              onClick={toggleMenu}
              className={styles.mobileDrawerLink}
            >
              Compatibility
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/leaderboard"
              onClick={toggleMenu}
              className={styles.mobileDrawerLink}
            >
              Leaderboard
            </Link>
            <Link
              href="/rare-blood"
              onClick={toggleMenu}
              className={styles.mobileDrawerLink}
            >
              Rare Blood
            </Link>
            <Link
              href="/login"
              onClick={toggleMenu}
              className={styles.mobileDrawerLink}
            >
              Sign In
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
