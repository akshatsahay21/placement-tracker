import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAnalytics } from "../../api/application.api";
import Navbar from "../../components/Navbar";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Analytics = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={s.page}><Navbar /><div style={s.loading}>Loading analytics...</div></div>
  );

  if (!data) return (
    <div style={s.page}><Navbar /><div style={s.loading}>Failed to load analytics</div></div>
  );

  const statusChart = {
    labels: ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"],
    datasets: [{
      data: [
        data.statusBreakdown.applied,
        data.statusBreakdown.shortlisted,
        data.statusBreakdown.interview,
        data.statusBreakdown.selected,
        data.statusBreakdown.rejected,
      ],
      backgroundColor: ["#93c5fd", "#fde047", "#c4b5fd", "#86efac", "#fca5a5"],
      borderWidth: 0,
    }],
  };

  const branchLabels = Object.keys(data.branchStats);
  const branchChart = {
    labels: branchLabels,
    datasets: [
      {
        label: "Total Applications",
        data: branchLabels.map(b => data.branchStats[b].total),
        backgroundColor: "#93c5fd",
        borderRadius: 6,
      },
      {
        label: "Selected",
        data: branchLabels.map(b => data.branchStats[b].selected),
        backgroundColor: "#86efac",
        borderRadius: 6,
      },
    ],
  };

  const companyLabels = Object.keys(data.companyStats);
  const companyChart = {
    labels: companyLabels,
    datasets: [
      {
        label: "Applicants",
        data: companyLabels.map(c => data.companyStats[c].total),
        backgroundColor: "#c4b5fd",
        borderRadius: 6,
      },
      {
        label: "Selected",
        data: companyLabels.map(c => data.companyStats[c].selected),
        backgroundColor: "#86efac",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.heading}>Placement Analytics</h1>
            <p style={s.sub}>Overview of placement data across all drives</p>
          </div>
          <button style={s.backBtn} onClick={() => navigate("/tpo/dashboard")}>← Dashboard</button>
        </div>

        <div style={s.statsGrid}>
          {[
            { num: data.totalStudents, label: "Total Students", color: "#1e40af" },
            { num: data.totalApplications, label: "Total Applications", color: "#6d28d9" },
            { num: data.placed, label: "Students Placed", color: "#15803d" },
            { num: `${data.placementRate}%`, label: "Placement Rate", color: "#c2410c" },
          ].map((st) => (
            <div key={st.label} style={s.statCard}>
              <span style={{ ...s.statNum, color: st.color }}>{st.num}</span>
              <span style={s.statLabel}>{st.label}</span>
            </div>
          ))}
        </div>

        <div style={s.chartsGrid}>
          <div style={s.chartCard}>
            <h3 style={s.chartTitle}>Application Status Breakdown</h3>
            <div style={s.doughnutWrap}>
              <Doughnut data={statusChart} options={{ plugins: { legend: { position: "bottom" } }, cutout: "65%" }} />
            </div>
          </div>

          <div style={s.chartCard}>
            <h3 style={s.chartTitle}>Applications by Branch</h3>
            <Bar data={branchChart} options={chartOptions} />
          </div>

          <div style={{ ...s.chartCard, gridColumn: "1 / -1" }}>
            <h3 style={s.chartTitle}>Company-wise Recruitment</h3>
            <Bar data={companyChart} options={chartOptions} />
          </div>
        </div>

        <div style={s.tableCard}>
          <h3 style={s.chartTitle}>Company Summary</h3>
          <div style={s.tableWrap}>
            <div style={s.tableHead}>
              <span>Company</span>
              <span>Total Applicants</span>
              <span>Selected</span>
              <span>CTC</span>
              <span>Conversion Rate</span>
            </div>
            {companyLabels.map((company) => {
              const stat = data.companyStats[company];
              const rate = stat.total > 0 ? Math.round((stat.selected / stat.total) * 100) : 0;
              return (
                <div key={company} style={s.tableRow}>
                  <span style={s.companyName}>{company}</span>
                  <span>{stat.total}</span>
                  <span style={{ color: "#15803d", fontWeight: "600" }}>{stat.selected}</span>
                  <span>₹{(stat.ctc / 100000).toFixed(1)} LPA</span>
                  <div style={s.rateCell}>
                    <div style={s.rateBar}>
                      <div style={{ ...s.rateFill, width: `${rate}%` }} />
                    </div>
                    <span style={s.rateText}>{rate}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "#f8fafc" },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" },
  loading: { textAlign: "center", padding: "4rem", color: "#94a3b8" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" },
  heading: { fontSize: "26px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px" },
  sub: { fontSize: "14px", color: "#64748b", margin: 0 },
  backBtn: { padding: "9px 18px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#fff", fontSize: "13px", color: "#64748b", cursor: "pointer", fontWeight: "500" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "2rem" },
  statCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "6px" },
  statNum: { fontSize: "36px", fontWeight: "800" },
  statLabel: { fontSize: "13px", color: "#94a3b8" },
  chartsGrid: { display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px", marginBottom: "16px" },
  chartCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "1.5rem" },
  chartTitle: { fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 1.5rem" },
  doughnutWrap: { maxWidth: "280px", margin: "0 auto" },
  tableCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "1.5rem" },
  tableWrap: { marginTop: "1rem" },
  tableHead: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 2fr", padding: "10px 16px", background: "#f8fafc", borderRadius: "10px", fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" },
  tableRow: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 2fr", padding: "12px 16px", borderBottom: "1px solid #f1f5f9", alignItems: "center", fontSize: "14px" },
  companyName: { fontWeight: "600", color: "#0f172a" },
  rateCell: { display: "flex", alignItems: "center", gap: "10px" },
  rateBar: { flex: 1, height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" },
  rateFill: { height: "100%", background: "linear-gradient(90deg, #1e40af, #2563eb)", borderRadius: "3px", transition: "width 0.5s" },
  rateText: { fontSize: "12px", fontWeight: "600", color: "#64748b", minWidth: "32px" },
};

export default Analytics;