import React, { useState } from 'react';
import { differenceInDays, addDays, format } from 'date-fns';

export default function EligibilityChecker() {
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [weight, setWeight] = useState<number | ''>('');
  const [hemoglobin, setHemoglobin] = useState<number | ''>('');
  const [result, setResult] = useState<{ eligible: boolean; reason?: string; nextDate?: string } | null>(null);

  const checkEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastDonationDate) {
      setResult({ eligible: false, reason: 'Last donation date is required.' });
      return;
    }

    const lastDate = new Date(lastDonationDate);
    const diff = differenceInDays(new Date(), lastDate);

    if (diff < 90) {
      const nextDate = addDays(lastDate, 90);
      setResult({
        eligible: false,
        reason: `Only ${diff} days since last donation. Minimum interval is 90 days.`,
        nextDate: format(nextDate, 'yyyy-MM-dd'),
      });
      return;
    }

    if (weight && weight < 50) {
      setResult({ eligible: false, reason: 'Weight must be at least 50 kg.' });
      return;
    }

    if (hemoglobin && hemoglobin < 12.5) {
      setResult({ eligible: false, reason: 'Hemoglobin level must be at least 12.5 g/dL.' });
      return;
    }

    setResult({ eligible: true });
  };

  return (
    <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 shadow-sm">
      <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white uppercase tracking-wider mb-4">
        Eligibility Estimator
      </h3>
      <form onSubmit={checkEligibility} className="space-y-4 text-xs">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            Last Donation Date
          </label>
          <input
            type="date"
            value={lastDonationDate}
            onChange={(e) => setLastDonationDate(e.target.value)}
            className="w-full px-3 py-2 border border-border dark:border-border-dk rounded-[6px] bg-white dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 65"
              className="w-full px-3 py-2 border border-border dark:border-border-dk rounded-[6px] bg-white dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Hemoglobin (g/dL)
            </label>
            <input
              type="number"
              step="0.1"
              value={hemoglobin}
              onChange={(e) => setHemoglobin(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 13.5"
              className="w-full px-3 py-2 border border-border dark:border-border-dk rounded-[6px] bg-white dark:bg-[#1E293B] text-[var(--color-text)] dark:text-white"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-[#A4161A] text-white text-xs font-semibold rounded-[6px] hover:bg-[#660708] transition-colors"
        >
          Check Eligibility
        </button>

        {result && (
          <div className={`p-3 border rounded text-xs leading-relaxed ${
            result.eligible
              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-300'
          }`}>
            {result.eligible ? (
              <span>✔ Eligible. Volunteer is ready to schedule a donation.</span>
            ) : (
              <div>
                <span className="font-bold block">❌ Ineligible.</span>
                <span className="mt-1 block">{result.reason}</span>
                {result.nextDate && (
                  <span className="mt-1 block font-semibold">Next eligible date: {result.nextDate}</span>
                )}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
