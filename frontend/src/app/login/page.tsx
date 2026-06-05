'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Droplet, Activity, Users, ClipboardCheck, ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/shared/ThemeToggle';

export default function LoginPage() {
  const [activeRole, setActiveRole] = useState<'donor' | 'hospital' | 'admin'>('donor');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          user_type: activeRole,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Save to localStorage
        localStorage.setItem('bb_token', data.token);
        localStorage.setItem('bb_role', data.role);
        localStorage.setItem('bb_name', data.name);
        localStorage.setItem('bb_username', username);
        if (data.role === 'donor') {
          localStorage.setItem('bb_donor_id', data.donor_id?.toString() || '');
          localStorage.setItem('bb_blood_group', data.blood_group || '');
          localStorage.setItem('bb_contact', data.contact || '');
        }

        // Redirect
        window.location.href = '/dashboard';
      } else {
        setErrorMsg(data.message || 'Invalid credentials. Please verify your info.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not connect to the backend server. Verify your Flask app is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-body bg-[var(--color-background)] dark:bg-[#0F172A]">
      {/* Back button */}
      <Link href="/" className="absolute top-6 left-6 z-20 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back Home
      </Link>

      {/* Left Panel: Brand & Stats (40% width, hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[40%] bg-gradient-to-br from-[#A4161A] to-[#660708] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Dot grid background overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="login-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#fff" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-grid)" />
          </svg>
        </div>

        {/* Brand */}
        <div className="flex items-center gap-2 relative z-10">
          <Droplet className="w-6 h-6 text-white fill-white" />
          <span className="font-heading font-semibold text-xl tracking-tight">
            BloodBridge
          </span>
        </div>

        {/* Stats */}
        <div className="space-y-8 relative z-10">
          <h2 className="font-display font-bold text-3xl leading-tight">
            Connecting Life, One Drop at a Time.
          </h2>
          
          <div className="space-y-4 font-body">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold font-mono">47,283+</p>
                <p className="text-[10px] text-white/70">Volunteer Donors Registered</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold font-mono">12</p>
                <p className="text-[10px] text-white/70">Emergency Requests Handled Today</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold font-mono">89,421</p>
                <p className="text-[10px] text-white/70">Total Lives Saved & Counting</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-white/50 relative z-10">
          BloodBridge Operations Center v2.0
        </div>
      </div>

      {/* Right Panel: Sign In Form (60% width, full-width on mobile) */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-8 md:p-12 relative">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div>
            <h1 className="font-heading font-semibold text-2xl text-[var(--color-text)] dark:text-white">
              Vetted Portal Access
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Select your authenticated role profile coordinates below.
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-3 bg-gray-100 dark:bg-slate-800 p-1 rounded-card border border-border dark:border-border-dk">
            {(['donor', 'hospital', 'admin'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setActiveRole(role);
                  setErrorMsg('');
                }}
                className={`py-2 text-xs font-semibold rounded-[6px] capitalize transition-all ${
                  activeRole === role
                    ? 'bg-white dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs rounded">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                {activeRole === 'admin'
                  ? 'Username'
                  : activeRole === 'donor'
                  ? 'Contact / Phone'
                  : 'Hospital Code / Contact'}
              </label>
              <input
                type="text"
                required
                placeholder={
                  activeRole === 'admin'
                    ? 'e.g. admin'
                    : activeRole === 'donor'
                    ? 'e.g. 1234567890'
                    : 'e.g. 555-0101'
                }
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-border dark:border-border-dk bg-transparent text-sm rounded-[6px] px-3 py-2 outline-none focus:border-[#A4161A] text-[var(--color-text)] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border dark:border-border-dk bg-transparent text-sm rounded-[6px] px-3 py-2 outline-none focus:border-[#A4161A] text-[var(--color-text)] dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#A4161A] hover:bg-[#660708] disabled:bg-gray-300 dark:disabled:bg-gray-800 text-white rounded-[6px] text-xs font-semibold transition-colors flex items-center justify-center"
            >
              {loading ? 'Authenticating Access...' : 'Access Account'}
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-gray-500">New here? </span>
            <Link href="/register" className="text-xs text-[#A4161A] dark:text-red-400 font-semibold hover:underline">
              Create a donor profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
