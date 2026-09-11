import { useState, useEffect } from "react";
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
} from "recharts";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const COLORS = ["#a855f7", "#38bdf8", "#10b981"];

export default function Dashboard() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    fetch(API_BASE + "/samples")
      .then(function (res) { return res.json(); })
      .then(function (data) {
        setSamples(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(function (err) {
        console.error("Failed to load dashboard data:", err);
        setLoading(false);
      });
  }, []);

  const total = samples.length;
  const unlabeled = samples.filter(function (s) { return s.status === "Unlabeled"; }).length;
  const inReview = samples.filter(function (s) { return s.status === "In Review"; }).length;
  const labeled = samples.filter(function (s) { return s.status === "Labeled"; }).length;

  const chartData = [
    { name: "Unlabeled", value: unlabeled || (total === 0 ? 1 : 0) },
    { name: "In Review", value: inReview },
    { name: "Labeled", value: labeled }
  ];

  const barData = [
    { status: "Unlabeled", count: unlabeled },
    { status: "In Review", count: inReview },
    { status: "Labeled", count: labeled }
  ];

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
      <h1>Dataset Analytics</h1>
      <p>Live metrics and status distribution for current samples.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <div className="card">
          <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", fontWeight: 600 }}>Total Samples</span>
          <div style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--color-text)", marginTop: "4px" }}>{total}</div>
        </div>
        <div className="card">
          <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", fontWeight: 600 }}>Unlabeled</span>
          <div style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--color-unlabeled)", marginTop: "4px" }}>{unlabeled}</div>
        </div>
        <div className="card">
          <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", fontWeight: 600 }}>In Review</span>
          <div style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--color-in-review)", marginTop: "4px" }}>{inReview}</div>
        </div>
        <div className="card">
          <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)", fontWeight: 600 }}>Labeled</span>
          <div style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--color-labeled)", marginTop: "4px" }}>{labeled}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        <div className="card">
          <h3>Status Breakdown (Donut)</h3>
          <div style={{ width: "100%", height: 260 }}>
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
                  {chartData.map(function (entry, index) {
                    return <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />;
                  })}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>Distribution Count (Bar)</h3>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="status" stroke="var(--color-text-muted)" />
                <YAxis allowDecimals={false} stroke="var(--color-text-muted)" />
                <Tooltip />
                <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
