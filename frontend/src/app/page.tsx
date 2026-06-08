'use client';

import React from 'react';
import Link from 'next/link';
import TopNav from '@/components/TopNav/TopNav';
import Button from '@/components/Button/Button';
import BloodInventoryGrid from '@/components/BloodInventoryGrid/BloodInventoryGrid';
import RequestCard from '@/components/RequestCard/RequestCard';
import { MOCK_INVENTORY, MOCK_EMERGENCY_REQUESTS } from '@/lib/mockData';
import styles from './page.module.css';

export default function LandingPage() {
  // Take 3 requests for preview
  const previewRequests = MOCK_EMERGENCY_REQUESTS.slice(0, 3);

  return (
    <div className={styles.container}>
      <TopNav />

      {/* SECTION A: Full-Viewport Hero */}
      <section className={styles.hero}>
        <div className={styles.hexGrid} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Live Emergency Network</div>
          <h1 className={styles.headline}>Every Second Counts.</h1>
          <p className={styles.subHeadline}>
            BloodBridge connects donors, hospitals, and lives — in real time.
          </p>

          <div className={styles.ctaRow}>
            <Link href="/register">
              <Button variant="primary" size="lg">
                Register as Donor
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Hospital Portal
              </Button>
            </Link>
          </div>

          <div className={styles.statsRow}>
            <span>12,847 Active Donors</span>
            <span className={styles.divider}>|</span>
            <span>847 Partner Hospitals</span>
            <span className={styles.divider}>|</span>
            <span>99.2% Match Rate</span>
          </div>
        </div>

        {/* Scrolling Ticker Strip */}
        <div className={styles.ticker}>
          <div className={styles.tickerTrack}>
            {MOCK_INVENTORY.map((item, idx) => {
              const isLow = item.units / item.maxCapacity <= 0.2;
              const isUrgent = item.units / item.maxCapacity > 0.2 && item.units / item.maxCapacity <= 0.4;
              const statusSymbol = isLow ? '🔴' : isUrgent ? '🟡' : '🟢';
              const urgencyText = isLow ? 'CRITICAL' : '';
              return (
                <div key={`${item.bloodType}-${idx}`} className={styles.tickerItem}>
                  <span>{statusSymbol}</span>
                  <span>{item.bloodType}</span>
                  <span>—</span>
                  <span>{item.units} units</span>
                  {urgencyText && <span style={{ color: 'var(--crimson)', fontWeight: 'bold' }}>{urgencyText}</span>}
                  <span className={styles.dot}>•</span>
                </div>
              );
            })}
            {/* Duplicate for infinite marquee effect */}
            {MOCK_INVENTORY.map((item, idx) => {
              const isLow = item.units / item.maxCapacity <= 0.2;
              const isUrgent = item.units / item.maxCapacity > 0.2 && item.units / item.maxCapacity <= 0.4;
              const statusSymbol = isLow ? '🔴' : isUrgent ? '🟡' : '🟢';
              const urgencyText = isLow ? 'CRITICAL' : '';
              return (
                <div key={`${item.bloodType}-dup-${idx}`} className={styles.tickerItem}>
                  <span>{statusSymbol}</span>
                  <span>{item.bloodType}</span>
                  <span>—</span>
                  <span>{item.units} units</span>
                  {urgencyText && <span style={{ color: 'var(--crimson)', fontWeight: 'bold' }}>{urgencyText}</span>}
                  <span className={styles.dot}>•</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION B: Blood Inventory Snapshot */}
      <section className={styles.section}>
        <div className={styles.sectionCenter}>
          <span className={styles.sectionLabel}>Current Availability</span>
          <h2 className={styles.sectionTitle}>Know Before You Need It.</h2>
        </div>
        <BloodInventoryGrid inventory={MOCK_INVENTORY} />
        <div className={styles.sectionCta}>
          <Link href="/emergency">
            <Button variant="outline">Request Emergency Blood →</Button>
          </Link>
        </div>
      </section>

      {/* SECTION C: How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.howItWorksGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNum}>01</div>
            <h3 className={styles.stepTitle}>Register</h3>
            <p className={styles.stepDesc}>
              Create your profile as a donor or hospital. Verify your blood type and credentials securely.
            </p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNum}>02</div>
            <h3 className={styles.stepTitle}>Match</h3>
            <p className={styles.stepDesc}>
              Our matching engine routes emergency request alerts directly to compatible donors within proximity.
            </p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNum}>03</div>
            <h3 className={styles.stepTitle}>Donate</h3>
            <p className={styles.stepDesc}>
              Respond to alerts, coordinate transit or check-in, and save lives in your community.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION D: Emergency Request Feed (Live Preview) */}
      <section className={styles.section}>
        <div className={styles.sectionCenter}>
          <span className={styles.sectionLabel}>Live Requests</span>
          <h2 className={styles.sectionTitle}>Emergency Urgent Demands</h2>
        </div>
        <div className={styles.requestsGrid}>
          {previewRequests.map((req) => (
            <RequestCard
              key={req.id}
              id={req.id}
              bloodType={req.bloodType as any}
              unitsNeeded={req.unitsNeeded}
              urgency={req.urgency as any}
              hospital={req.hospital}
              location={req.location}
              distance={req.distance}
              postedAt={req.postedAt}
            />
          ))}
        </div>
        <div className={styles.sectionCta}>
          <Link href="/login">
            <Button variant="primary">Sign In to View All Active Requests →</Button>
          </Link>
        </div>
      </section>

      {/* SECTION E: Dark CTA Band */}
      <section className={styles.ctaBand}>
        <div className={styles.ctaBandContent}>
          <h2 className={styles.ctaHeadline}>
            Your blood type might be the rarest thing someone needs today.
          </h2>
          <Link href="/register">
            <Button variant="primary" size="lg">
              Become a Donor
            </Button>
          </Link>
          <span className={styles.ctaSubtext}>
            Donation takes 15 minutes. Impact lasts a lifetime.
          </span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerCol}>
            <h4>About BloodBridge</h4>
            <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-small)' }}>
              A real-time emergency response network connecting blood donors directly to hospitals in life-or-death situations.
            </p>
          </div>
          <div className={styles.footerCol}>
            <h4>For Donors</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/register">Become a Donor</Link>
              </li>
              <li>
                <Link href="/donor-card">Digital Donor Card</Link>
              </li>
              <li>
                <Link href="/chatbot">Donor AI Assistant</Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>For Hospitals</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/login">Hospital Portal</Link>
              </li>
              <li>
                <Link href="/emergency">Submit Request</Link>
              </li>
              <li>
                <Link href="/inventory">Global Inventory</Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Emergency Contact</h4>
            <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-small)', marginBottom: 'var(--space-2)' }}>
              Immediate assistance hotline:
            </p>
            <p style={{ color: 'var(--crimson)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>
              +1 (800) 555-CRIMSON
            </p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>&copy; {new Date().getFullYear()} BloodBridge. All rights reserved.</span>
          <span>Built with &hearts; by obstinix</span>
          <div className={styles.socials}>
            <a href="#">Twitter</a>
            <a href="#">GitHub</a>
            <a href="#">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
