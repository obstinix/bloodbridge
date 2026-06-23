'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Button from '@/components/Button/Button';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './schedule.module.css';

interface Appointment {
  id: string;
  date: string;
  center: string;
  reminders: {
    email: boolean;
    browser: boolean;
  };
}

const MOCK_CENTERS = [
  { id: 'c1', name: 'City Central Donor Hub', distance: '1.2 km' },
  { id: 'c2', name: 'Apollo General Hospital', distance: '4.8 km' },
  { id: 'c3', name: 'Bandra Blood Bank Center', distance: '7.5 km' },
];

// Calculation of eligibility: 56 days from May 12, 2026
const LAST_DONATION_DATE = new Date(2026, 4, 12); // May 12, 2026
const ELIGIBILITY_DATE = new Date(LAST_DONATION_DATE.getTime() + 56 * 24 * 60 * 60 * 1000);
const TODAY = new Date();

export default function DonationSchedulerPage() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedCenter, setSelectedCenter] = useState<string>(MOCK_CENTERS[0].name);
  const [reminderEmail, setReminderEmail] = useState<boolean>(true);
  const [reminderBrowser, setReminderBrowser] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const revealRef1 = useScrollReveal();
  const revealRef2 = useScrollReveal();
  const revealRef3 = useScrollReveal();
  const revealRef4 = useScrollReveal();
  const timelineRef = useRef<HTMLDivElement>(null);
  const todayCellRef = useRef<HTMLDivElement>(null);

  // Generate 28-day timeline starting from TODAY
  const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const timelineDays = useMemo(() => {
    const days: { date: Date; label: string; monthLabel: string; dateStr: string }[] = [];
    for (let i = 0; i < 28; i++) {
      const d = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      days.push({
        date: d,
        label: String(d.getDate()),
        monthLabel: MONTH_ABBR[d.getMonth()],
        dateStr,
      });
    }
    return days;
  }, []);

  // Countdown: days until eligibility
  const countdownDays = useMemo(() => {
    const diff = ELIGIBILITY_DATE.getTime() - TODAY.getTime();
    const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
    return days > 0 ? days : 0;
  }, []);

  // Auto-scroll today cell into view
  useEffect(() => {
    if (todayCellRef.current && timelineRef.current) {
      todayCellRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, []);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('bb_schedule');
    if (saved) {
      try {
        setAppointments(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load schedule from localStorage', e);
      }
    } else {
      // Default mock appointment
      const defaultApp = [
        {
          id: 'app-default',
          date: '2026-07-10',
          center: 'City Central Donor Hub',
          reminders: { email: true, browser: true },
        },
      ];
      setAppointments(defaultApp);
      localStorage.setItem('bb_schedule', JSON.stringify(defaultApp));
    }
  }, []);

  const saveAppointments = (newApps: Appointment[]) => {
    setAppointments(newApps);
    localStorage.setItem('bb_schedule', JSON.stringify(newApps));
  };

  const handleDayClick = (year: number, month: number, day: number, isEligible: boolean) => {
    if (!isEligible) return;
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(formattedDate);
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const newApp: Appointment = {
      id: `app-${Date.now()}`,
      date: selectedDate,
      center: selectedCenter,
      reminders: {
        email: reminderEmail,
        browser: reminderBrowser,
      },
    };

    const updated = [newApp, ...appointments];
    saveAppointments(updated);
    setSelectedDate('');
  };

  const handleCancel = (id: string) => {
    const updated = appointments.filter((app) => app.id !== id);
    saveAppointments(updated);
  };

  const generateICS = (dateStr: string, center: string): string => {
    const dtstart = dateStr.replace(/-/g, '') + 'T090000';
    const dtend = dateStr.replace(/-/g, '') + 'T100000';
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${dtstart}`,
      `DTEND:${dtend}`,
      `SUMMARY:BloodBridge Donation at ${center}`,
      'DESCRIPTION:Your scheduled blood donation appointment.',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
  };

  const downloadICS = (app: Appointment) => {
    const icsContent = generateICS(app.date, app.center);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bloodbridge-appointment-${app.date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to render calendar days for a specific month
  const renderCalendarMonth = (year: number, month: number) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Blank padding cells
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className={styles.dayCell} style={{ opacity: 0, cursor: 'default' }} />);
    }

    // Days cells
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const formattedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const isToday =
        currentDate.getFullYear() === TODAY.getFullYear() &&
        currentDate.getMonth() === TODAY.getMonth() &&
        currentDate.getDate() === TODAY.getDate();
        
      const isEligible = currentDate >= ELIGIBILITY_DATE;
      const isSelected = selectedDate === formattedDateStr;

      const cellClasses = [
        styles.dayCell,
        isToday ? styles.dayToday : '',
        isEligible ? styles.dayEligible : styles.dayIneligible,
        isSelected ? styles.daySelected : '',
      ].filter(Boolean).join(' ');

      days.push(
        <div
          key={`day-${day}`}
          className={cellClasses}
          onClick={() => handleDayClick(year, month, day, isEligible)}
          title={!isEligible ? 'Ineligible (56 days deferral active)' : 'Available for scheduling'}
        >
          {day}
        </div>
      );
    }

    return (
      <div key={`${year}-${month}`} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div className={styles.monthTitle}>{monthNames[month]} {year}</div>
        <div className={styles.calendarGrid}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, index) => (
            <div key={`head-${index}`} className={styles.dayName}>{d}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  // Render 3 months starting from TODAY's month (June, July, August 2026)
  const calendarMonthsData = [
    { year: 2026, month: 5 }, // June
    { year: 2026, month: 6 }, // July
    { year: 2026, month: 7 }, // August
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Smart Donation Scheduler</h1>
        <p className={styles.subtitle}>
          Select an available day cells. A 56-day medical safety deferral period is automatically enforced since your last donation on 12th May 2026.
        </p>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-1) var(--space-3)',
          border: `1px solid ${countdownDays === 0 ? 'var(--status-adequate)' : 'var(--hairline-mid)'}`,
          borderRadius: 'var(--radius-pill)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-caption)',
          color: countdownDays === 0 ? 'var(--status-adequate)' : 'var(--ink-muted)',
          backgroundColor: countdownDays === 0 ? 'rgba(39,174,96,0.1)' : 'transparent',
          marginBottom: 'var(--space-4)',
        }}>
          {countdownDays === 0
            ? '✓ You are eligible to donate now'
            : `Next eligible: ${ELIGIBILITY_DATE.toDateString()} (${countdownDays} days)`}
        </div>
      </div>

      {/* 4-Week Timeline Strip + Countdown */}
      <div ref={revealRef4 as any} className={`${styles.timelineRow} reveal`}>
        <div className={styles.timelineStrip}>
          <h2 className={styles.timelineHeading}>Next 4 Weeks</h2>
          <div className={styles.timelineScroll} ref={timelineRef}>
            {timelineDays.map((day, idx) => {
              const isPast = false; // All days start from TODAY, day 0 = today
              const isToday = idx === 0;
              const isEligible = day.date >= ELIGIBILITY_DATE;
              const isSelected = selectedDate === day.dateStr;

              const cellClasses = [
                styles.timelineCell,
                isToday ? styles.timelineCellToday : '',
                isEligible ? styles.timelineCellEligible : styles.timelineCellDimmed,
                isSelected ? styles.timelineCellSelected : '',
              ].filter(Boolean).join(' ');

              return (
                <div
                  key={day.dateStr}
                  ref={isToday ? todayCellRef : undefined}
                  className={cellClasses}
                  onClick={() => handleDayClick(day.date.getFullYear(), day.date.getMonth(), day.date.getDate(), isEligible)}
                  title={isEligible ? 'Click to select' : 'Ineligible (56-day deferral)'}
                >
                  <span className={styles.timelineDay}>{day.label}</span>
                  <span className={styles.timelineMonth}>{day.monthLabel}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Countdown Sidebar */}
        <div className={styles.countdownCard}>
          <span className={styles.countdownLabel}>
            {countdownDays > 0 ? 'Next Eligible In' : 'You Are Eligible'}
          </span>
          <span className={styles.countdownValue}>
            {countdownDays > 0 ? countdownDays : '✓'}
          </span>
          <span className={styles.countdownUnit}>
            {countdownDays > 0 ? (countdownDays === 1 ? 'day' : 'days') : 'Donate now'}
          </span>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Left column: Calendar views */}
        <div ref={revealRef1 as any} className={`${styles.calendarSection} reveal`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {calendarMonthsData.map(({ year, month }) => renderCalendarMonth(year, month))}
          </div>
        </div>

        {/* Right column: Form details */}
        <div ref={revealRef2 as any} className={`${styles.formSection} reveal`}>
          <h2 className={styles.sectionTitle}>Appointment Details</h2>
          <form className={styles.form} onSubmit={handleSchedule}>
            <div className={styles.inputGroup}>
              <span className={styles.label}>Selected Date</span>
              <input
                type="text"
                readOnly
                className={styles.select}
                value={selectedDate || 'Select a green day cell...'}
                style={{ fontFamily: 'var(--font-mono)', border: selectedDate ? '1px solid var(--status-adequate)' : undefined }}
              />
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.label}>Donation Center</span>
              <select
                className={styles.select}
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
              >
                {MOCK_CENTERS.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.distance})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.label}>Reminders Options</span>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={reminderEmail}
                    onChange={(e) => setReminderEmail(e.target.checked)}
                  />
                  Email Alert
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={reminderBrowser}
                    onChange={(e) => setReminderBrowser(e.target.checked)}
                  />
                  Browser Push Notification
                </label>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={!selectedDate}
              fullWidth
            >
              Book Appointment
            </Button>
          </form>
        </div>
      </div>

      {/* Appointments List */}
      <div ref={revealRef3 as any} className={`${styles.appointmentsSection} reveal`}>
        <h2 className={styles.sectionTitle} style={{ marginBottom: 'var(--space-4)' }}>Upcoming Appointments</h2>
        {appointments.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--ink-muted)' }}>No appointments scheduled.</p>
        ) : (
          <div className={styles.appList}>
            {appointments.map((app) => (
              <div key={app.id} className={styles.appItem}>
                <div className={styles.appDetails}>
                  <span className={styles.appDate}>{app.date}</span>
                  <span className={styles.appCenter}>{app.center}</span>
                </div>
                <div className={styles.appActions}>
                  <Button variant="outline" size="sm" onClick={() => downloadICS(app)}>
                    Add to Calendar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleCancel(app.id)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
