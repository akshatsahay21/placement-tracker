import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDriveApplicants, updateApplicationStatus } from "../../api/application.api";
import Navbar from "../../components/Navbar";

const statusOptions = ["applied", "shortlisted", "interview", "selected", "rejected"];

const statusConfig = {
  applied:     { bg: "#eff6ff", color: "#1d4ed8" },
  shortlisted: { bg: "#fefce8", color: "#a16207" },
  interview:   { bg: "#f5f3ff", color: "#6d28d9" },
  selected:    { bg: "#f0fdf4", color: "#15803d" },
  rejected:    { bg: "#fef2f2", color: "#dc2626" },
};

const DriveApplicants = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getDriveApplicants(driveId)
      .then((res) => setApplicants(res.data))
      .catch(() => setApplicants([]))
      .finally(() => setLoading(false));
  }, [driveId]);

  const handleStatusChange = async (appId, status) => {
    setUpdating(appId);
    try {
      const res = await updateApplicationStatus(appId, {
        status,
        currentRound: status.charAt(0).toUpperCase() + status.slice(1),
      });
      setApplicants((prev) =>
        prev.map((a) => a._id === appId ? { ...a, status: res.data.status, currentRound: res.data.currentRound } : a)
      );
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === "all" ? applicants : applicants.filter(a => a.status === filter);

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <div style={s.pageHeader}>
          <div>
            <button style={s.backBtn} onClick={() => navigate("/tpo/dashboard")}>← Back to Dashboard</button>
            <h1 style={s.heading}>Drive Applicants</h1>
            <p style={s.sub}>{applicants.length} student{applicants.length !== 1 ? "s" : ""} applied</p>
          </div>
          <div style={s.statsRow}>
            {["applied", "shortlisted", "interview", "selected", "rejected"].map((st) => (
              <div key={st} style={s.miniStat}>
                <span style={s.miniNum}>{applicants.filter(a => a.status === st).length}</span>
                <span style={s.miniLabel}>{st.charAt(0).toUpperCase() + st.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={s.filterRow}>
          {["all", ...statusOptions].map((f) => (
            <button
              key={f}
              style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} {f !== "all" && `(${applicants.filter(a => a.status === f).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={s.loadingBox}>Loading applicants...</div>
        ) : filtered.length === 0 ? (
          <div style={s.emptyBox}>No applicants in this category.</div>
        ) : (
          <div style={s.grid}>
            {filtered.map((app) => {
              const sc = statusConfig[app.status] || statusConfig.applied;
              return (
                <div key={app._id} style={s.card}>
                  <div style={s.cardTop}>
                    <div style={s.avatar}>{app.student?.name?.charAt(0).toUpperCase()}</div>
                    <div style={s.nameBlock}>
                      <p style={s.name}>{app.student?.name}</p>
                      <p style={s.email}>{app.student?.email}</p>
                    </div>
                    <span style={{ ...s.statusBadge, background: sc.bg, color: sc.color }}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>

                  <div style={s.tagsRow}>
                    <span style={s.tag}>CGPA: <strong>{app.student?.cgpa}</strong></span>
                    <span style={s.tag}>Branch: <strong>{app.student?.branch}</strong></span>
                    <span style={s.tag}>Backlogs: <strong>{app.student?.backlogsCount}</strong></span>
                  </div>

                  <div style={s.roundRow}>
                    <span style={s.roundLabel}>Current round</span>
                    <span style={s.roundVal}>{app.currentRound}</span>
                  </div>

                  <div style={s.selectRow}>
                    <label style={s.selectLabel}>Update status</label>
                    <select
                      style={s.select}
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      disabled={updating === app._id}
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st}>{st.charAt(0).toUpperCase() + st.slice(1)}</option>
                      ))}
                    </select>
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
  container: { maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" },
  backBtn: { background: "none", border: "none", color: "#64748b", fontSize: "13px", cursor: "pointer", padding: "0 0 8px", display: "block" },
  heading: { fontSize: "26px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px" },
  sub: { fontSize: "14px", color: "#64748b", margin: 0 },
  statsRow: { display: "flex", gap: "10px", flexWrap: "wrap" },
  miniStat: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 14px", textAlign: "center", minWidth: "70px" },
  miniNum: { display: "block", fontSize: "20px", fontWeight: "700", color: "#1e40af" },
  miniLabel: { display: "block", fontSize: "11px", color: "#94a3b8" },
  filterRow: { display: "flex", gap: "8px", marginBottom: "1.5rem", flexWrap: "wrap" },
  filterBtn: { padding: "7px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", fontSize: "13px", color: "#64748b", cursor: "pointer", fontWeight: "500" },
  filterActive: { background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", fontWeight: "600" },
  loadingBox: { textAlign: "center", padding: "4rem", color: "#94a3b8" },
  emptyBox: { textAlign: "center", padding: "3rem", color: "#94a3b8", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" },
  card: { background: "#fff", borderRadius: "16px", padding: "1.25rem", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "14px" },
  cardTop: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: { width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #eff6ff, #dbeafe)", color: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "700", flexShrink: 0 },
  nameBlock: { flex: 1 },
  name: { margin: 0, fontWeight: "600", fontSize: "15px", color: "#0f172a" },
  email: { margin: 0, fontSize: "12px", color: "#94a3b8" },
  statusBadge: { padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", flexShrink: 0 },
  tagsRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  tag: { background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", fontSize: "12px", padding: "4px 10px", borderRadius: "8px" },
  roundRow: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", borderRadius: "8px", padding: "10px 12px" },
  roundLabel: { fontSize: "12px", color: "#94a3b8", fontWeight: "500" },
  roundVal: { fontSize: "13px", fontWeight: "600", color: "#0f172a" },
  selectRow: { display: "flex", flexDirection: "column", gap: "6px" },
  selectLabel: { fontSize: "12px", color: "#94a3b8", fontWeight: "500" },
  select: { padding: "9px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", color: "#0f172a", background: "#fff", cursor: "pointer", outline: "none" },
};

export default DriveApplicants;