import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyApplications } from "../../api/application.api";
import Navbar from "../../components/Navbar";

const statusConfig = {
  applied:     { bg: "#eff6ff", color: "#1d4ed8", label: "Applied" },
  shortlisted: { bg: "#fefce8", color: "#a16207", label: "Shortlisted" },
  interview:   { bg: "#f5f3ff", color: "#6d28d9", label: "Interview" },
  selected:    { bg: "#f0fdf4", color: "#15803d", label: "Selected ✓" },
  rejected:    { bg: "#fef2f2", color: "#dc2626", label: "Rejected" },
};

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then((res) => setApplications(res.data))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total: applications.length,
    selected: applications.filter(a => a.status === "selected").length,
    active: applications.filter(a => !["selected", "rejected"].includes(a.status)).length,
  };

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.heading}>My Applications</h1>
            <p style={s.sub}>Track your placement journey</p>
          </div>
          <div style={s.statsRow}>
            {[
              { num: counts.total, label: "Applied" },
              { num: counts.active, label: "In Progress" },
              { num: counts.selected, label: "Selected" },
            ].map((st) => (
              <div key={st.label} style={s.stat}>
                <span style={{ ...s.statNum, ...(st.label === "Selected" && st.num > 0 ? { color: "#15803d" } : {}) }}>{st.num}</span>
                <span style={s.statLabel}>{st.label}</span>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={s.loadingBox}>Loading your applications...</div>
        ) : applications.length === 0 ? (
          <div style={s.emptyBox}>
            <p style={s.emptyTitle}>No applications yet</p>
            <p style={s.emptySub}>Browse available drives and apply to get started</p>
            <button style={s.browseBtn} onClick={() => navigate("/student/drives")}>Browse Drives →</button>
          </div>
        ) : (
          <div style={s.list}>
            {applications.map((app) => {
              const sc = statusConfig[app.status] || statusConfig.applied;
              return (
                <div key={app._id} style={s.card}>
                  <div style={s.cardLeft}>
                    <div style={s.companyLogo}>{app.drive?.companyName?.charAt(0)}</div>
                    <div style={s.cardInfo}>
                      <div style={s.cardTop}>
                        <h3 style={s.company}>{app.drive?.companyName}</h3>
                        <span style={{ ...s.statusBadge, background: sc.bg, color: sc.color }}>{sc.label}</span>
                      </div>
                      <p style={s.role}>{app.drive?.jobRole}</p>
                      <div style={s.metaRow}>
                        <span style={s.metaItem}>₹{((app.drive?.ctc || 0) / 100000).toFixed(1)} LPA</span>
                        <span style={s.dot}>·</span>
                        <span style={s.metaItem}>📍 {app.drive?.location}</span>
                        <span style={s.dot}>·</span>
                        <span style={s.metaItem}>Deadline: {new Date(app.drive?.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    </div>
                  </div>

                  <div style={s.cardRight}>
                    <div style={s.roundBox}>
                      <span style={s.roundLabel}>Current Round</span>
                      <span style={s.roundVal}>{app.currentRound}</span>
                    </div>
                    <span style={s.appliedDate}>Applied {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "#f8fafc" },
  container: { maxWidth: "1000px", margin: "0 auto", padding: "2rem 1.5rem" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" },
  heading: { fontSize: "26px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px" },
  sub: { fontSize: "14px", color: "#64748b", margin: 0 },
  statsRow: { display: "flex", gap: "12px" },
  stat: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px 20px", textAlign: "center", minWidth: "90px" },
  statNum: { display: "block", fontSize: "24px", fontWeight: "700", color: "#1e40af" },
  statLabel: { display: "block", fontSize: "12px", color: "#94a3b8", marginTop: "2px" },
  loadingBox: { textAlign: "center", padding: "4rem", color: "#94a3b8" },
  emptyBox: { textAlign: "center", padding: "4rem", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" },
  emptyTitle: { fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "8px" },
  emptySub: { fontSize: "14px", color: "#64748b", marginBottom: "1.5rem" },
  browseBtn: { padding: "10px 24px", borderRadius: "10px", background: "linear-gradient(135deg, #1e40af, #2563eb)", color: "#fff", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  list: { display: "flex", flexDirection: "column", gap: "14px" },
  card: { background: "#fff", borderRadius: "16px", padding: "1.25rem 1.5rem", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  cardLeft: { display: "flex", alignItems: "center", gap: "16px", flex: 1 },
  companyLogo: { width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #eff6ff, #dbeafe)", color: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "800", flexShrink: 0 },
  cardInfo: { flex: 1 },
  cardTop: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" },
  company: { margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" },
  statusBadge: { padding: "3px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  role: { margin: "0 0 8px", fontSize: "13px", color: "#64748b" },
  metaRow: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  metaItem: { fontSize: "13px", color: "#64748b" },
  dot: { color: "#cbd5e1" },
  cardRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 },
  roundBox: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "8px 14px", textAlign: "right" },
  roundLabel: { display: "block", fontSize: "11px", color: "#94a3b8", fontWeight: "500", marginBottom: "2px" },
  roundVal: { display: "block", fontSize: "13px", fontWeight: "600", color: "#0f172a" },
  appliedDate: { fontSize: "12px", color: "#94a3b8" },
};

export default MyApplications;