import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDriveApplicants, updateApplicationStatus } from "../../api/application.api";
import { useAuth } from "../../context/auth.context";

const statusOptions = ["applied", "shortlisted", "interview", "selected", "rejected"];

const statusColors = {
  applied:     { bg: "#dbeafe", color: "#1e40af" },
  shortlisted: { bg: "#fef9c3", color: "#854d0e" },
  interview:   { bg: "#ede9fe", color: "#5b21b6" },
  selected:    { bg: "#dcfce7", color: "#166534" },
  rejected:    { bg: "#fee2e2", color: "#991b1b" },
};

const DriveApplicants = () => {
  const { driveId } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    getDriveApplicants(driveId)
      .then((res) => setApplicants(res.data))
      .catch(() => setApplicants([]))
      .finally(() => setLoading(false));
  }, [driveId]);

  const handleStatusChange = async (appId, status) => {
    setUpdating(appId);
    try {
      const res = await updateApplicationStatus(appId, { status, currentRound: status.charAt(0).toUpperCase() + status.slice(1) });
      setApplicants((prev) => prev.map((a) => a._id === appId ? { ...a, status: res.data.status, currentRound: res.data.currentRound } : a));
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <span style={styles.brand}>Placement Tracker — TPO</span>
        <div style={styles.navlinks}>
          <button style={styles.navbtn} onClick={() => navigate("/tpo/dashboard")}>Back to Dashboard</button>
          <button style={styles.navbtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.container}>
        <h2 style={styles.heading}>Drive Applicants</h2>
        <p style={styles.sub}>{applicants.length} student{applicants.length !== 1 ? "s" : ""} applied</p>

        {loading ? <p>Loading...</p> : applicants.length === 0 ? (
          <p style={{ color: "#666" }}>No applicants yet for this drive.</p>
        ) : (
          <div style={styles.list}>
            {applicants.map((app) => {
              const sc = statusColors[app.status] || statusColors.applied;
              return (
                <div key={app._id} style={styles.card}>
                  <div style={styles.studentInfo}>
                    <div style={styles.avatar}>
                      {app.student?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={styles.name}>{app.student?.name}</p>
                      <p style={styles.email}>{app.student?.email}</p>
                      <div style={styles.tags}>
                        <span style={styles.tag}>CGPA: {app.student?.cgpa}</span>
                        <span style={styles.tag}>Branch: {app.student?.branch}</span>
                        <span style={styles.tag}>Backlogs: {app.student?.backlogsCount}</span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.rightSection}>
                    <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    <p style={styles.roundText}>Round: {app.currentRound}</p>
                    <select
                      style={styles.select}
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      disabled={updating === app._id}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
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

const styles = {
  page: { minHeight: "100vh", background: "#f5f7fa" },
  navbar: { background: "#1e40af", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" },
  brand: { color: "#fff", fontWeight: "600", fontSize: "18px" },
  navlinks: { display: "flex", gap: "12px" },
  navbtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" },
  container: { maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" },
  heading: { fontSize: "24px", fontWeight: "600", margin: "0 0 4px" },
  sub: { color: "#666", fontSize: "14px", margin: "0 0 2rem" },
  list: { display: "flex", flexDirection: "column", gap: "16px" },
  card: { background: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" },
  studentInfo: { display: "flex", alignItems: "center", gap: "16px" },
  avatar: { width: "48px", height: "48px", borderRadius: "50%", background: "#dbeafe", color: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "20px", flexShrink: 0 },
  name: { margin: "0 0 2px", fontWeight: "600", fontSize: "16px" },
  email: { margin: "0 0 8px", color: "#666", fontSize: "13px" },
  tags: { display: "flex", gap: "8px", flexWrap: "wrap" },
  tag: { background: "#f1f5f9", color: "#475569", fontSize: "12px", padding: "2px 10px", borderRadius: "20px" },
  rightSection: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" },
  statusBadge: { padding: "4px 14px", borderRadius: "20px", fontWeight: "500", fontSize: "13px" },
  roundText: { margin: 0, fontSize: "12px", color: "#888" },
  select: { padding: "6px 10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "13px", cursor: "pointer", background: "#fff" },
};

export default DriveApplicants;