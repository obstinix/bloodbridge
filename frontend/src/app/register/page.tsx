'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Droplet, ArrowLeft, Heart, Shield, Lock } from 'lucide-react';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { BLOOD_GROUPS, BloodGroup } from '@/constants/bloodGroups';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form States
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register_donor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          name: name,
          age: age,
          gender: gender,
          blood_group: bloodGroup,
          contact: contact,
          address: address,
          password: password,
          confirm_password: confirmPassword,
        }),
      });

      if (response.ok) {
        setSuccessMsg('Registration successful! You can now log in.');
        // Reset states
        setName('');
        setAge('');
        setContact('');
        setAddress('');
        setPassword('');
        setConfirmPassword('');
        setStep(4); // Show success screen
      } else {
        setErrorMsg('Registration failed. Contact number may already be registered.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] dark:bg-[#0F172A] flex flex-col font-body py-10 px-6 justify-center relative">
      {/* Back to Home */}
      <Link href="/" className="absolute top-6 left-6 z-20 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back Home
      </Link>
      
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <main className="max-w-md mx-auto w-full bg-white dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <Droplet className="w-6 h-6 text-[#A4161A] fill-[#A4161A]" />
          <span className="font-heading font-semibold text-lg text-[var(--color-text)] dark:text-white">
            BloodBridge Registry
          </span>
        </div>

        {step < 4 && (
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase">
              <span>Step {step} of 3</span>
              <span>{Math.floor((step / 3) * 100)}% Complete</span>
            </div>
            {/* Progress bar */}
            <div className="h-1 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#A4161A] transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs rounded mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-[#A4161A] dark:text-[#F87171] mb-2">
                <Heart className="w-4 h-4" />
                <h2 className="text-sm font-heading font-bold uppercase tracking-wider">Personal Profile</h2>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-border dark:border-border-dk bg-transparent text-sm rounded-[6px] px-3 py-2 outline-none focus:border-[#A4161A] text-[var(--color-text)] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    required
                    min="18"
                    max="65"
                    placeholder="e.g. 28"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full border border-border dark:border-border-dk bg-transparent text-sm rounded-[6px] px-3 py-2 outline-none focus:border-[#A4161A] text-[var(--color-text)] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full border border-border dark:border-border-dk bg-white dark:bg-[#1E293B] text-sm rounded-[6px] px-3 py-2 outline-none focus:border-[#A4161A] text-[var(--color-text)] dark:text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                disabled={!name || !age}
                onClick={() => setStep(2)}
                className="w-full py-3 bg-[#A4161A] hover:bg-[#660708] disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-[6px] text-xs font-semibold transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: Medical & Contact Info */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-[#A4161A] dark:text-[#F87171] mb-2">
                <Shield className="w-4 h-4" />
                <h2 className="text-sm font-heading font-bold uppercase tracking-wider">Medical Coordinates</h2>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
                  Blood Group *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setBloodGroup(bg)}
                      className={`h-10 border rounded font-mono font-bold text-xs transition-all ${
                        bloodGroup === bg
                          ? 'bg-[#A4161A] text-white border-transparent'
                          : 'border-border dark:border-border-dk hover:bg-black/5 dark:hover:bg-white/5 text-[var(--color-text)] dark:text-white'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                  Contact / Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 1234567890"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full border border-border dark:border-border-dk bg-transparent text-sm rounded-[6px] px-3 py-2 outline-none focus:border-[#A4161A] text-[var(--color-text)] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                  Residential Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123 Main St, Mumbai"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-border dark:border-border-dk bg-transparent text-sm rounded-[6px] px-3 py-2 outline-none focus:border-[#A4161A] text-[var(--color-text)] dark:text-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-border dark:border-border-dk text-xs font-semibold rounded-[6px] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!contact || !address}
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-[#A4161A] hover:bg-[#660708] disabled:bg-gray-300 dark:disabled:bg-gray-800 text-white rounded-[6px] text-xs font-semibold transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Security & Submit */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-[#A4161A] dark:text-[#F87171] mb-2">
                <Lock className="w-4 h-4" />
                <h2 className="text-sm font-heading font-bold uppercase tracking-wider">Account Credentials</h2>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border dark:border-border-dk bg-transparent text-sm rounded-[6px] px-3 py-2 outline-none focus:border-[#A4161A] text-[var(--color-text)] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-border dark:border-border-dk bg-transparent text-sm rounded-[6px] px-3 py-2 outline-none focus:border-[#A4161A] text-[var(--color-text)] dark:text-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-border dark:border-border-dk text-xs font-semibold rounded-[6px] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!password || !confirmPassword || loading}
                  className="flex-1 py-3 bg-[#A4161A] hover:bg-[#660708] disabled:bg-gray-300 text-white rounded-[6px] text-xs font-semibold transition-colors"
                >
                  {loading ? 'Submitting Registration...' : 'Register Profile'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success confirmation */}
          {step === 4 && (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h2 className="font-heading font-semibold text-xl text-[var(--color-text)] dark:text-white">
                  Registration Successful!
                </h2>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Your volunteer donor profiling has been securely cataloged. You can now access your vetted dashboard.
                </p>
              </div>

              <Link
                href="/login"
                className="block w-full py-3 bg-[#A4161A] hover:bg-[#660708] text-white rounded-[6px] text-xs font-semibold transition-colors"
              >
                Log In To Your Portal
              </Link>
            </div>
          )}
        </form>

        {step < 4 && (
          <div className="text-center pt-6 border-t border-border dark:border-border-dk mt-6">
            <span className="text-xs text-gray-500">Already registered? </span>
            <Link href="/login" className="text-xs text-[#A4161A] dark:text-red-400 font-semibold hover:underline">
              Log in instead
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
