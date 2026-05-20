'use client';

import { useState, useEffect, Fragment } from 'react';
import { io } from 'socket.io-client';
import DonorCard from '../components/ui/DonorCard';
import AnalyticsDashboard from '../components/AnalyticsDashboard';


type BloodGroupStat = {
  Blood_Group: string;
  Available_Quantity: number;
};

type DonationRecord = {
  Donation_ID: number;
  Donor_Name?: string;
  Donor_ID?: number;
  Blood_Group: string;
  Quantity: number;
  Date: string;
  Status: string;
};

type RequestRecord = {
  Request_ID: number;
  Hospital_Name?: string;
  Hospital_ID?: number;
  Blood_Group: string;
  Quantity: number;
  Date: string;
  Status: string;
};

type DonorRecord = {
  Donor_ID: number;
  Name: string;
  Age: number;
  Gender: string;
  Blood_Group: string;
  Contact: string;
  Address: string;
};

export default function Dashboard() {
  const [role, setRole] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Loaded database metrics
  const [inventory, setInventory] = useState<BloodGroupStat[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [donors, setDonors] = useState<DonorRecord[]>([]);
  
  // Real-time geolocation donor matching states
  const [matchingDonors, setMatchingDonors] = useState<Record<number, any[]>>({});
  const [loadingMatches, setLoadingMatches] = useState<Record<number, boolean>>({});


  // Action form state variables
  const [showAddDonor, setShowAddDonor] = useState(false);
  const [newDonorName, setNewDonorName] = useState('');
  const [newDonorAge, setNewDonorAge] = useState('');
  const [newDonorGender, setNewDonorGender] = useState('Male');
  const [newDonorBlood, setNewDonorBlood] = useState('O+');
  const [newDonorContact, setNewDonorContact] = useState('');
  const [newDonorAddress, setNewDonorAddress] = useState('');

  const [newDonationBlood, setNewDonationBlood] = useState('O+');
  const [newDonationQty, setNewDonationQty] = useState('');
  const [newDonationNotes, setNewDonationNotes] = useState('');

  const [newRequestBlood, setNewRequestBlood] = useState('O+');
  const [newRequestQty, setNewRequestQty] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('bb_token');
    const savedRole = localStorage.getItem('bb_role');
    const savedName = localStorage.getItem('bb_name');

    if (!savedToken || !savedRole) {
      window.location.href = '/';
      return;
    }

    setToken(savedToken);
    setRole(savedRole);
    setName(savedName || 'Vetted Entity');
    fetchDashboardData(savedToken, savedRole);

    // Setup real-time Socket.IO inventory connection
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('🔌 Connected to real-time inventory Socket.IO server');
    });

    socket.on('inventory_update', (updatedInventory: BloodGroupStat[]) => {
      console.log('⚡ Real-time inventory broadcast received:', updatedInventory);
      setInventory(updatedInventory);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.IO server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);


  const fetchDashboardData = async (jwtToken: string, userRole: string) => {
    setLoading(true);
    try {
      // 1. Fetch inventory (available to all roles)
      const invRes = await fetch('http://localhost:5000/api/v1/inventory', {
        headers: { 'Authorization': `Bearer ${jwtToken}` }
      });
      const invData = await invRes.json();
      if (invData.success) {
        setInventory(invData.data);
      }

      // 2. Fetch specific records based on role
      if (userRole === 'admin') {
        const donRes = await fetch('http://localhost:5000/api/v1/donations', {
          headers: { 'Authorization': `Bearer ${jwtToken}` }
        });
        const donData = await donRes.json();
        if (donData.success) setDonations(donData.data);

        const reqRes = await fetch('http://localhost:5000/api/v1/requests', {
          headers: { 'Authorization': `Bearer ${jwtToken}` }
        });
        const reqData = await reqRes.json();
        if (reqData.success) setRequests(reqData.data);

        const donorRes = await fetch('http://localhost:5000/api/v1/donors', {
          headers: { 'Authorization': `Bearer ${jwtToken}` }
        });
        const donorData = await donorRes.json();
        if (donorData.success) setDonors(donorData.data);
      } else if (userRole === 'donor') {
        const donRes = await fetch('http://localhost:5000/api/v1/donations', {
          headers: { 'Authorization': `Bearer ${jwtToken}` }
        });
        const donData = await donRes.json();
        if (donData.success) setDonations(donData.data);
      } else if (userRole === 'hospital') {
        const reqRes = await fetch('http://localhost:5000/api/v1/requests', {
          headers: { 'Authorization': `Bearer ${jwtToken}` }
        });
        const reqData = await reqRes.json();
        if (reqData.success) setRequests(reqData.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard records:', err);
      setErrorMsg('Failed to load real-time metrics from the REST API.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bb_token');
    localStorage.removeItem('bb_role');
    localStorage.removeItem('bb_name');
    localStorage.removeItem('bb_username');
    window.location.href = '/';
  };

  const fetchMatchingDonors = async (requestId: number) => {
    setLoadingMatches(prev => ({ ...prev, [requestId]: true }));
    try {
      const res = await fetch(`http://localhost:5000/api/v1/requests/${requestId}/matching-donors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMatchingDonors(prev => ({ ...prev, [requestId]: data.data }));
      }
    } catch (err) {
      console.error('Error fetching matching donors:', err);
    } finally {
      setLoadingMatches(prev => ({ ...prev, [requestId]: false }));
    }
  };


  // Admin Actions
  const approveDonation = async (donationId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/donations/${donationId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Donation #${donationId} approved!`);
        fetchDashboardData(token, role);
      } else {
        setErrorMsg(data.message || 'Failed to approve donation.');
      }
    } catch (err) {
      setErrorMsg('Network error while processing approval.');
    }
  };

  const approveRequest = async (requestId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/requests/${requestId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Request #${requestId} approved and inventory updated!`);
        fetchDashboardData(token, role);
      } else {
        setErrorMsg(data.message || 'Failed to approve request.');
      }
    } catch (err) {
      setErrorMsg('Network error while processing approval.');
    }
  };

  const handleAddDonor = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('http://localhost:5000/api/v1/donors', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newDonorName,
          age: parseInt(newDonorAge),
          gender: newDonorGender,
          blood_group: newDonorBlood,
          contact: newDonorContact,
          address: newDonorAddress
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Donor added successfully! Default password is changeme123.');
        setShowAddDonor(false);
        setNewDonorName('');
        setNewDonorAge('');
        setNewDonorContact('');
        setNewDonorAddress('');
        fetchDashboardData(token, role);
      } else {
        setErrorMsg(data.message || 'Failed to add donor.');
      }
    } catch (err) {
      setErrorMsg('Error connecting to the API.');
    }
  };

  // Donor Action
  const handleScheduleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('http://localhost:5000/api/v1/donations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          blood_group: newDonationBlood,
          quantity: parseFloat(newDonationQty),
          notes: newDonationNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Donation scheduled successfully! Pending admin approval.');
        setNewDonationQty('');
        setNewDonationNotes('');
        fetchDashboardData(token, role);
      } else {
        setErrorMsg(data.message || 'Failed to schedule donation.');
      }
    } catch (err) {
      setErrorMsg('Network error.');
    }
  };

  // Hospital Action
  const handleRequestBlood = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('http://localhost:5000/api/v1/requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          blood_group: newRequestBlood,
          quantity: parseFloat(newRequestQty)
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Blood request submitted successfully! Pending inventory verification.');
        setNewRequestQty('');
        fetchDashboardData(token, role);
      } else {
        setErrorMsg(data.message || 'Failed to submit request.');
      }
    } catch (err) {
      setErrorMsg('Network error.');
    }
  };

  if (loading && inventory.length === 0) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading secure panel...</div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      {/* Top dashboard header */}
      <header className="glass-panel" style={{ padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem', width: '100%', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <svg style={{ width: '32px', height: '32px', fill: 'var(--primary)' }} viewBox="0 0 24 24">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>
            BloodBridge
          </span>
          <span className="glass-badge badge-info" style={{ textTransform: 'uppercase', fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}>
            {role} Portal
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.925rem', fontWeight: 600, color: 'white' }}>{name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role: {role}</div>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Floating notification banners */}
      {errorMsg && (
        <div className="glass-badge badge-danger" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1.25rem', borderRadius: 'var(--border-radius-md)', width: '100%', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
        </div>
      )}

      {successMsg && (
        <div className="glass-badge badge-success" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem 1.25rem', borderRadius: 'var(--border-radius-md)', width: '100%', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
        </div>
      )}

      {/* Primary Panels container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* ROW 1: Available Blood Supply (Inventory) */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--primary)' }}>♥</span> Blood Bank Available Inventory
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {inventory.map((item) => {
              const percentage = Math.min((item.Available_Quantity / 1000) * 100, 100);
              let barColor = 'var(--success)';
              if (item.Available_Quantity === 0) barColor = 'var(--danger)';
              else if (item.Available_Quantity < 200) barColor = 'var(--warning)';
              else if (item.Available_Quantity < 500) barColor = 'var(--info)';

              return (
                <div key={item.Blood_Group} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '1.25rem', borderRadius: 'var(--border-radius-md)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>{item.Blood_Group}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: barColor }}>{item.Available_Quantity} ml</span>
                  </div>
                  {/* Progress Indicator */}
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: barColor, borderRadius: '9999px', transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' }}></div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {item.Available_Quantity === 0 ? 'Critical (Depleted)' : item.Available_Quantity < 200 ? 'Low Supply' : 'Adequate Supply'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ROW 2: Role-based Action Forms and Logs */}

        {/* ================= ADMIN INTERFACE ================= */}
        {role === 'admin' && (
          <>
            <AnalyticsDashboard token={token} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            
            {/* Admin Left: Pendings queues */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Pending Donations list */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                  Pending Donations Approval Queue
                </h3>
                <div className="table-container">
                  <table className="glass-table">
                    <thead>
                      <tr>
                        <th>Donation ID</th>
                        <th>Donor</th>
                        <th>Group</th>
                        <th>Volume</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.filter(d => d.Status === 'Pending').length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center' }}>
                            No pending donation approvals in queue.
                          </td>
                        </tr>
                      ) : (
                        donations.filter(d => d.Status === 'Pending').map((record) => (
                          <tr key={record.Donation_ID}>
                            <td>#{record.Donation_ID}</td>
                            <td>{record.Donor_Name || `Donor #${record.Donor_ID}`}</td>
                            <td><span className="glass-badge badge-info">{record.Blood_Group}</span></td>
                            <td>{record.Quantity} ml</td>
                            <td>
                              <button onClick={() => approveDonation(record.Donation_ID)} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '6px' }}>
                                Approve
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending Requests list */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                  Pending Hospital Blood Requests Queue
                </h3>
                <div className="table-container">
                  <table className="glass-table">
                    <thead>
                      <tr>
                        <th>Request ID</th>
                        <th>Hospital</th>
                        <th>Group</th>
                        <th>Volume</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.filter(r => r.Status === 'Pending').length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center' }}>
                            No pending hospital requests in queue.
                          </td>
                        </tr>
                      ) : (
                        requests.filter(r => r.Status === 'Pending').map((record) => (
                          <Fragment key={record.Request_ID}>
                            <tr>
                              <td>#{record.Request_ID}</td>
                              <td>{record.Hospital_Name || `Hospital #${record.Hospital_ID}`}</td>
                              <td><span className="glass-badge badge-warning">{record.Blood_Group}</span></td>
                              <td>{record.Quantity} ml</td>
                              <td>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button onClick={() => approveRequest(record.Request_ID)} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '6px', background: 'var(--success)', boxShadow: '0 4px 14px var(--success-glow)' }}>
                                    Approve
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (matchingDonors[record.Request_ID]) {
                                        setMatchingDonors(prev => {
                                          const copy = { ...prev };
                                          delete copy[record.Request_ID];
                                          return copy;
                                        });
                                      } else {
                                        fetchMatchingDonors(record.Request_ID);
                                      }
                                    }}
                                    className="btn-secondary" 
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '6px' }}
                                  >
                                    {loadingMatches[record.Request_ID] ? 'Loading...' : matchingDonors[record.Request_ID] ? 'Hide' : 'Matches'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {matchingDonors[record.Request_ID] && (
                              <tr>
                                <td colSpan={5} style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '1rem' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <h4 style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>Nearby Compatible Donors:</h4>
                                    {matchingDonors[record.Request_ID].length === 0 ? (
                                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No compatible active donors found in region.</p>
                                    ) : (
                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '0.25rem' }}>
                                        {matchingDonors[record.Request_ID].map((d: any) => (
                                          <div key={d.Donor_ID} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '0.75rem' }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'white' }}>{d.Name}</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                              <span>Blood: <strong style={{ color: 'var(--primary)' }}>{d.Blood_Group}</strong></span>
                                              <span>Proximity: <strong style={{ color: 'var(--info)' }}>{d.distance_km} km</strong></span>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Contact: {d.Contact}</div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Admin Right: Donor Registry and Operations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'white', fontFamily: 'var(--font-heading)' }}>Donor Network Registry</h3>
                  <button onClick={() => setShowAddDonor(!showAddDonor)} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                    {showAddDonor ? 'Hide Form' : 'Register New Donor'}
                  </button>
                </div>

                {showAddDonor && (
                  <form onSubmit={handleAddDonor} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input type="text" required className="glass-input" value={newDonorName} onChange={(e) => setNewDonorName(e.target.value)} placeholder="Jane Smith" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Age</label>
                        <input type="number" min="18" required className="glass-input" value={newDonorAge} onChange={(e) => setNewDonorAge(e.target.value)} placeholder="32" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Gender</label>
                        <select className="glass-input glass-select" value={newDonorGender} onChange={(e) => setNewDonorGender(e.target.value)}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Blood Group</label>
                        <select className="glass-input glass-select" value={newDonorBlood} onChange={(e) => setNewDonorBlood(e.target.value)}>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Contact</label>
                        <input type="tel" required className="glass-input" value={newDonorContact} onChange={(e) => setNewDonorContact(e.target.value)} placeholder="e.g. 9876543210" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <input type="text" required className="glass-input" value={newDonorAddress} onChange={(e) => setNewDonorAddress(e.target.value)} placeholder="789 Maple Rd, Chicago" />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.65rem 0' }}>
                      Register Donor
                    </button>
                  </form>
                )}

                <div className="table-container" style={{ maxHeight: '400px' }}>
                  <table className="glass-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Group</th>
                        <th>Contact</th>
                        <th>Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donors.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center' }}>
                            No registered donors.
                          </td>
                        </tr>
                      ) : (
                        donors.map((d) => (
                          <tr key={d.Donor_ID}>
                            <td style={{ fontWeight: 600, color: 'white' }}>{d.Name}</td>
                            <td><span className="glass-badge badge-danger">{d.Blood_Group}</span></td>
                            <td>{d.Contact}</td>
                            <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{d.Address}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          </>
        )}

        {/* ================= DONOR INTERFACE ================= */}
        {role === 'donor' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <DonorCard 
                donorId={parseInt(typeof window !== 'undefined' ? localStorage.getItem('bb_donor_id') || '0' : '0')} 
                donorName={name} 
                bloodGroup={typeof window !== 'undefined' ? localStorage.getItem('bb_blood_group') || 'O+' : 'O+'} 
                contact={typeof window !== 'undefined' ? localStorage.getItem('bb_contact') || '' : ''} 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2.5rem' }}>
            {/* Donor Left: Schedule Donation */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                Schedule a Blood Donation Appointment
              </h3>
              <form onSubmit={handleScheduleDonation} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select className="glass-input glass-select" value={newDonationBlood} onChange={(e) => setNewDonationBlood(e.target.value)}>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Donation Volume (ml)</label>
                    <input type="number" required min="50" max="600" className="glass-input" value={newDonationQty} onChange={(e) => setNewDonationQty(e.target.value)} placeholder="e.g. 350" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Donation Notes / Health Status</label>
                  <textarea rows={3} className="glass-input" style={{ resize: 'none' }} value={newDonationNotes} onChange={(e) => setNewDonationNotes(e.target.value)} placeholder="e.g. Feeling completely healthy, regular donor." />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Schedule Appointment
                </button>
              </form>
            </div>

            {/* Donor Right: History Log */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                Your Donation Fulfillment Log
              </h3>
              <div className="table-container">
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>Donation ID</th>
                      <th>Blood Group</th>
                      <th>Quantity</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ color: 'var(--text-muted)', padding: '3rem 0', textAlign: 'center' }}>
                          No donations recorded yet. Schedule your first donation!
                        </td>
                      </tr>
                    ) : (
                      donations.map((record) => (
                        <tr key={record.Donation_ID}>
                          <td>#{record.Donation_ID}</td>
                          <td><span className="glass-badge badge-danger">{record.Blood_Group}</span></td>
                          <td>{record.Quantity} ml</td>
                          <td>{new Date(record.Date).toLocaleDateString()}</td>
                          <td>
                            <span className={`glass-badge ${record.Status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                              {record.Status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          </>
        )}

        {/* ================= HOSPITAL INTERFACE ================= */}
        {role === 'hospital' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2.5rem' }}>
            {/* Hospital Left: Submit Blood Request */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                Submit Urgent Blood Demand Request
              </h3>
              <form onSubmit={handleRequestBlood} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Blood Group Required</label>
                    <select className="glass-input glass-select" value={newRequestBlood} onChange={(e) => setNewRequestBlood(e.target.value)}>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quantity Required (ml)</label>
                    <input type="number" required min="50" max="2000" className="glass-input" value={newRequestQty} onChange={(e) => setNewRequestQty(e.target.value)} placeholder="e.g. 450" />
                  </div>
                </div>

                <div className="glass-badge badge-warning" style={{ display: 'flex', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-md)', fontSize: '0.8rem', lineHeight: '1.3' }}>
                  <span>⚠️ Demanding quantities exceeding the available blood bank inventory status will remain pending until additional donors replenish the reserve.</span>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Request Fulfillment
                </button>
              </form>
            </div>

            {/* Hospital Right: Demand History Log */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                Blood Request Fulfillment Log
              </h3>
              <div className="table-container">
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Blood Group</th>
                      <th>Quantity</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ color: 'var(--text-muted)', padding: '3rem 0', textAlign: 'center' }}>
                          No blood requests recorded yet.
                        </td>
                      </tr>
                    ) : (
                      requests.map((record) => (
                        <Fragment key={record.Request_ID}>
                          <tr>
                            <td>#{record.Request_ID}</td>
                            <td><span className="glass-badge badge-info">{record.Blood_Group}</span></td>
                            <td>{record.Quantity} ml</td>
                            <td>{new Date(record.Date).toLocaleDateString()}</td>
                            <td>
                              <span className={`glass-badge ${record.Status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                                {record.Status}
                              </span>
                            </td>
                            <td>
                              <button 
                                onClick={() => {
                                  if (matchingDonors[record.Request_ID]) {
                                    setMatchingDonors(prev => {
                                      const copy = { ...prev };
                                      delete copy[record.Request_ID];
                                      return copy;
                                    });
                                  } else {
                                    fetchMatchingDonors(record.Request_ID);
                                  }
                                }}
                                className="btn-secondary" 
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', borderRadius: '6px' }}
                              >
                                {loadingMatches[record.Request_ID] ? 'Loading...' : matchingDonors[record.Request_ID] ? 'Hide' : 'Find Donors'}
                              </button>
                            </td>
                          </tr>
                          {matchingDonors[record.Request_ID] && (
                            <tr>
                              <td colSpan={6} style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                  <h4 style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>Nearby Compatible Donors:</h4>
                                  {matchingDonors[record.Request_ID].length === 0 ? (
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No compatible active donors found in region.</p>
                                  ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '0.25rem' }}>
                                      {matchingDonors[record.Request_ID].map((d: any) => (
                                        <div key={d.Donor_ID} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '0.75rem' }}>
                                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'white' }}>{d.Name}</div>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                            <span>Blood: <strong style={{ color: 'var(--primary)' }}>{d.Blood_Group}</strong></span>
                                            <span>Proximity: <strong style={{ color: 'var(--info)' }}>{d.distance_km} km</strong></span>
                                          </div>
                                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Contact: {d.Contact}</div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
