'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsDashboard({ token }: { token: string }) {
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [summaryRes, trendsRes, forecastRes] = await Promise.all([
          fetch('http://localhost:5000/api/v1/analytics/summary', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/v1/analytics/trends', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/v1/analytics/forecast?days=14', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const summaryData = await summaryRes.json();
        const trendsData = await trendsRes.json();
        const forecastData = await forecastRes.json();

        if (summaryData.success) setSummary(summaryData.data);
        if (trendsData.success) {
            const combinedData = [...trendsData.data];
            // Merge forecast data into the timeline for continuous charting
            if (forecastData.success && forecastData.data.forecast) {
                forecastData.data.forecast.forEach((f: any) => {
                    combinedData.push({
                        date: f.date,
                        predicted_requests: f.predicted_demand
                    });
                });
            }
            setTrends(combinedData);
        }
        if (forecastData.success) setForecast(forecastData.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  if (loading) return <div style={{ color: 'white', padding: '2rem' }}>Loading advanced analytics...</div>;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#E63946', '#2DC653', '#F4A261'];
  
  // Dummy data for pie chart since the backend summary didn't break it down,
  // in a real scenario we would fetch this distribution from the backend.
  const bloodTypeData = [
    { name: 'O+', value: 40 },
    { name: 'O-', value: 10 },
    { name: 'A+', value: 25 },
    { name: 'A-', value: 5 },
    { name: 'B+', value: 15 },
    { name: 'B-', value: 2 },
    { name: 'AB+', value: 2 },
    { name: 'AB-', value: 1 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Total Donors</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--success)' }}>{summary?.donors || 0}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Total Hospitals</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--info)' }}>{summary?.hospitals || 0}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Total ML Donated</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>{summary?.total_donations_ml || 0}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>Total ML Requested</h4>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--warning)' }}>{summary?.total_requests_ml || 0}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Trend & Forecast Line Chart */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <h3 style={{ fontSize: '1.25rem', color: 'white', margin: 0, fontFamily: 'var(--font-heading)' }}>
               Demand Forecast (Next 14 Days)
             </h3>
             {forecast && (
               <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
                 AI Confidence: {forecast.confidence}%
               </span>
             )}
          </div>
          
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 17, 23, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: 'white' }}
                />
                <Legend />
                <Line type="monotone" dataKey="donations" name="Actual Donations" stroke="var(--success)" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="requests" name="Actual Requests" stroke="var(--warning)" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="predicted_requests" name="AI Predicted Demand" stroke="var(--primary)" strokeWidth={3} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Group Distribution Pie Chart */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1rem', fontFamily: 'var(--font-heading)', width: '100%' }}>
            Blood Group Distribution
          </h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bloodTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {bloodTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 17, 23, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
