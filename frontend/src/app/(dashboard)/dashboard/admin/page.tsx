'use client';

import React, { useState, useEffect } from 'react';
import StatsCard from '@/components/StatsCard/StatsCard';
import ForecastChart from '@/components/ForecastChart/ForecastChart';
import DataTable from '@/components/DataTable/DataTable';
import LiveBadge from '@/components/LiveBadge/LiveBadge';
import { MOCK_INVENTORY, MOCK_EMERGENCY_REQUESTS } from '@/lib/mockData';
import styles from './admin.module.css';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  bloodType: string;
  status: string;
}

interface RequestLogItem {
  id: string;
  hospital: string;
  bloodType: string;
  units: number;
  urgency: string;
  status: string;
}

interface InventoryLogItem {
  id: string;
  facility: string;
  bloodType: string;
  units: number;
  status: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'inventory'>('users');
  const [user, setUser] = useState({ name: 'Admin', email: 'admin@bloodbridge.net' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: parsed.name || 'Admin',
          email: parsed.email || 'admin@bloodbridge.net',
        });
      } catch (e) {}
    }
  }, []);

  // Tabs Data
  const usersData: UserItem[] = [
    { id: '1', name: 'John Doe', email: 'john@gmail.com', role: 'Donor', bloodType: 'O-', status: 'Active' },
    { id: '2', name: 'City General Hospital', email: 'contact@citygeneral.org', role: 'Hospital', bloodType: 'N/A', status: 'Verified' },
    { id: '3', name: 'Jane Smith', email: 'jane.smith@yahoo.com', role: 'Donor', bloodType: 'A+', status: 'Active' },
    { id: '4', name: 'Apollo Emergency Care', email: 'info@apolloemergency.com', role: 'Hospital', bloodType: 'N/A', status: 'Verified' },
    { id: '5', name: 'Robert Johnson', email: 'robert.j@gmail.com', role: 'Donor', bloodType: 'B-', status: 'Inactive' },
  ];

  const requestsData: RequestLogItem[] = MOCK_EMERGENCY_REQUESTS.map((req, idx) => ({
    id: req.id,
    hospital: req.hospital,
    bloodType: req.bloodType as any,
    units: req.unitsNeeded,
    urgency: req.urgency,
    status: idx === 0 ? 'Pending Matches' : idx === 2 ? 'In Transit' : 'Completed',
  }));

  const inventoryData: InventoryLogItem[] = [
    { id: '1', facility: 'City General Hospital', bloodType: 'O-', units: 9, status: 'Critical' },
    { id: '2', facility: 'City General Hospital', bloodType: 'A+', units: 245, status: 'Adequate' },
    { id: '3', facility: 'Apollo Emergency Care', bloodType: 'O-', units: 15, status: 'Low' },
    { id: '4', facility: 'Apollo Emergency Care', bloodType: 'AB+', units: 89, status: 'Adequate' },
    { id: '5', facility: 'Bandra Blood Bank Center', bloodType: 'O-', units: 3, status: 'Critical' },
  ];

  // Render Table Columns
  const userColumns = [
    { key: 'name' as keyof UserItem, header: 'Name' },
    { key: 'email' as keyof UserItem, header: 'Email' },
    { key: 'role' as keyof UserItem, header: 'Role' },
    { key: 'bloodType' as keyof UserItem, header: 'Blood Type' },
    {
      key: 'status' as keyof UserItem,
      header: 'Status',
      render: (val: any) => (
        <span
          style={{
            color:
              val === 'Active' || val === 'Verified'
                ? 'var(--status-adequate)'
                : 'var(--ink-muted)',
            fontWeight: 'semibold',
          }}
        >
          {val}
        </span>
      ),
    },
  ];

  const requestColumns = [
    { key: 'hospital' as keyof RequestLogItem, header: 'Facility' },
    { key: 'bloodType' as keyof RequestLogItem, header: 'Blood Type' },
    { key: 'units' as keyof RequestLogItem, header: 'Units' },
    {
      key: 'urgency' as keyof RequestLogItem,
      header: 'Urgency',
      render: (val: any) => (
        <span
          style={{
            color:
              val === 'critical'
                ? 'var(--status-critical)'
                : val === 'urgent'
                ? 'var(--status-low)'
                : 'var(--status-adequate)',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          {val}
        </span>
      ),
    },
    { key: 'status' as keyof RequestLogItem, header: 'Status' },
  ];

  const inventoryColumns = [
    { key: 'facility' as keyof InventoryLogItem, header: 'Facility' },
    { key: 'bloodType' as keyof InventoryLogItem, header: 'Blood Type' },
    { key: 'units' as keyof InventoryLogItem, header: 'Units' },
    {
      key: 'status' as keyof InventoryLogItem,
      header: 'Status',
      render: (val: any) => (
        <span
          style={{
            color:
              val === 'Critical'
                ? 'var(--status-critical)'
                : val === 'Low'
                ? 'var(--status-low)'
                : 'var(--status-adequate)',
            fontWeight: 'semibold',
          }}
        >
          {val}
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <h1 className={styles.title}>System Control Center</h1>
          <LiveBadge connected={true} />
        </div>
        <p className={styles.subtitle}>Supervise user registrations, emergency alerts matching, and ML forecast demand models.</p>
      </div>

      {/* Row 1 — Stats */}
      <div className={styles.statsGrid}>
        <StatsCard value="12,847" label="Total Donors" status="adequate" />
        <StatsCard value="847" label="Total Hospitals" />
        <StatsCard value="3" label="Active Requests" status="critical" />
        <StatsCard value="18" label="Donations Today" status="adequate" />
        <StatsCard value="2" label="Critical Shortages" status="critical" />
        <StatsCard value="0" label="System Alerts" status="adequate" />
      </div>

      {/* Row 2 — Forecast Chart */}
      <div className={styles.forecastSection}>
        <h2 className={styles.sectionTitle}>Demand Forecasting (ML Prediction Model)</h2>
        <ForecastChart />
      </div>

      {/* Row 3 — Split Section */}
      <div className={styles.rowSplit}>
        {/* Left: Recent Activity */}
        <div className={styles.activityPanel}>
          <h2 className={styles.sectionTitle}>Recent Network Activities</h2>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker} />
              <div className={styles.timelineHeader}>
                <span>DONATION RECORDED</span>
                <span>2 min ago</span>
              </div>
              <p className={styles.timelineContent}>
                Jane Smith (A+) completed donation at Apollo Emergency Care.
              </p>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker} style={{ backgroundColor: 'var(--status-low)' }} />
              <div className={styles.timelineHeader}>
                <span>REQUEST UPDATED</span>
                <span>8 min ago</span>
              </div>
              <p className={styles.timelineContent}>
                Lilavati Hospital matched 8 donor response accepts for O+ emergency.
              </p>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker} />
              <div className={styles.timelineHeader}>
                <span>NEW REGISTRATION</span>
                <span>15 min ago</span>
              </div>
              <p className={styles.timelineContent}>
                Holy Family Hospital registered as partner facility.
              </p>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineMarker} style={{ backgroundColor: 'var(--status-critical)' }} />
              <div className={styles.timelineHeader}>
                <span>CRITICAL BROADCAST</span>
                <span>45 min ago</span>
              </div>
              <p className={styles.timelineContent}>
                Tata Memorial Center dispatched critical emergency alert for AB- blood type.
              </p>
            </div>
          </div>
        </div>

        {/* Right: System alerts feed */}
        <div className={styles.alertsPanel}>
          <h2 className={styles.sectionTitle}>Real-time Socket Warnings</h2>
          <div className={styles.alertList}>
            <div className={styles.alertItem}>
              <div className={styles.alertHeader} style={{ color: 'var(--status-critical)' }}>
                <span>CRITICAL SHORTAGE</span>
                <span>Just Now</span>
              </div>
              <p className={styles.alertDesc}>
                O- supply under threshold limit (9 units remaining globally).
              </p>
            </div>
            <div className={styles.alertItem} style={{ borderLeftColor: 'var(--status-low)' }}>
              <div className={styles.alertHeader} style={{ color: 'var(--status-low)' }}>
                <span>INVENTORY WARNING</span>
                <span>24m ago</span>
              </div>
              <p className={styles.alertDesc}>
                B- reserves dropping at Bandra Blood Bank Center (3 units remaining).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4 — Management Tables */}
      <div className={styles.tabsSection}>
        <div className={styles.tabHeader}>
          <button
            onClick={() => setActiveTab('users')}
            className={`${styles.tabBtn} ${activeTab === 'users' ? styles.tabBtnActive : ''}`}
          >
            Manage Users ({usersData.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`${styles.tabBtn} ${activeTab === 'requests' ? styles.tabBtnActive : ''}`}
          >
            All Broadcasts ({requestsData.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`${styles.tabBtn} ${activeTab === 'inventory' ? styles.tabBtnActive : ''}`}
          >
            Facilities Stock ({inventoryData.length})
          </button>
        </div>

        <div>
          {activeTab === 'users' && <DataTable data={usersData} columns={userColumns} />}
          {activeTab === 'requests' && <DataTable data={requestsData} columns={requestColumns} />}
          {activeTab === 'inventory' && <DataTable data={inventoryData} columns={inventoryColumns} />}
        </div>
      </div>
    </div>
  );
}
