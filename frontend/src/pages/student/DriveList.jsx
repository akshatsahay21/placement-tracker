import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDrives } from "../../api/drive.api";
import { applyToDrive } from "../../api/application.api";
import { useAuth } from "../../context/auth.context";
import Navbar from "../../components/Navbar";
import ResumeMatch from "../../components/ResumeMatch";
import { getMyApplications } from "../../api/application.api";

const DriveList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [messages, setMessages] = useState({});
  const [matchDrive, setMatchDrive] = useState(null);

  useEffect(() => {
  getAllDrives()
    .then((res) => setDrives(res.data))
    .catch(() => setDrives([]))
    .finally(() => setLoading(false));

  getMyApplications()
    .then((res) => {
      const applied = {};
      res.data.forEach((app) => {
        applied[app.drive._id] = { type: "success", text: "Already applied" };
      });
      setMessages(applied);
    })
    .catch(() => {});
}, []);

  const handleApply = async (driveId) => {
    setApplyingId(driveId);
    try {
      await applyToDrive(driveId);
      setMessages((prev) => ({ ...prev, [driveId]: { type: "success", text: "Applied successfully!" } }));
    } catch (err) {
      setMessages((prev) => ({ ...prev, [driveId]: { type: "error", text: err.response?.data?.message || "Apply failed" } }));
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.heading}>Available Drives</h1>
            <p style={s.sub}>Welcome back, <strong>{user?.name}</strong> · CGPA {user?.cgpa} · {user?.branch}</p>
          </div>
          <div style={s.statsRow}>
            <div style={s.stat}>
              <span style={s.statNum}>{drives.length}</span>
              <span style={s.statLabel}>Open drives</span>
            </div>
            <div style={s.stat}>
              <span style={s.statNum}>{drives.filter(d => d.eligibility?.minCgpa <= (user?.cgpa || 0)).length}</span>
              <span style={s.statLabel}>You're eligible</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={s.loadingBox}>Loading drives...</div>
        ) : drives.length === 0 ? (
          <div style={s.emptyBox}>No active drives at the moment. Check back soon!</div>
        ) : (
          <div style={s.grid}>
            {drives.map((drive) => {
              const eligible = drive.eligibility?.minCgpa <= (user?.cgpa || 0);
              const msg = messages[drive._id];
              return (
                <div key={drive._id} style={s.card}>
                  <div style={s.cardHeader}>
                    <div style={s.companyLogo}>{drive.companyName?.charAt(0)}</div>
                    <div style={s.cardHeaderText}>
                      <h3 style={s.company}>{drive.companyName}</h3>
                      <p style={s.role}>{drive.jobRole}</p>
                    </div>
                    <span style={s.activeBadge}>Active</span>
                  </div>

                  <div style={s.ctcRow}>
                    <span style={s.ctc}>₹{(drive.ctc / 100000).toFixed(1)} LPA</span>
                    <span style={s.location}>📍 {drive.location}</span>
                  </div>

                  <div style={s.infoGrid}>
                    <div style={s.infoItem}>
                      <span style={s.infoLabel}>Min CGPA</span>
                      <span style={s.infoVal}>{drive.eligibility?.minCgpa}</span>
                    </div>
                    <div style={s.infoItem}>
                      <span style={s.infoLabel}>Branches</span>
                      <span style={s.infoVal}>{drive.eligibility?.allowedBranches?.join(", ") || "All"}</span>
                    </div>
                    <div style={s.infoItem}>
                      <span style={s.infoLabel}>Max Backlogs</span>
                      <span style={s.infoVal}>{drive.eligibility?.maxBacklogs}</span>
                    </div>
                    <div style={s.infoItem}>
                      <span style={s.infoLabel}>Deadline</span>
                      <span style={s.infoVal}>{new Date(drive.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    </div>
                  </div>

                  <div style={s.rounds}>
                    {drive.rounds?.map((r, i) => (
                      <span key={i} style={s.roundPill}>{r}</span>
                    ))}
                  </div>

                  {msg && (
                    <div style={msg.type === "success" ? s.successMsg : s.errorMsg}>{msg.text}</div>
                  )}

                  {!eligible && !msg && (
                    <div style={s.ineligibleMsg}>Your CGPA doesn't meet the requirement</div>
                  )}

                  <div style={s.btnRow}>
                    <button
                      style={s.matchBtn}
                      onClick={() => setMatchDrive(drive)}
                    >
                      🤖 AI Match
                    </button>
                    <button
                      style={{ ...s.applyBtn, ...((!eligible || msg?.type === "success") ? s.applyBtnDisabled : {}) }}
                      onClick={() => handleApply(drive._id)}
                      disabled={applyingId === drive._id || !eligible || msg?.type === "success"}
                    >
                      {applyingId === drive._id ? "Applying..." : msg?.type === "success" ? "Applied ✓" : !eligible ? "Not Eligible" : "Apply Now →"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {matchDrive && <ResumeMatch drive={matchDrive} onClose={() => setMatchDrive(null)} />}
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "#f8fafc" },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" },
  heading: { fontSize: "26px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px" },
  sub: { fontSize: "14px", color: "#64748b", margin: 0 },
  statsRow: { display: "flex", gap: "12px" },
  stat: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px 20px", textAlign: "center", minWidth: "100px" },
  statNum: { display: "block", fontSize: "24px", fontWeight: "700", color: "#1e40af" },
  statLabel: { display: "block", fontSize: "12px", color: "#94a3b8", marginTop: "2px" },
  loadingBox: { textAlign: "center", padding: "4rem", color: "#94a3b8", fontSize: "15px" },
  emptyBox: { textAlign: "center", padding: "4rem", color: "#94a3b8", fontSize: "15px", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" },
  card: { background: "#fff", borderRadius: "16px", padding: "1.5rem", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  cardHeader: { display: "flex", alignItems: "center", gap: "12px" },
  companyLogo: { width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #eff6ff, #dbeafe)", color: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "800", flexShrink: 0 },
  cardHeaderText: { flex: 1 },
  company: { margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" },
  role: { margin: 0, fontSize: "13px", color: "#64748b" },
  activeBadge: { background: "#dcfce7", color: "#166534", fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px" },
  ctcRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  ctc: { fontSize: "22px", fontWeight: "700", color: "#0f172a" },
  location: { fontSize: "13px", color: "#64748b" },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "#f8fafc", borderRadius: "10px", padding: "12px" },
  infoItem: { display: "flex", flexDirection: "column", gap: "2px" },
  infoLabel: { fontSize: "11px", color: "#94a3b8", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em" },
  infoVal: { fontSize: "13px", color: "#0f172a", fontWeight: "500" },
  rounds: { display: "flex", gap: "6px", flexWrap: "wrap" },
  roundPill: { background: "#eff6ff", color: "#1d4ed8", fontSize: "12px", padding: "3px 10px", borderRadius: "20px", fontWeight: "500" },
  successMsg: { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", padding: "8px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "500" },
  errorMsg: { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "8px 12px", borderRadius: "8px", fontSize: "13px" },
  ineligibleMsg: { background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa", padding: "8px 12px", borderRadius: "8px", fontSize: "13px" },
  btnRow: { display: "flex", gap: "10px", marginTop: "auto" },
  matchBtn: { flex: "0 0 auto", padding: "11px 16px", borderRadius: "10px", background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
  applyBtn: { flex: 1, padding: "11px", borderRadius: "10px", background: "linear-gradient(135deg, #1e40af, #2563eb)", color: "#fff", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  applyBtnDisabled: { background: "#e2e8f0", color: "#94a3b8", cursor: "not-allowed" },
};

export default DriveList;