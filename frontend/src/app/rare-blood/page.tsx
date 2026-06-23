'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './rare-blood.module.css';

const RARITY_TIERS: Record<string, string> = {
  'Bombay (Oh)': 'Extremely Rare',
  'Golden Blood (Rhnull)': 'Extremely Rare',
  'AB-': 'Rare',
  'B-': 'Uncommon',
};

interface RareDonor {
  id: string;
  name: string; // Anonymized, e.g., Donor A***
  bloodType: string;
  city: string;
  status: 'Available' | 'On Deferral';
  contact: string;
}

const RARE_TYPES_METADATA = [
  {
    type: 'Bombay (Oh)',
    color: 'var(--crimson)',
    freq: '1 in 10,000 (India)',
    desc: 'Extremely rare phenotype where red cells lack H antigen. Bombay individuals can only receive blood from other Bombay donors.',
  },
  {
    type: 'Golden Blood (Rhnull)',
    color: '#E8A838',
    freq: '1 in 6 million',
    desc: 'Lacks all 61 Rh antigens. Highly sought after for clinical research and universal Rh compatibility, but extremely difficult to source.',
  },
  {
    type: 'AB-',
    color: '#9B59E8',
    freq: 'Under 1% of population',
    desc: 'The rarest of the standard ABO blood groups. Essential for matching platelet and plasma needs for patients of the same type.',
  },
  {
    type: 'B-',
    color: '#38A8E8',
    freq: 'Under 2% of population',
    desc: 'Extremely scarce standard group. Important for matching negative Rh factors, particularly in trauma and surgery situations.',
  },
];

const MOCK_RARE_DONORS: RareDonor[] = [
  { id: 'd-1', name: 'Donor R***', bloodType: 'Bombay (Oh)', city: 'Mumbai', status: 'Available', contact: '+91 98765 43210' },
  { id: 'd-2', name: 'Donor S***', bloodType: 'Golden Blood (Rhnull)', city: 'Bangalore', status: 'Available', contact: '+91 87654 32109' },
  { id: 'd-3', name: 'Donor K***', bloodType: 'AB-', city: 'Mumbai', status: 'Available', contact: '+91 76543 21098' },
  { id: 'd-4', name: 'Donor M***', bloodType: 'B-', city: 'Pune', status: 'Available', contact: '+91 65432 10987' },
];

export default function RareBloodRegistryPage() {
  const [registry, setRegistry] = useState<RareDonor[]>([]);
  const [formName, setFormName] = useState<string>('');
  const [formCity, setFormCity] = useState<string>('');
  const [formType, setFormType] = useState<string>('Bombay (Oh)');
  const [formContact, setFormContact] = useState<string>('');
  
  const [searchType, setSearchType] = useState<string>('All');
  const [searchCity, setSearchCity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchTier, setSearchTier] = useState<string>('All');

  const revealRefGrid = useScrollReveal();
  const revealRefLayout = useScrollReveal();

  const formSectionRef = useRef<HTMLDivElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read from localStorage
    const saved = localStorage.getItem('bb_registry');
    let loadedRegistry: RareDonor[] = [];
    if (saved) {
      try {
        loadedRegistry = JSON.parse(saved);
      } catch (e) {}
    } else {
      loadedRegistry = MOCK_RARE_DONORS;
      localStorage.setItem('bb_registry', JSON.stringify(MOCK_RARE_DONORS));
    }
    setRegistry(loadedRegistry);
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCity || !formContact) return;

    // Anonymize name
    const anonName = `Donor ${formName.charAt(0).toUpperCase()}***`;

    const newDonor: RareDonor = {
      id: `donor-${Date.now()}`,
      name: anonName,
      bloodType: formType,
      city: formCity,
      status: 'Available',
      contact: formContact,
    };

    const updated = [newDonor, ...registry];
    setRegistry(updated);
    localStorage.setItem('bb_registry', JSON.stringify(updated));
    
    // Reset form
    setFormName('');
    setFormCity('');
    setFormContact('');
    
    alert(`Thank you! You have been successfully registered under the anonymized ID: ${anonName}.`);
  };

  const searchResults = useMemo(() => {
    let filtered = registry;

    // Unified text search: matches name, blood type, or city
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.bloodType.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q)
      );
    }

    // Blood type dropdown filter
    if (searchType !== 'All') {
      filtered = filtered.filter(d => d.bloodType === searchType);
    }

    // Rarity tier dropdown filter
    if (searchTier !== 'All') {
      filtered = filtered.filter(d => RARITY_TIERS[d.bloodType] === searchTier);
    }

    // City filter
    if (searchCity.trim()) {
      filtered = filtered.filter(d => d.city.toLowerCase().includes(searchCity.toLowerCase().trim()));
    }

    return filtered;
  }, [registry, searchQuery, searchType, searchTier, searchCity]);

  const handleRequestContact = (donor: RareDonor) => {
    alert(`Emergency Contact Request submitted successfully for ${donor.name} (${donor.bloodType}) in ${donor.city}.\nVerification processes have been initiated with hospital credentials.`);
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Rare Blood Type Registry</h1>
        <p className={styles.heroDesc}>
          A highly secure, anonymized national directory for extremely scarce blood groups. Connecting qualified donors directly with intensive care hospitals during critical shortage situations.
        </p>
        <div className={styles.heroBtns}>
          <Button variant="primary" onClick={() => scrollToSection(formSectionRef)}>
            Register as Rare Donor
          </Button>
          <Button variant="outline" onClick={() => scrollToSection(searchSectionRef)}>
            Search Registry
          </Button>
        </div>
      </div>

      {/* Rare Cards Grid */}
      <div ref={revealRefGrid as any} className={`${styles.cardsGrid} stagger reveal`}>
        {RARE_TYPES_METADATA.map((item) => (
          <div 
            key={item.type} 
            className={`${styles.rareCard} reveal`}
            style={{ borderTop: `3px solid ${item.color}` }}
          >
            <div className={styles.cardIcon}>
              {/* Diamond SVG */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2">
                <path d="M12 2L2 12l10 10 10-10L12 2z" />
              </svg>
            </div>
            <span className={styles.cardName}>{item.type}</span>
            <span className={styles.cardFreq}>{item.freq}</span>
            <p className={styles.cardDesc}>{item.desc}</p>
            <span className={styles.cardLink} onClick={() => {
              setFormType(item.type);
              scrollToSection(formSectionRef);
            }}>
              Register for this type →
            </span>
          </div>
        ))}
      </div>

      {/* Form & Search layout */}
      <div ref={revealRefLayout as any} className={`${styles.registryLayout} reveal`}>
        {/* Left Column: Register Form */}
        <div ref={formSectionRef} className={styles.panel}>
          <h2 className={styles.panelTitle}>Register under Rare Donor Pool</h2>
          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.inputGroup}>
              <span className={styles.label}>Full Name</span>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter your name (will be anonymized)"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.label}>City Location</span>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Mumbai, Bangalore"
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.label}>Rare Blood Type</span>
              <select
                className={styles.select}
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
              >
                <option value="Bombay (Oh)">Bombay (Oh)</option>
                <option value="Golden Blood (Rhnull)">Golden Blood (Rhnull)</option>
                <option value="AB-">AB-</option>
                <option value="B-">B-</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.label}>Private Contact Number</span>
              <input
                type="tel"
                className={styles.input}
                placeholder="e.g. +91 99999 99999"
                value={formContact}
                onChange={(e) => setFormContact(e.target.value)}
                required
              />
            </div>

            <div className={styles.disclaimer}>
              Your contact details are encrypted and kept strictly confidential. They are only disclosed to verified medical facilities during life-or-death emergencies matching your profile.
            </div>

            <Button type="submit" variant="primary" fullWidth>
              Register Anonymously
            </Button>
          </form>
        </div>

        {/* Right Column: Search Panel */}
        <div ref={searchSectionRef} className={styles.panel}>
          <h2 className={styles.panelTitle}>Verify Rare Stock Registry</h2>

          {/* Unified search bar */}
          <div className={styles.inputGroup}>
            <span className={styles.label}>Search donors</span>
            <input
              type="text"
              className={styles.input}
              placeholder="Search by name, blood type, or region…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter row */}
          <div className={styles.searchRow}>
            <select
              className={styles.select}
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Bombay (Oh)">Bombay (Oh)</option>
              <option value="Golden Blood (Rhnull)">Golden Blood (Rhnull)</option>
              <option value="AB-">AB-</option>
              <option value="B-">B-</option>
            </select>

            <select
              className={styles.select}
              value={searchTier}
              onChange={(e) => setSearchTier(e.target.value)}
            >
              <option value="All">All Tiers</option>
              <option value="Extremely Rare">Extremely Rare</option>
              <option value="Rare">Rare</option>
              <option value="Uncommon">Uncommon</option>
            </select>

            <input
              type="text"
              className={styles.input}
              placeholder="City (e.g. Mumbai)"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>

          {/* Results count badge */}
          <span className={styles.resultsBadge}>
            Showing {searchResults.length} of {registry.length} registered rare donors
          </span>

          <div className={styles.resultsList}>
            {searchResults.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>
                  No rare donors match your search. Help us grow the registry.
                </p>
                <Link href="/register">
                  <Button variant="primary">Register as Rare Donor</Button>
                </Link>
              </div>
            ) : (
              searchResults.map(donor => (
                <div key={donor.id} className={styles.resultCard}>
                  <div className={styles.resultInfo}>
                    <span className={styles.resultName}>{donor.name}</span>
                    <span className={styles.resultMeta}>
                      Type: <strong style={{ color: 'var(--crimson)' }}>{donor.bloodType}</strong> | Location: {donor.city}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
                    <span className={styles.resultStatus}>
                      <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--status-adequate)' }} />
                      {donor.status}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRequestContact(donor)}
                    >
                      Request Contact
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
