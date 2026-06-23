'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopNav from '@/components/TopNav/TopNav';
import Button from '@/components/Button/Button';
import BloodInventoryGrid from '@/components/BloodInventoryGrid/BloodInventoryGrid';
import RequestCard from '@/components/RequestCard/RequestCard';
import { MOCK_EMERGENCY_REQUESTS } from '@/lib/mockData';
import { useRealTimeInventory } from '@/lib/useRealTimeSimulation';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useCountUp } from '@/hooks/useCountUp';
import styles from './page.module.css';

/* ─── Small sub-components defined inline ─── */

function ImpactCounter({ end, label, suffix = '' }: { end: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const value = useCountUp(end, 2000);
  return (
    <div className={styles.impactItem} ref={ref}>
      <span className={styles.impactValue}>
        {value.toLocaleString()}{suffix}
      </span>
      <span className={styles.impactLabel}>{label}</span>
    </div>
  );
}

const BLOOD_TYPES = [
  { type: 'O-', label: 'Universal Donor', note: 'Donates to all types', color: 'var(--crimson)' },
  { type: 'O+', label: 'Most Common', note: '38% of population', color: 'var(--status-critical)' },
  { type: 'A+', label: 'Second Most Common', note: 'Donates to A+, AB+', color: 'var(--blood-a)' },
  { type: 'A-', label: 'Rare', note: 'Donates to A, AB types', color: 'var(--blood-a)' },
  { type: 'B+', label: 'Common', note: 'Donates to B+, AB+', color: 'var(--blood-b)' },
  { type: 'B-', label: 'Rare', note: 'Donates to B, AB types', color: 'var(--blood-b)' },
  { type: 'AB+', label: 'Universal Recipient', note: 'Receives all types', color: 'var(--blood-ab)' },
  { type: 'AB-', label: 'Rarest Type', note: 'Only 1% of population', color: 'var(--blood-ab)' },
] as const;

const PARTNER_HOSPITALS = [
  'Apollo Hospitals', 'Fortis Healthcare', 'Max Healthcare',
  'Tata Memorial', 'Lilavati Hospital', 'City General',
  'AIIMS', 'Medanta'
];

export default function LandingPage() {
  const router = useRouter();
  const inventory = useRealTimeInventory();
  const previewRequests = MOCK_EMERGENCY_REQUESTS.slice(0, 3);

  const inventoryRef = useScrollReveal();
  const requestFeedRef = useScrollReveal();
  const awarenessRef = useScrollReveal();
  const proofRef = useScrollReveal();

  const criticalCount = inventory.filter(i => i.units / i.maxCapacity <= 0.2).length;
  const totalUnits = inventory.reduce((sum, i) => sum + i.units, 0);

  return (
    <div className={styles.container}>
      <TopNav />

      {/* ═══ SECTION A: HERO ═══ */}
      <section className={styles.hero}>
        <div className={styles.hexGrid} aria-hidden="true" />

        {/* SVG Line Animation */}
        <div className={styles.lineCanvas} aria-hidden="true">
          <svg viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <path className={styles.flowLine}
              d="M -120 160 H 240 L 280 190 H 480 L 520 160 H 840 L 880 190 H 1100 L 1140 160 H 1560"
              style={{ animationDuration: '9s', animationDelay: '0s' }} />
            <circle className={styles.flowDot} cx="0" cy="160" r="2.5" style={{ animationDelay: '0s' }} />

            <path className={styles.flowLine}
              d="M -200 280 H 160 L 200 310 H 380 L 420 280 H 700 L 740 310 H 980 L 1020 280 H 1340 L 1380 310 H 1640"
              style={{ animationDuration: '7s', animationDelay: '1.5s', strokeWidth: '0.75' }} />
            <circle className={styles.flowDot} cx="0" cy="280" r="2" style={{ animationDelay: '1.5s', animationDuration: '2.5s' }} />

            <path className={styles.flowLine}
              d="M -80 350 H 300 L 360 390 H 560 L 620 350 H 920 L 980 390 H 1180 L 1240 350 H 1560"
              style={{ animationDuration: '11s', animationDelay: '3s', strokeWidth: '1.5', opacity: 0.4 }} />
            <circle className={styles.flowDot} cx="0" cy="350" r="3" style={{ animationDelay: '3s', animationDuration: '1.8s' }} />

            <path className={styles.flowLineFaint}
              d="M -160 430 H 200 L 240 450 H 460 L 500 430 H 780 L 820 450 H 1060 L 1100 430 H 1460"
              style={{ animationDuration: '6s', animationDelay: '0.8s' }} />

            <path className={styles.flowLineFaint}
              d="M -100 530 H 180 L 220 510 H 500 L 540 530 H 820 L 860 510 H 1100 L 1140 530 H 1560"
              style={{ animationDuration: '14s', animationDelay: '2.2s' }} />
          </svg>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Live Emergency Network
          </div>

          <h1 className={styles.headline}>
            Every Second<br />
            <span className={styles.headlineCrimson}>Counts.</span>
          </h1>

          <p className={styles.subHeadline}>
            BloodBridge connects donors, hospitals, and lives —
            in real time. When every minute matters, we make the match.
          </p>

          <div className={styles.ctaRow}>
            <Link href="/register">
              <Button variant="primary" size="lg">Become a Donor</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">Hospital Portal →</Button>
            </Link>
          </div>

          <div className={styles.heroMeta}>
            <div className={styles.heroMetaItem}>
              <span className={styles.heroMetaValue}>{criticalCount}</span>
              <span className={styles.heroMetaLabel}>Blood Types Critical</span>
            </div>
            <div className={styles.heroMetaDivider} />
            <div className={styles.heroMetaItem}>
              <span className={styles.heroMetaValue}>{totalUnits.toLocaleString()}</span>
              <span className={styles.heroMetaLabel}>Units Available</span>
            </div>
            <div className={styles.heroMetaDivider} />
            <div className={styles.heroMetaItem}>
              <span className={styles.heroMetaValue}>99.2%</span>
              <span className={styles.heroMetaLabel}>Match Success Rate</span>
            </div>
          </div>
        </div>

        {/* Blood Type Ticker */}
        <div className={styles.ticker} aria-label="Live blood inventory levels">
          <div className={styles.tickerLabel}>LIVE</div>
          <div className={styles.tickerScroll}>
            <div className={styles.tickerTrack}>
              {[...inventory, ...inventory].map((item, idx) => {
                const pct = item.units / item.maxCapacity;
                const isLow = pct <= 0.2;
                const isUrgent = pct > 0.2 && pct <= 0.4;
                return (
                  <div key={`tick-${idx}`} className={styles.tickerItem}>
                    <span className={isLow ? styles.tickerDotCritical : isUrgent ? styles.tickerDotWarn : styles.tickerDotOk} />
                    <span className={styles.tickerType}>{item.bloodType}</span>
                    <span className={styles.tickerUnits}>{item.units}u</span>
                    {isLow && <span className={styles.tickerCritical}>CRITICAL</span>}
                    <span className={styles.tickerSep}>·</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION B: IMPACT NUMBERS ═══ */}
      <section className={styles.impactStrip}>
        <div className={styles.impactInner}>
          <ImpactCounter end={12847} label="Registered Donors" suffix="+" />
          <div className={styles.impactDivider} />
          <ImpactCounter end={847} label="Partner Hospitals" />
          <div className={styles.impactDivider} />
          <ImpactCounter end={38421} label="Lives Impacted" suffix="+" />
          <div className={styles.impactDivider} />
          <ImpactCounter end={99} label="Match Success Rate" suffix="%" />
        </div>
      </section>

      {/* ═══ SECTION C: HOW IT WORKS ═══ */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>The Process</span>
          <h2 className={styles.sectionTitle}>From Alert to Arrival in Minutes</h2>
          <p className={styles.sectionDesc}>
            Three steps stand between a critical shortage and a life saved.
            BloodBridge compresses each one.
          </p>
        </div>

        <div className={`${styles.stepsRow} stagger`}>
          <div className={`${styles.stepCard} reveal`}>
            <div className={styles.stepIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className={styles.stepNum}>01</div>
            <h3 className={styles.stepTitle}>Register</h3>
            <p className={styles.stepDesc}>
              Create your profile as a donor or hospital. Your blood type,
              location, and availability are stored securely and matched in real time.
            </p>
            <Link href="/register" className={styles.stepLink}>Register now →</Link>
          </div>

          <div className={styles.stepConnector} aria-hidden="true">
            <svg width="40" height="2" viewBox="0 0 40 2">
              <line x1="0" y1="1" x2="40" y2="1" stroke="var(--hairline-strong)" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>

          <div className={`${styles.stepCard} reveal`}>
            <div className={styles.stepIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <div className={styles.stepNum}>02</div>
            <h3 className={styles.stepTitle}>Match</h3>
            <p className={styles.stepDesc}>
              Our engine combines blood-type compatibility with Haversine
              distance to surface the nearest eligible donors the moment a request fires.
            </p>
            <Link href="/compatibility" className={styles.stepLink}>See compatibility →</Link>
          </div>

          <div className={styles.stepConnector} aria-hidden="true">
            <svg width="40" height="2" viewBox="0 0 40 2">
              <line x1="0" y1="1" x2="40" y2="1" stroke="var(--hairline-strong)" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>

          <div className={`${styles.stepCard} reveal`}>
            <div className={styles.stepIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <div className={styles.stepNum}>03</div>
            <h3 className={styles.stepTitle}>Donate</h3>
            <p className={styles.stepDesc}>
              Accept the alert, confirm your check-in, and be guided to the
              nearest facility. The system tracks your contribution and notifies the hospital.
            </p>
            <Link href="/dashboard/donor/donate" className={styles.stepLink}>Start donating →</Link>
          </div>
        </div>
      </section>

      {/* ═══ SECTION D: BLOOD INVENTORY SNAPSHOT ═══ */}
      <section ref={inventoryRef as any} className={`${styles.inventorySection} reveal`}>
        <div className={styles.inventorySplit}>
          <div className={styles.inventoryLeft}>
            <span className={styles.sectionLabel}>Current Availability</span>
            <h2 className={styles.sectionTitle}>Know Before You Need It.</h2>
            <p className={styles.sectionDesc}>
              Live blood stock levels across the network, updated every 8 seconds.
              Critical thresholds trigger immediate donor alerts.
            </p>
            <div className={styles.inventoryLegend}>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: 'var(--status-critical)' }} />Critical (&lt;20%)
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: 'var(--status-low)' }} />Low (&lt;40%)
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: 'var(--status-adequate)' }} />Adequate
              </span>
            </div>
            <Link href="/emergency">
              <Button variant="outline">Request Emergency Blood →</Button>
            </Link>
          </div>

          <div className={styles.inventoryRight}>
            <BloodInventoryGrid inventory={inventory} />
          </div>
        </div>
      </section>

      {/* ═══ SECTION E: LIVE REQUEST FEED ═══ */}
      <section ref={requestFeedRef as any} className={`${styles.requestsSection} reveal`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Live Requests</span>
          <h2 className={styles.sectionTitle}>Active Emergency Demands</h2>
          <p className={styles.sectionDesc}>
            These requests are live. Every card is a hospital in shortage.
            Sign in to accept a match or submit your own request.
          </p>
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
              onViewDetails={() => router.push('/login')}
              onAccept={() => router.push('/login')}
            />
          ))}
        </div>

        <div className={styles.requestsFooter}>
          <p className={styles.requestsFooterNote}>
            Showing 3 of 24 active requests. Sign in to see all and respond.
          </p>
          <Link href="/login">
            <Button variant="primary">View All Requests →</Button>
          </Link>
        </div>
      </section>

      {/* ═══ SECTION F: BLOOD TYPE AWARENESS ═══ */}
      <section ref={awarenessRef as any} className={`${styles.awarenessSection} reveal`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Blood Type Guide</span>
          <h2 className={styles.sectionTitle}>Your Type. Your Impact.</h2>
          <p className={styles.sectionDesc}>
            Every blood type has a role. Understanding yours is the first step to saving a life.
          </p>
        </div>

        <div className={`${styles.awarenessGrid} stagger`}>
          {BLOOD_TYPES.map(({ type, label, note, color }) => (
            <div key={type} className={`${styles.awarenessCard} reveal`}>
              <div className={styles.awarenessType} style={{ color, borderColor: color }}>
                {type}
              </div>
              <div className={styles.awarenessCardBody}>
                <span className={styles.awarenessCardLabel}>{label}</span>
                <span className={styles.awarenessCardNote}>{note}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.awarenessCta}>
          <Link href="/compatibility">
            <Button variant="outline">Full Compatibility Matrix →</Button>
          </Link>
        </div>
      </section>

      {/* ═══ SECTION G: SOCIAL PROOF ═══ */}
      <section ref={proofRef as any} className={`${styles.proofSection} reveal`}>
        <div className={styles.proofTestimonial}>
          <blockquote className={styles.testimonialText}>
            "BloodBridge cut our emergency sourcing time from 4 hours to under 20 minutes.
            For O-negative trauma patients, that difference is everything."
          </blockquote>
          <div className={styles.testimonialAuthor}>
            <div className={styles.testimonialAvatar}>DR</div>
            <div className={styles.testimonialMeta}>
              <span className={styles.testimonialName}>Dr. R. Mehta</span>
              <span className={styles.testimonialRole}>Head of Emergency Medicine, Apollo Hospitals Mumbai</span>
            </div>
          </div>
        </div>

        <div className={styles.partnerStrip}>
          <span className={styles.partnerLabel}>Trusted by 847+ hospitals including</span>
          <div className={styles.partnerLogos}>
            {PARTNER_HOSPITALS.map(name => (
              <span key={name} className={styles.partnerName}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION H: CTA BAND ═══ */}
      <section className={styles.ctaBand}>
        <div className={styles.ctaBandInner}>
          <div className={styles.ctaBandLeft}>
            <span className={styles.sectionLabel} style={{ color: 'var(--crimson)' }}>
              Ready to save lives?
            </span>
            <h2 className={styles.ctaHeadline}>
              Your blood type might be the rarest thing someone needs today.
            </h2>
            <p className={styles.ctaSubtext}>
              Donation takes 15 minutes. The impact lasts a lifetime.
              One unit can save up to three lives.
            </p>
          </div>
          <div className={styles.ctaBandRight}>
            <Link href="/register">
              <Button variant="primary" size="lg">Become a Donor</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">Hospital Sign In</Button>
            </Link>
            <div className={styles.ctaBandNote}>
              Free to join. No commitments. Lifesaving by design.
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--crimson)">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              <span>
                <em>Blood</em>Bridge
              </span>
            </div>
            <p className={styles.footerTagline}>
              Real-time emergency blood response.<br />
              Every second is someone's last chance.
            </p>
            <div className={styles.footerSocials}>
              <a href="#" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://github.com/obstinix/bloodbridge" aria-label="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.footerCol}>
              <h4>For Donors</h4>
              <ul>
                <li><Link href="/register">Become a Donor</Link></li>
                <li><Link href="/donor-card">Digital Donor Card</Link></li>
                <li><Link href="/dashboard/donor/impact">Impact Tracker</Link></li>
                <li><Link href="/dashboard/donor/schedule">Schedule Donation</Link></li>
                <li><Link href="/compatibility">Compatibility Guide</Link></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h4>For Hospitals</h4>
              <ul>
                <li><Link href="/login">Hospital Portal</Link></li>
                <li><Link href="/dashboard/hospital/submit-request">Submit Request</Link></li>
                <li><Link href="/inventory">Global Inventory</Link></li>
                <li><Link href="/analytics">Demand Forecast</Link></li>
                <li><Link href="/widget">Embed Widget</Link></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h4>Explore</h4>
              <ul>
                <li><Link href="/leaderboard">Leaderboard</Link></li>
                <li><Link href="/rare-blood">Rare Blood Registry</Link></li>
                <li><Link href="/chatbot">AI Assistant</Link></li>
                <li><Link href="/emergency">Emergency Feed</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} BloodBridge. All rights reserved.</span>
          <span>Built with precision by <a href="https://github.com/obstinix" style={{ color: 'var(--crimson)' }}>obstinix</a></span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)' }}>
            Emergency Hotline: <span style={{ color: 'var(--crimson)' }}>+1 (800) 555-BRIDGE</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
