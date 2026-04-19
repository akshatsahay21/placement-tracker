import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth.context";

const studentLinks = [
  { label: "Browse Drives", path: "/student/drives" },
  { label: "My Applications", path: "/student/applications" },
];

const tpoLinks = [
  { label: "Dashboard", path: "/tpo/dashboard" },
  { label: "New Drive", path: "/tpo/drives" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = user?.role === "student" ? studentLinks : user?.role === "tpo" ? tpoLinks : [];

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        <div style={s.left}>
          <div style={s.logo} onClick={() => navigate(user?.role === "tpo" ? "/tpo/dashboard" : "/student/drives")}>
            <span style={s.logoText}>PT</span>
          </div>
          <span style={s.brand}>Placement Tracker</span>
          <div style={s.divider} />
          <div style={s.links}>
            {links.map((l) => (
              <button
                key={l.path}
                style={{ ...s.link, ...(location.pathname === l.path ? s.linkActive : {}) }}
                onClick={() => navigate(l.path)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <div style={s.right}>
          <div style={s.userChip}>
            <div style={s.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
            <div style={s.userInfo}>
              <span style={s.userName}>{user?.name}</span>
              <span style={s.userRole}>{user?.role?.toUpperCase()}</span>
            </div>
          </div>
          <button style={s.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

const s = {
  nav: { background: "#fff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 100 },
  inner: { maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  left: { display: "flex", alignItems: "center", gap: "16px" },
  logo: { width: "36px", height: "36px", background: "linear-gradient(135deg, #1e40af, #2563eb)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 },
  logoText: { color: "#fff", fontSize: "13px", fontWeight: "800" },
  brand: { fontSize: "16px", fontWeight: "700", color: "#0f172a", whiteSpace: "nowrap" },
  divider: { width: "1px", height: "24px", background: "#e2e8f0" },
  links: { display: "flex", gap: "4px" },
  link: { padding: "6px 14px", borderRadius: "8px", border: "none", background: "transparent", fontSize: "14px", color: "#64748b", cursor: "pointer", fontWeight: "500", transition: "all 0.15s" },
  linkActive: { background: "#eff6ff", color: "#1d4ed8" },
  right: { display: "flex", alignItems: "center", gap: "12px" },
  userChip: { display: "flex", alignItems: "center", gap: "10px", padding: "6px 12px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" },
  avatar: { width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #1e40af, #2563eb)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700" },
  userInfo: { display: "flex", flexDirection: "column" },
  userName: { fontSize: "13px", fontWeight: "600", color: "#0f172a", lineHeight: 1.2 },
  userRole: { fontSize: "10px", color: "#94a3b8", fontWeight: "500", letterSpacing: "0.05em" },
  logoutBtn: { padding: "7px 14px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", fontSize: "13px", color: "#64748b", cursor: "pointer", fontWeight: "500" },
};

export default Navbar;