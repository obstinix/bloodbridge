'use client';

import React from 'react';
import Link from 'next/link';
import { Droplet } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface dark:bg-[#1E293B] border-t border-border dark:border-border-dk py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-[#A4161A] fill-[#A4161A]" />
            <span className="font-heading font-semibold text-lg text-[var(--color-text)] dark:text-white">
              Blood<span className="text-[#A4161A] dark:text-[#DC2626]">Bridge</span>
            </span>
          </Link>
          <p className="font-body text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
            A premium real-time emergency response network connecting blood banks, donor networks, and hospitals instantly.
          </p>
        </div>

        {/* Column 1: Platform */}
        <div>
          <h4 className="font-heading font-bold text-xs text-[var(--color-text)] dark:text-white uppercase tracking-wider mb-4">
            Platform
          </h4>
          <ul className="space-y-2 font-body text-xs text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/#how-it-works" className="hover:text-[#A4161A] dark:hover:text-red-400 hover:underline">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/#features" className="hover:text-[#A4161A] dark:hover:text-red-400 hover:underline">
                Features
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-[#A4161A] dark:hover:text-red-400 hover:underline">
                Operations Center
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Hospitals */}
        <div>
          <h4 className="font-heading font-bold text-xs text-[var(--color-text)] dark:text-white uppercase tracking-wider mb-4">
            For Providers
          </h4>
          <ul className="space-y-2 font-body text-xs text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/register?role=hospital" className="hover:text-[#A4161A] dark:hover:text-red-400 hover:underline">
                Hospital Sign-Up
              </Link>
            </li>
            <li>
              <Link href="/emergency" className="hover:text-[#A4161A] dark:hover:text-red-400 hover:underline">
                Emergency SOS Submission
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact/Hotline */}
        <div>
          <h4 className="font-heading font-bold text-xs text-[var(--color-text)] dark:text-white uppercase tracking-wider mb-4">
            Emergency Hotline
          </h4>
          <p className="font-mono text-base font-bold text-[#A4161A] dark:text-[#F87171] mb-2">
            1800-419-3224
          </p>
          <p className="font-body text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
            Available 24/7 for critical shortages, rare blood routing coordinates, and institutional support.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 border-t border-border dark:border-border-dk mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 dark:text-gray-400">
        <div>&copy; {new Date().getFullYear()} BloodBridge. All rights reserved.</div>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
