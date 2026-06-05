'use client';

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Users, ClipboardList, FlaskConical, Siren } from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import InventoryChart from '@/components/dashboard/InventoryChart';
import RequestFeed from '@/components/dashboard/RequestFeed';
import AlertPanel from '@/components/dashboard/AlertPanel';
import DonorActivity from '@/components/dashboard/DonorActivity';
import BloodHeatmap from '@/components/dashboard/BloodHeatmap';
import DemandForecastChart from '@/components/dashboard/DemandForecastChart';
import { useAlertStore } from '@/stores/alertStore';
import { BloodRequest } from '@/types/request';
import { BloodGroup } from '@/constants/bloodGroups';

interface BloodGroupStat {
  Blood_Group: string;
  Available_Quantity: number;
}

export default function DashboardPage() {
  const [role, setRole] = useState<string>('donor');
  const [name, setName] = useState<string>('Vetted Entity');
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // States loaded from Flask API
  const [rawInventory, setRawInventory] = useState<BloodGroupStat[]>([]);
  const [requestsList, setRequestsList] = useState<BloodRequest[]>([]);
  const [donorsCount, setDonorsCount] = useState(47283);
  const [pendingCount, setPendingCount] = useState(0);
  const [emergenciesCount, setEmergenciesCount] = useState(0);

  const { alerts, addAlert } = useAlertStore();

  useEffect(() => {
    const savedToken = localStorage.getItem('bb_token');
    const savedRole = localStorage.getItem('bb_role');
    const savedName = localStorage.getItem('bb_name');

    if (savedToken) setToken(savedToken);
    if (savedRole) setRole(savedRole);
    if (savedName) setName(savedName);

    const fetchData = async () => {
      try {
        const invRes = await fetch('http://localhost:5000/api/v1/inventory', {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        const invData = await invRes.json();
        if (invData.success) {
          setRawInventory(invData.data);
        }

        const reqRes = await fetch('http://localhost:5000/api/v1/requests', {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        const reqData = await reqRes.json();
        if (reqData.success) {
          // Map backend request shape to types/request.ts
          const mapped: BloodRequest[] = reqData.data.map((r: any) => ({
            id: String(r.Request_ID),
            patientName: r.Patient_Name || `Patient #${r.Request_ID}`,
            bloodGroup: r.Blood_Group as BloodGroup,
            units: Math.round(r.Quantity / 350) || 1,
            hospital: r.Hospital_Name || `Hospital #${r.Hospital_ID}`,
            urgency: r.Urgency || 'Routine',
            status: r.Status || 'Pending',
            requestedAt: r.Date || new Date().toISOString(),
          }));
          setRequestsList(mapped);

          // Calculate counters
          const pendings = mapped.filter((r) => r.status === 'Pending');
          setPendingCount(pendings.length);
          setEmergenciesCount(mapped.filter((r) => r.urgency === 'Critical' && r.status !== 'Fulfilled').length);

          // Add critical ones to active SOS store
          pendings.forEach((p) => {
            if (p.urgency === 'Critical') {
              addAlert(p);
            }
          });
        }

        const donorRes = await fetch('http://localhost:5000/api/v1/donors', {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        const donorData = await donorRes.json();
        if (donorData.success) {
          setDonorsCount(donorData.data.length || 47283);
        }
      } catch (err) {
        console.error('API Fetch failed, using mock fallbacks.', err);
        // Load mock dataset if offline
        const mockRequests: BloodRequest[] = [
          { id: '40129', patientName: 'Amit Shah', bloodGroup: 'O+', units: 2, hospital: 'Sion Hospital', urgency: 'Critical', status: 'Pending', requestedAt: new Date(Date.now() - 5 * 60000).toISOString() },
          { id: '40128', patientName: 'Neha Rao', bloodGroup: 'A-', units: 1, hospital: 'KEM Hospital', urgency: 'Urgent', status: 'Matched', requestedAt: new Date(Date.now() - 40 * 60000).toISOString() },
          { id: '40127', patientName: 'Pooja Bhat', bloodGroup: 'AB+', units: 3, hospital: 'Fortis Mulund', urgency: 'Routine', status: 'Fulfilled', requestedAt: new Date(Date.now() - 120 * 60000).toISOString() },
        ];
        setRequestsList(mockRequests);
        setPendingCount(2);
        setEmergenciesCount(1);
        mockRequests.forEach(r => {
          if (r.urgency === 'Critical') addAlert(r);
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Socket.io Real-time feed
    const socket = io('http://localhost:5000');
    socket.on('connect', () => {
      console.log('🔌 Realtime socket connected');
    });
    socket.on('inventory_update', (updated: BloodGroupStat[]) => {
      setRawInventory(updated);
    });
    return () => {
      socket.disconnect();
    };
  }, [addAlert]);

  // Convert raw ml stats to Chart shapes
  const chartData = useMemo(() => {
    const list: { bloodGroup: BloodGroup; units: number }[] = [
      { bloodGroup: 'A+', units: 0 },
      { bloodGroup: 'A-', units: 0 },
      { bloodGroup: 'B+', units: 0 },
      { bloodGroup: 'B-', units: 0 },
      { bloodGroup: 'AB+', units: 0 },
      { bloodGroup: 'AB-', units: 0 },
      { bloodGroup: 'O+', units: 0 },
      { bloodGroup: 'O-', units: 0 },
    ];

    rawInventory.forEach((item) => {
      const match = list.find((l) => l.bloodGroup === item.Blood_Group);
      if (match) {
        match.units = Math.round(item.Available_Quantity / 350); // ml to units
      }
    });

    // Fallbacks if database returns empty
    if (rawInventory.length === 0) {
      return [
        { bloodGroup: 'A+', units: 34 },
        { bloodGroup: 'A-', units: 4 },
        { bloodGroup: 'B+', units: 48 },
        { bloodGroup: 'B-', units: 2 },
        { bloodGroup: 'AB+', units: 18 },
        { bloodGroup: 'AB-', units: 1 },
        { bloodGroup: 'O+', units: 56 },
        { bloodGroup: 'O-', units: 12 },
      ] as any;
    }

    return list;
  }, [rawInventory]);

  const totalUnitsAvailable = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.units, 0);
  }, [chartData]);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-t-[#A4161A] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-gray-500">Loading metrics overview...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-body">
      {/* Stat KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Active Donors"
          value={donorsCount}
          delta="+8.4%"
          trend="up"
          icon={Users}
        />
        <KPICard
          title="Pending Requests"
          value={pendingCount}
          delta={pendingCount > 0 ? `+${pendingCount}` : '0'}
          deltaLabel="active tickets in queue"
          trend={pendingCount > 0 ? 'down' : 'neutral'}
          icon={ClipboardList}
        />
        <KPICard
          title="Units Available"
          value={totalUnitsAvailable}
          delta="-2.1%"
          trend="down"
          icon={FlaskConical}
        />
        <KPICard
          title="Emergencies Today"
          value={emergenciesCount}
          delta={emergenciesCount > 0 ? 'High load' : 'Stable'}
          trend={emergenciesCount > 0 ? 'down' : 'neutral'}
          icon={Siren}
        />
      </div>

      {/* Main Content Grid layout: left 2 columns / right 1 column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Inventory chart */}
          <div className="bg-surface dark:bg-[#1E293B] border border-border dark:border-border-dk rounded-card p-6">
            <h3 className="font-heading font-semibold text-sm text-[var(--color-text)] dark:text-white uppercase tracking-wider mb-6">
              Blood Bank Inventory Reserves
            </h3>
            <InventoryChart data={chartData} />
          </div>

          {/* Table feed */}
          <RequestFeed requests={requestsList} />
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-8">
          <AlertPanel />
          <DonorActivity />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BloodHeatmap />
        <DemandForecastChart />
      </div>
    </div>
  );
}
