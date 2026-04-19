import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDrives } from "../../api/drive.api";
import { applyToDrive } from "../../api/application.api";
import { useAuth } from "../../context/auth.context";

const DriveList = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [messages, setMessages] = useState({});

  useEffect(() => {
    getAllDrives()
      .then((res) => setDrives(res.data))
      .catch(() => setDrives([]))
      .finally(() => setLoading(false));
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

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <span style={styles.brand}>Placement Tracker</span>
        <div style={styles.navlinks}>
          <button style={styles.navbtn} onClick={() => navigate("/student/applications")}>My Applications</button>
          <button style={styles.navbtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.container}>
        <h2 style={styles.heading}>Available Drives</h2>
        <p style={styles.sub}>Welcome, {user?.name} | CGPA: {user?.cgpa} | Branch: {user?.branch}</p>

        {loading ? (
          <p>Loading drives...</p>
        ) : drives.length === 0 ? (
          <p>No active drives at the moment.</p>
        ) : (
          <div style={styles.grid}>
            {drives.map((drive) => (
              <div key={drive._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <h3 style={styles.company}>{drive.companyName}</h3>
                  <span style={styles.badge}>{drive.status}</span>
                </div>
                <p style={styles.role}>{drive.jobRole}</p>
                <div style={styles.details}>
                  <span>CTC: ₹{drive.ctc?.toLocaleString()}</span>
                  <span>📍 {drive.location}</span>
                  <span>Deadline: {new Date(drive.deadline).toLocaleDateString()}</span>
                </div>
                <div style={styles.eligibility}>
                  <span>Min CGPA: {drive.eligibility?.minCgpa}</span>
                  <span>Branches: {drive.eligibility?.allowedBranches?.join(", ") || "All"}</span>
                  <span>Max Backlogs: {drive.eligibility?.maxBacklogs}</span>
                </div>
                <div style={styles.rounds}>
                  Rounds: {drive.rounds?.join(" → ")}
                </div>
                {messages[drive._id] && (
                  <p style={messages[drive._id].type === "success" ? styles.success : styles.error}>
                    {messages[drive._id].text}
                  </p>
                )}
                <button
                  style={styles.applyBtn}
                  onClick={() => handleApply(drive._id)}
                  disabled={applyingId === drive._id}
                >
                  {applyingId === drive._id ? "Applying..." : "Apply Now"}
                </button>
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
  heading: { fontSize: "24px", fontWeight: "600", margin: "0 0 4px" },
  sub: { color: "#666", fontSize: "14px", margin: "0 0 2rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" },
  card: { background: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: "10px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  company: { margin: 0, fontSize: "18px", fontWeight: "600" },
  badge: { background: "#dcfce7", color: "#166534", fontSize: "12px", padding: "2px 10px", borderRadius: "20px", fontWeight: "500" },
  role: { margin: 0, color: "#2563eb", fontWeight: "500", fontSize: "15px" },
  details: { display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", color: "#555" },
  eligibility: { background: "#f8fafc", borderRadius: "8px", padding: "10px", display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", color: "#444" },
  rounds: { fontSize: "13px", color: "#666" },
  applyBtn: { marginTop: "auto", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: "500", cursor: "pointer" },
  success: { color: "#166534", background: "#dcfce7", padding: "8px", borderRadius: "6px", fontSize: "13px", margin: 0 },
  error: { color: "#991b1b", background: "#fee2e2", padding: "8px", borderRadius: "6px", fontSize: "13px", margin: 0 },
};

export default DriveList;