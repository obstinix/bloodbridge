'use client';

import React from 'react';
import Link from 'next/link';
import TopNav from '@/components/TopNav/TopNav';
import Button from '@/components/Button/Button';
import BloodInventoryGrid from '@/components/BloodInventoryGrid/BloodInventoryGrid';
import RequestCard from '@/components/RequestCard/RequestCard';
import { MOCK_EMERGENCY_REQUESTS } from '@/lib/mockData';
import { useRealTimeInventory } from '@/lib/useRealTimeSimulation';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './page.module.css';

export default function LandingPage() {
  const inventory = useRealTimeInventory();
  const previewRequests = MOCK_EMERGENCY_REQUESTS.slice(0, 3);

  const inventoryRef = useScrollReveal();
  const requestFeedRef = useScrollReveal();

  return (
    <div className={styles.container}>
      <TopNav />

      {/* SECTION A: Full-Viewport Hero */}
      <section className={styles.hero}>
        <div className={styles.hexGrid} />

        {/* LOOPING LINE ANIMATION */}
        <div className={styles.lineCanvas} aria-hidden="true">
          <svg
            viewBox="0 0 1440 700"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Line 1 — upper zone, slow */}
            <path
              className={styles.flowLine}
              d="M -120 160 H 240 L 280 190 H 480 L 520 160 H 840 L 880 190 H 1100 L 1140 160 H 1560"
              style={{ animationDuration: '9s', animationDelay: '0s' }}
            />
            <circle className={styles.flowDot} cx="0" cy="160" r="2.5"
              style={{ animationDelay: '0s' }}
            />

            {/* Line 2 — mid upper, faster, offset */}
            <path
              className={styles.flowLine}
              d="M -200 280 H 160 L 200 310 H 380 L 420 280 H 700 L 740 310 H 980 L 1020 280 H 1340 L 1380 310 H 1640"
              style={{ animationDuration: '7s', animationDelay: '1.5s', strokeWidth: '0.75' }}
            />
            <circle className={styles.flowDot} cx="0" cy="280" r="2"
              style={{ animationDelay: '1.5s', animationDuration: '2.5s' }}
            />

            {/* Line 3 — center, thicker, slowest */}
            <path
              className={styles.flowLine}
              d="M -80 350 H 300 L 360 390 H 560 L 620 350 H 920 L 980 390 H 1180 L 1240 350 H 1560"
              style={{ animationDuration: '11s', animationDelay: '3s', strokeWidth: '1.5', opacity: 0.5 }}
            />
            <circle className={styles.flowDot} cx="0" cy="350" r="3"
              style={{ animationDelay: '3s', animationDuration: '1.8s' }}
            />

            {/* Line 4 — lower mid, fast faint */}
            <path
              className={styles.flowLineFaint}
              d="M -160 430 H 200 L 240 450 H 460 L 500 430 H 780 L 820 450 H 1060 L 1100 430 H 1460"
              style={{ animationDuration: '6s', animationDelay: '0.8s' }}
            />

            {/* Line 5 — bottom zone, very faint */}
            <path
              className={styles.flowLineFaint}
              d="M -100 530 H 180 L 220 510 H 500 L 540 530 H 820 L 860 510 H 1100 L 1140 530 H 1560"
              style={{ animationDuration: '14s', animationDelay: '2.2s' }}
            />

            {/* Line 6 — upper faint diagonal hint */}
            <path
              className={styles.flowLineFaint}
              d="M -200 100 H 300 L 340 130 H 620 L 660 100 H 980 L 1020 130 H 1280 L 1320 100 H 1640"
              style={{ animationDuration: '10s', animationDelay: '4.5s' }}
            />
          </svg>
        </div>

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
            {inventory.map((item, idx) => {
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
            {inventory.map((item, idx) => {
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

      {/* FLOATING STATS CARDS — bridge between hero and inventory */}
      <div className={styles.floatCardsSection}>
        <div className={styles.floatCard}>
          <div className={styles.floatCardIcon}>🩸</div>
          <div className={styles.floatCardValue}>
            {inventory.filter(i => i.units / i.maxCapacity <= 0.2).length}
          </div>
          <div className={styles.floatCardLabel}>Critical Types</div>
          <div className={styles.floatCardSub}>Below 20% capacity</div>
        </div>

        <div className={styles.floatCard}>
          <div className={styles.floatCardIcon}>📦</div>
          <div className={styles.floatCardValue}>
            {inventory.reduce((sum, i) => sum + i.units, 0).toLocaleString()}
          </div>
          <div className={styles.floatCardLabel}>Units Available</div>
          <div className={styles.floatCardSub}>Across all blood types</div>
        </div>

        <div className={styles.floatCard}>
          <div className={styles.floatCardIcon}>⚡</div>
          <div className={styles.floatCardValue}>847</div>
          <div className={styles.floatCardLabel}>Partner Hospitals</div>
          <div className={styles.floatCardSub}>Live network</div>
        </div>

        <div className={styles.floatCard}>
          <div className={styles.floatCardIcon}>💉</div>
          <div className={styles.floatCardValue}>99.2%</div>
          <div className={styles.floatCardLabel}>Match Rate</div>
          <div className={styles.floatCardSub}>Emergency fulfillment</div>
        </div>
      </div>

      {/* SECTION B: Blood Inventory Snapshot */}
      <section ref={inventoryRef as any} className={`${styles.section} reveal`}>
        <div className={styles.sectionCenter}>
          <span className={styles.sectionLabel}>Current Availability</span>
          <h2 className={styles.sectionTitle}>Know Before You Need It.</h2>
        </div>
        <BloodInventoryGrid inventory={inventory} />
        <div className={styles.sectionCta}>
          <Link href="/emergency">
            <Button variant="outline">Request Emergency Blood →</Button>
          </Link>
        </div>
      </section>

      {/* SECTION C: How It Works */}
      <section className={styles.howItWorks}>
        <div className={`${styles.howItWorksGrid} stagger`}>
          <div className={`${styles.stepCard} reveal`}>
            <div className={styles.stepNum}>01</div>
            <h3 className={styles.stepTitle}>Register</h3>
            <p className={styles.stepDesc}>
              Create your profile as a donor or hospital. Verify your blood type and credentials securely.
            </p>
          </div>
          <div className={`${styles.stepCard} reveal`}>
            <div className={styles.stepNum}>02</div>
            <h3 className={styles.stepTitle}>Match</h3>
            <p className={styles.stepDesc}>
              Our matching engine routes emergency request alerts directly to compatible donors within proximity.
            </p>
          </div>
          <div className={`${styles.stepCard} reveal`}>
            <div className={styles.stepNum}>03</div>
            <h3 className={styles.stepTitle}>Donate</h3>
            <p className={styles.stepDesc}>
              Respond to alerts, coordinate transit or check-in, and save lives in your community.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION D: Emergency Request Feed (Live Preview) */}
      <section ref={requestFeedRef as any} className={`${styles.section} reveal reveal-scale`}>
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
                <Link href="/dashboard/donor/impact">Donor Impact Tracker</Link>
              </li>
              <li>
                <Link href="/dashboard/donor/schedule">Donation Scheduler</Link>
              </li>
              <li>
                <Link href="/compatibility">Compatibility Reference</Link>
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
                <Link href="/dashboard/hospital/submit-request">Submit Request</Link>
              </li>
              <li>
                <Link href="/inventory">Global Inventory</Link>
              </li>
              <li>
                <Link href="/widget">Embed Widget Configurator</Link>
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
            <ul className={styles.footerLinks} style={{ marginTop: 'var(--space-3)' }}>
              <li>
                <Link href="/leaderboard">Community Leaderboard</Link>
              </li>
              <li>
                <Link href="/rare-blood">Rare Blood Registry</Link>
              </li>
            </ul>
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
