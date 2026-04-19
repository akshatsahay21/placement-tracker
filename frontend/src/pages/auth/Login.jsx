
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/auth.api";
import { useAuth } from "../../context/auth.context";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await loginUser(form);
      login(data);
      if (data.role === "student") navigate("/student/drives");
      else if (data.role === "tpo") navigate("/tpo/dashboard");
      else if (data.role === "company") navigate("/company/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.root}>
      <div style={s.left}>
        <div style={s.leftInner}>
          <div style={s.logo}>PT</div>
          <h1 style={s.brand}>Placement Tracker</h1>
          <p style={s.tagline}>The smarter way to manage campus placements — for students, TPOs, and companies.</p>
          <div style={s.featureList}>
            {["Real-time application tracking", "Role-based dashboards", "Eligibility-aware applications", "Instant status updates"].map((f) => (
              <div key={f} style={s.feature}>
                <span style={s.check}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.right}>
        <div style={s.formCard}>
          <div style={s.formHeader}>
            <h2 style={s.formTitle}>Welcome back</h2>
            <p style={s.formSub}>Sign in to your account</p>
          </div>

          {error && (
            <div style={s.errorBox}>
              <span style={s.errorIcon}>!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Email address</label>
              <input
                style={s.input}
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                onFocus={e => e.target.style.borderColor = "#2563eb"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Password</label>
              <input
                style={s.input}
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                onFocus={e => e.target.style.borderColor = "#2563eb"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? (
                <span style={s.btnInner}>
                  <span style={s.spinner} /> Signing in...
                </span>
              ) : "Sign In →"}
            </button>
          </form>

          <p style={s.switchText}>
            Don't have an account?{" "}
            <Link to="/register" style={s.switchLink}>Create one</Link>
          </p>

          <div style={s.demoBox}>
            <p style={s.demoTitle}>Demo credentials</p>
            <div style={s.demoGrid}>
              <div style={s.demoItem}><span style={s.demoRole}>Student</span><span style={s.demoCred}>akshat@test.com / 123456</span></div>
              <div style={s.demoItem}><span style={s.demoRole}>TPO</span><span style={s.demoCred}>tpo@test.com / 123456</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  root: { display: "flex", minHeight: "100vh" },
  left: { flex: 1, background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem", position: "relative", overflow: "hidden" },
  leftInner: { maxWidth: "420px", position: "relative", zIndex: 1 },
  logo: { width: "52px", height: "52px", background: "rgba(255,255,255,0.15)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "800", color: "#fff", marginBottom: "1.5rem", border: "1px solid rgba(255,255,255,0.2)" },
  brand: { fontSize: "32px", fontWeight: "800", color: "#fff", marginBottom: "1rem", lineHeight: 1.2 },
  tagline: { fontSize: "16px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "2.5rem" },
  featureList: { display: "flex", flexDirection: "column", gap: "14px" },
  feature: { display: "flex", alignItems: "center", gap: "12px", color: "rgba(255,255,255,0.9)", fontSize: "15px" },
  check: { width: "22px", height: "22px", background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#fff", flexShrink: 0 },
  right: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "#f8fafc" },
  formCard: { width: "100%", maxWidth: "440px", background: "#fff", borderRadius: "20px", padding: "2.5rem", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9" },
  formHeader: { marginBottom: "2rem" },
  formTitle: { fontSize: "26px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" },
  formSub: { fontSize: "15px", color: "#64748b" },
  errorBox: { display: "flex", alignItems: "center", gap: "10px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", marginBottom: "1.5rem" },
  errorIcon: { width: "20px", height: "20px", background: "#dc2626", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", flexShrink: 0 },
  form: { display: "flex", flexDirection: "column", gap: "20px", marginBottom: "1.5rem" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", fontWeight: "500", color: "#374151" },
  input: { padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "15px", outline: "none", transition: "border-color 0.2s", background: "#fff", color: "#0f172a" },
  btn: { padding: "13px", borderRadius: "10px", background: "linear-gradient(135deg, #1e40af, #2563eb)", color: "#fff", border: "none", fontSize: "15px", fontWeight: "600", cursor: "pointer", letterSpacing: "0.3px" },
  btnInner: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  spinner: { width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" },
  switchText: { textAlign: "center", fontSize: "14px", color: "#64748b", marginBottom: "1.5rem" },
  switchLink: { color: "#2563eb", fontWeight: "500" },
  demoBox: { background: "#f8fafc", borderRadius: "10px", padding: "14px 16px", border: "1px solid #e2e8f0" },
  demoTitle: { fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" },
  demoGrid: { display: "flex", flexDirection: "column", gap: "8px" },
  demoItem: { display: "flex", alignItems: "center", gap: "10px" },
  demoRole: { fontSize: "12px", fontWeight: "600", background: "#eff6ff", color: "#1d4ed8", padding: "2px 8px", borderRadius: "6px", minWidth: "52px", textAlign: "center" },
  demoCred: { fontSize: "12px", color: "#64748b", fontFamily: "monospace" },
};

export default Login;