import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyApplications } from "../../api/application.api";
import { useAuth } from "../../context/auth.context";

const statusColors = {
  applied:     { bg: "#dbeafe", color: "#1e40af" },
  shortlisted: { bg: "#fef9c3", color: "#854d0e" },
  interview:   { bg: "#ede9fe", color: "#5b21b6" },
  selected:    { bg: "#dcfce7", color: "#166534" },
  rejected:    { bg: "#fee2e2", color: "#991b1b" },
};

const MyApplications = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then((res) => setApplications(res.data))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <span style={styles.brand}>Placement Tracker</span>
        <div style={styles.navlinks}>
          <button style={styles.navbtn} onClick={() => navigate("/student/drives")}>Browse Drives</button>
          <button style={styles.navbtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.container}>
        <h2 style={styles.heading}>My Applications</h2>
        <p style={styles.sub}>Tracking {applications.length} application{applications.length !== 1 ? "s" : ""}</p>

        {loading ? (
          <p>Loading...</p>
        ) : applications.length === 0 ? (
          <div style={styles.empty}>
            <p>You haven't applied to any drives yet.</p>
            <button style={styles.applyBtn} onClick={() => navigate("/student/drives")}>Browse Drives</button>
          </div>
        ) : (
          <div style={styles.list}>
            {applications.map((app) => {
              const sc = statusColors[app.status] || statusColors.applied;
              return (
                <div key={app._id} style={styles.card}>
                  <div style={styles.cardLeft}>
                    <h3 style={styles.company}>{app.drive?.companyName}</h3>
                    <p style={styles.role}>{app.drive?.jobRole}</p>
                    <div style={styles.meta}>
                      <span>CTC: ₹{app.drive?.ctc?.toLocaleString()}</span>
                      <span>📍 {app.drive?.location}</span>
                      <span>Deadline: {new Date(app.drive?.deadline).toLocaleDateString()}</span>
                    </div>
                    <p style={styles.round}>Current Round: <strong>{app.currentRound}</strong></p>
                    <p style={styles.date}>Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={styles.cardRight}>
                    <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
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
  card: { background: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  cardLeft: { display: "flex", flexDirection: "column", gap: "6px" },
  cardRight: { flexShrink: 0, marginLeft: "1rem" },
  company: { margin: 0, fontSize: "18px", fontWeight: "600" },
  role: { margin: 0, color: "#2563eb", fontWeight: "500", fontSize: "15px" },
  meta: { display: "flex", gap: "16px", fontSize: "13px", color: "#555", flexWrap: "wrap" },
  round: { margin: 0, fontSize: "13px", color: "#444" },
  date: { margin: 0, fontSize: "12px", color: "#999" },
  statusBadge: { padding: "6px 16px", borderRadius: "20px", fontWeight: "500", fontSize: "13px" },
  empty: { textAlign: "center", padding: "3rem", color: "#666" },
  applyBtn: { marginTop: "1rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", cursor: "pointer" },
};

export default MyApplications;