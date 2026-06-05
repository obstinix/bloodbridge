'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Droplet } from 'lucide-react';
import ThemeToggle from '@/components/shared/ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-surface/95 dark:bg-[#1E293B]/95 border-border dark:border-border-dk backdrop-blur-sm py-3'
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Droplet className="w-6 h-6 text-[#A4161A] fill-[#A4161A] transition-transform duration-300 group-hover:scale-110" />
            <Droplet className="w-6 h-6 text-[#A4161A] fill-[#A4161A] absolute inset-0 animate-ping opacity-25" />
          </div>
          <span className="font-heading font-semibold text-xl tracking-tight text-[var(--color-text)] dark:text-white">
            Blood<span className="text-[#A4161A] dark:text-[#DC2626]">Bridge</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#A4161A] dark:hover:text-red-400 transition-colors">
            How It Works
          </Link>
          <Link href="/#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#A4161A] dark:hover:text-red-400 transition-colors">
            Features
          </Link>
          <Link href="/#testimonials" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#A4161A] dark:hover:text-red-400 transition-colors">
            For Hospitals
          </Link>
          <Link href="/emergency" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#A4161A] dark:hover:text-red-400 transition-colors">
            Emergency
          </Link>
        </div>

        {/* CTA & ThemeToggle */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/emergency"
            className="px-4 py-2 bg-[#A4161A] text-white rounded-[6px] text-sm font-semibold hover:bg-[#660708] transition-colors"
          >
            Emergency Request
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 border border-border dark:border-border-dk text-[var(--color-text)] dark:text-white rounded-[6px] text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[var(--color-text)] dark:text-white focus:outline-none"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-surface dark:bg-[#1E293B] border-b border-border dark:border-border-dk shadow-md py-4 px-6 space-y-4 animate-fade-in">
          <Link
            href="/#how-it-works"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#A4161A]"
          >
            How It Works
          </Link>
          <Link
            href="/#features"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#A4161A]"
          >
            Features
          </Link>
          <Link
            href="/#testimonials"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#A4161A]"
          >
            For Hospitals
          </Link>
          <Link
            href="/emergency"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-medium text-[#A4161A]"
          >
            Emergency Request
          </Link>
          <div className="pt-2 border-t border-border dark:border-border-dk flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-4 py-2 border border-border dark:border-border-dk rounded-[6px] text-sm font-semibold"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-4 py-2 bg-[#A4161A] text-white rounded-[6px] text-sm font-semibold"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
