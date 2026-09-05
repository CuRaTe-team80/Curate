import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend
} from 'recharts';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const COLORS = ['#94a3b8', '#f59e0b', '#10b981'];

export default function Dashboard() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/samples`)
      .then((res) => res.json())
      .then((data) => {
        setSamples(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dashboard data:', err);
        setLoading(false);
      });
  }, []);

  const total = samples.length;
  const unlabeled = samples.filter((s) => s.status === 'Unlabeled').length;
  const inReview = samples.filter((s) => s.status === 'In Review').length;
  const labeled = samples.filter((s) => s.status === 'Labeled').length;

  const chartData = [
    { name: 'Unlabeled', value: unlabeled || (total === 0 ? 1 : 0) },
    { name: 'In Review', value: inReview },
    { name: 'Labeled', value: labeled }
  ];

  const barData = [
    { status: 'Unlabeled', count: unlabeled },
    { status: 'In Review', count: inReview },
    { status: 'Labeled', count: labeled }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: 'inherit' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>
        Dataset Analytics
      </h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>
        Live metrics and status distribution for current samples.
      </p>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Total Samples</span>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>{total}</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Unlabeled</span>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#94a3b8', marginTop: '4px' }}>{unlabeled}</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>In Review</span>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#f59e0b', marginTop: '4px' }}>{inReview}</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Labeled</span>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>{labeled}</div>
        </div>
      </div>

      {/* Visual Charts Container */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Donut Chart */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>Status Breakdown (Donut)</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>Distribution Count (Bar)</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="status" stroke="#94a3b8" />
                <YAxis allowDecimals={false} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}