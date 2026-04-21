import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDrives, deleteDrive } from "../../api/drive.api";
import { useAuth } from "../../context/auth.context";
import Navbar from "../../components/Navbar";

const TpoDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDrives()
      .then((res) => setDrives(res.data))
      .catch(() => setDrives([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this drive? This cannot be undone.")) return;
    try {
      await deleteDrive(id);
      setDrives((prev) => prev.filter((d) => d._id !== id));
    } catch {
      alert("Failed to delete drive");
    }
  };

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.heading}>Placement Drives</h1>
            <p style={s.sub}>Welcome back, <strong>{user?.name}</strong></p>
          </div>
          <button style={s.newBtn} onClick={() => navigate("/tpo/drives")}>+ New Drive</button>
        </div>

        <div style={s.statsRow}>
          {[
            { num: drives.length, label: "Total Drives", color: "#1e40af" },
            { num: drives.filter(d => d.status === "active").length, label: "Active", color: "#15803d" },
            { num: drives.filter(d => d.status === "closed").length, label: "Closed", color: "#64748b" },
          ].map((st) => (
            <div key={st.label} style={s.statCard}>
              <span style={{ ...s.statNum, color: st.color }}>{st.num}</span>
              <span style={s.statLabel}>{st.label}</span>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={s.loadingBox}>Loading drives...</div>
        ) : drives.length === 0 ? (
          <div style={s.emptyBox}>
            <p style={s.emptyTitle}>No drives yet</p>
            <p style={s.emptySub}>Create your first placement drive to get started</p>
            <button style={s.newBtn} onClick={() => navigate("/tpo/drives")}>+ Create Drive</button>
          </div>
        ) : (
          <div style={s.tableWrap}>
            <div style={s.tableHead}>
              <span>Company & Role</span>
              <span>CTC</span>
              <span>Deadline</span>
              <span>Eligibility</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {drives.map((drive) => (
              <div key={drive._id} style={s.tableRow}>
                <div style={s.companyCell}>
                  <div style={s.companyLogo}>{drive.companyName?.charAt(0)}</div>
                  <div>
                    <p style={s.companyName}>{drive.companyName}</p>
                    <p style={s.jobRole}>{drive.jobRole}</p>
                  </div>
                </div>
                <span style={s.ctc}>₹{(drive.ctc / 100000).toFixed(1)} LPA</span>
                <span style={s.cell}>
                  {new Date(drive.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <div style={s.eligCell}>
                  <span style={s.eligPill}>CGPA {drive.eligibility?.minCgpa}+</span>
                  <span style={s.eligPill}>{drive.eligibility?.allowedBranches?.join(", ") || "All"}</span>
                </div>
                <span style={drive.status === "active" ? s.activeBadge : s.closedBadge}>
                  {drive.status}
                </span>
                <div style={s.actions}>
                  <button style={s.viewBtn} onClick={() => navigate(`/tpo/drives/${drive._id}/applicants`)}>
                    View Applicants
                  </button>
                  <button style={s.deleteBtn} onClick={() => handleDelete(drive._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "#f8fafc" },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" },
  heading: { fontSize: "26px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px" },
  sub: { fontSize: "14px", color: "#64748b", margin: 0 },
  newBtn: { padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #1e40af, #2563eb)", color: "#fff", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  statsRow: { display: "flex", gap: "14px", marginBottom: "2rem" },
  statCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.25rem 2rem", display: "flex", flexDirection: "column", gap: "4px" },
  statNum: { fontSize: "32px", fontWeight: "700" },
  statLabel: { fontSize: "13px", color: "#94a3b8" },
  loadingBox: { textAlign: "center", padding: "4rem", color: "#94a3b8" },
  emptyBox: { textAlign: "center", padding: "4rem", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" },
  emptyTitle: { fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "8px" },
  emptySub: { fontSize: "14px", color: "#64748b", marginBottom: "1.5rem" },
  tableWrap: { background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" },
  tableHead: { display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1.5fr 0.8fr 1.5fr", padding: "14px 20px", background: "#f8fafc", fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" },
  tableRow: { display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1.5fr 0.8fr 1.5fr", padding: "16px 20px", borderBottom: "1px solid #f1f5f9", alignItems: "center", fontSize: "14px" },
  companyCell: { display: "flex", alignItems: "center", gap: "12px" },
  companyLogo: { width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #eff6ff, #dbeafe)", color: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "800", flexShrink: 0 },
  companyName: { margin: 0, fontWeight: "600", color: "#0f172a", fontSize: "14px" },
  jobRole: { margin: 0, fontSize: "12px", color: "#64748b" },
  ctc: { fontWeight: "600", color: "#0f172a" },
  cell: { color: "#64748b", fontSize: "13px" },
  eligCell: { display: "flex", flexDirection: "column", gap: "4px" },
  eligPill: { background: "#f1f5f9", color: "#475569", fontSize: "11px", padding: "2px 8px", borderRadius: "6px", display: "inline-block", width: "fit-content" },
  activeBadge: { background: "#f0fdf4", color: "#15803d", fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "20px", display: "inline-block", width: "fit-content" },
  closedBadge: { background: "#f1f5f9", color: "#64748b", fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "20px", display: "inline-block", width: "fit-content" },
  actions: { display: "flex", gap: "8px" },
  viewBtn: { padding: "6px 12px", borderRadius: "8px", background: "#eff6ff", color: "#1d4ed8", border: "none", fontSize: "12px", fontWeight: "600", cursor: "pointer" },
  deleteBtn: { padding: "6px 12px", borderRadius: "8px", background: "#fef2f2", color: "#dc2626", border: "none", fontSize: "12px", fontWeight: "600", cursor: "pointer" },
};

export default TpoDashboard;