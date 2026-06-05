'use client';

import React from 'react';

export default function Testimonials() {
  const reviews = [
    {
      initials: 'PS',
      color: 'bg-emerald-500/10 text-emerald-600',
      name: 'Dr. Priya Sharma',
      title: 'Medical Director, City Hospital',
      quote: 'Response time for critical emergency request orders dropped from hours to under 20 minutes. The direct network connection saves lives.',
    },
    {
      initials: 'AM',
      color: 'bg-[#A4161A]/10 text-[#A4161A]',
      name: 'Arjun Mehta',
      title: 'Registered Donor (47 donations)',
      quote: 'The streak system and achievements dashboard keep me coming back every 3 months. Knowing where my blood goes is incredibly motivating.',
    },
    {
      initials: 'NP',
      color: 'bg-amber-500/10 text-amber-600',
      name: 'Neha Patil',
      title: 'NGO Coordinator, Red Cross MH',
      quote: 'Managing blood drive events and tracking donor eligibility is seamless. It takes the guesswork out of healthcare coordinates.',
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-[var(--color-background)] dark:bg-[#0F172A] border-b border-border dark:border-border-dk">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-semibold text-3xl md:text-4xl text-[var(--color-text)] dark:text-white tracking-tight">
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-body max-w-xl mx-auto mt-3">
            Read what hospitals, donors, and coordinators have to say about the network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((item, idx) => (
            <div
              key={idx}
              className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6 flex flex-col justify-between"
            >
              <p className="font-body text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed mb-6">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-xs ${item.color}`}>
                  {item.initials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-text)] dark:text-white">{item.name}</h4>
                  <p className="text-[10px] text-gray-400">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
