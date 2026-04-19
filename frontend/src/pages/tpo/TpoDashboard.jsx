import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDrives, deleteDrive } from "../../api/drive.api";
import { useAuth } from "../../context/auth.context";

const TpoDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDrives = () => {
    getAllDrives()
      .then((res) => setDrives(res.data))
      .catch(() => setDrives([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDrives(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this drive?")) return;
    try {
      await deleteDrive(id);
      setDrives((prev) => prev.filter((d) => d._id !== id));
    } catch {
      alert("Failed to delete drive");
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <span style={styles.brand}>Placement Tracker — TPO</span>
        <div style={styles.navlinks}>
          <button style={styles.navbtn} onClick={() => navigate("/tpo/drives")}>+ New Drive</button>
          <button style={styles.navbtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.heading}>All Placement Drives</h2>
            <p style={styles.sub}>Welcome, {user?.name}</p>
          </div>
          <div style={styles.stats}>
            <div style={styles.statCard}>
              <p style={styles.statNum}>{drives.length}</p>
              <p style={styles.statLabel}>Total Drives</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statNum}>{drives.filter(d => d.status === "active").length}</p>
              <p style={styles.statLabel}>Active</p>
            </div>
          </div>
        </div>

        {loading ? <p>Loading...</p> : drives.length === 0 ? (
          <div style={styles.empty}>
            <p>No drives yet.</p>
            <button style={styles.createBtn} onClick={() => navigate("/tpo/drives")}>Create First Drive</button>
          </div>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Company</span>
              <span>Role</span>
              <span>CTC</span>
              <span>Deadline</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {drives.map((drive) => (
              <div key={drive._id} style={styles.tableRow}>
                <span style={styles.company}>{drive.companyName}</span>
                <span>{drive.jobRole}</span>
                <span>₹{drive.ctc?.toLocaleString()}</span>
                <span>{new Date(drive.deadline).toLocaleDateString()}</span>
                <span>
                  <span style={drive.status === "active" ? styles.activeTag : styles.closedTag}>
                    {drive.status}
                  </span>
                </span>
                <span style={styles.actions}>
                  <button
                    style={styles.viewBtn}
                    onClick={() => navigate(`/tpo/drives/${drive._id}/applicants`)}
                  >
                    View Applicants
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(drive._id)}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: "100vh", background: "#f5f7fa" },
  navbar: { background: "#1e40af", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" },
  brand: { color: "#fff", fontWeight: "600", fontSize: "18px" },
  navlinks: { display: "flex", gap: "12px" },
  navbtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" },
  heading: { fontSize: "24px", fontWeight: "600", margin: "0 0 4px" },
  sub: { color: "#666", fontSize: "14px", margin: 0 },
  stats: { display: "flex", gap: "12px" },
  statCard: { background: "#fff", borderRadius: "10px", padding: "1rem 1.5rem", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", minWidth: "100px" },
  statNum: { margin: 0, fontSize: "28px", fontWeight: "700", color: "#1e40af" },
  statLabel: { margin: 0, fontSize: "12px", color: "#666" },
  table: { background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", overflow: "hidden" },
  tableHeader: { display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 0.8fr 1.5fr", padding: "1rem 1.5rem", background: "#f8fafc", fontSize: "13px", fontWeight: "600", color: "#555", borderBottom: "1px solid #e5e7eb" },
  tableRow: { display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 0.8fr 1.5fr", padding: "1rem 1.5rem", fontSize: "14px", borderBottom: "1px solid #f1f5f9", alignItems: "center" },
  company: { fontWeight: "500" },
  activeTag: { background: "#dcfce7", color: "#166534", fontSize: "12px", padding: "2px 10px", borderRadius: "20px" },
  closedTag: { background: "#f1f5f9", color: "#64748b", fontSize: "12px", padding: "2px 10px", borderRadius: "20px" },
  actions: { display: "flex", gap: "8px" },
  viewBtn: { background: "#eff6ff", color: "#1d4ed8", border: "none", borderRadius: "6px", padding: "5px 10px", fontSize: "12px", cursor: "pointer", fontWeight: "500" },
  deleteBtn: { background: "#fff0f0", color: "#dc2626", border: "none", borderRadius: "6px", padding: "5px 10px", fontSize: "12px", cursor: "pointer", fontWeight: "500" },
  empty: { textAlign: "center", padding: "3rem", color: "#666" },
  createBtn: { marginTop: "1rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", cursor: "pointer" },
};

export default TpoDashboard;