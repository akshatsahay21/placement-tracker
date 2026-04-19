import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/auth.api";
import { useAuth } from "../../context/auth.context";

const roles = [
  { value: "student", label: "Student", desc: "Browse and apply to placement drives" },
  { value: "tpo", label: "TPO Admin", desc: "Manage drives and track placements" },
  { value: "company", label: "Company HR", desc: "Post drives and shortlist candidates" },
];

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "student",
    cgpa: "", branch: "", backlogsCount: 0,
    companyName: "", hrEmail: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await registerUser(form);
      login(data);
      if (data.role === "student") navigate("/student/drives");
      else if (data.role === "tpo") navigate("/tpo/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #e2e8f0",
    fontSize: "15px", outline: "none", background: "#fff", color: "#0f172a", width: "100%",
  };

  return (
    <div style={s.root}>
      <div style={s.left}>
        <div style={s.leftInner}>
          <div style={s.logo}>PT</div>
          <h1 style={s.brand}>Join Placement Tracker</h1>
          <p style={s.tagline}>Set up your account in under a minute. Choose your role to get started.</p>
          <div style={s.roleCards}>
            {roles.map((r) => (
              <div
                key={r.value}
                style={{ ...s.roleCard, ...(form.role === r.value ? s.roleCardActive : {}) }}
                onClick={() => setForm({ ...form, role: r.value })}
              >
                <span style={s.roleLabel}>{r.label}</span>
                <span style={s.roleDesc}>{r.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.right}>
        <div style={s.formCard}>
          <div style={s.formHeader}>
            <h2 style={s.formTitle}>Create your account</h2>
            <p style={s.formSub}>Already have one? <Link to="/login" style={s.link}>Sign in</Link></p>
          </div>

          {error && <div style={s.errorBox}><span style={s.errorIcon}>!</span>{error}</div>}

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>Full name</label>
                <input style={inputStyle} name="name" placeholder="Akshat Sahay" value={form.name} onChange={handleChange} required
                  onFocus={e => e.target.style.borderColor = "#2563eb"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Email address</label>
                <input style={inputStyle} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required
                  onFocus={e => e.target.style.borderColor = "#2563eb"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input style={inputStyle} type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required
                onFocus={e => e.target.style.borderColor = "#2563eb"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>

            <div style={s.field}>
              <label style={s.label}>Role</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} name="role" value={form.role} onChange={handleChange}>
                {roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            {form.role === "student" && (
              <div style={s.extraSection}>
                <p style={s.sectionLabel}>Student details</p>
                <div style={s.row}>
                  <div style={s.field}>
                    <label style={s.label}>CGPA</label>
                    <input style={inputStyle} name="cgpa" type="number" step="0.1" min="0" max="10" placeholder="8.5" value={form.cgpa} onChange={handleChange}
                      onFocus={e => e.target.style.borderColor = "#2563eb"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Branch</label>
                    <input style={inputStyle} name="branch" placeholder="CSE" value={form.branch} onChange={handleChange}
                      onFocus={e => e.target.style.borderColor = "#2563eb"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                  </div>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Number of backlogs</label>
                  <input style={inputStyle} name="backlogsCount" type="number" min="0" placeholder="0" value={form.backlogsCount} onChange={handleChange}
                    onFocus={e => e.target.style.borderColor = "#2563eb"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </div>
              </div>
            )}

            {form.role === "company" && (
              <div style={s.extraSection}>
                <p style={s.sectionLabel}>Company details</p>
                <div style={s.field}>
                  <label style={s.label}>Company name</label>
                  <input style={inputStyle} name="companyName" placeholder="Google" value={form.companyName} onChange={handleChange}
                    onFocus={e => e.target.style.borderColor = "#2563eb"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>HR email</label>
                  <input style={inputStyle} name="hrEmail" type="email" placeholder="hr@company.com" value={form.hrEmail} onChange={handleChange}
                    onFocus={e => e.target.style.borderColor = "#2563eb"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
                </div>
              </div>
            )}

            <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const s = {
  root: { display: "flex", minHeight: "100vh" },
  left: { flex: "0 0 420px", background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem", overflow: "hidden" },
  leftInner: { width: "100%", maxWidth: "360px" },
  logo: { width: "52px", height: "52px", background: "rgba(255,255,255,0.15)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "800", color: "#fff", marginBottom: "1.5rem", border: "1px solid rgba(255,255,255,0.2)" },
  brand: { fontSize: "26px", fontWeight: "800", color: "#fff", marginBottom: "1rem", lineHeight: 1.3 },
  tagline: { fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "2rem" },
  roleCards: { display: "flex", flexDirection: "column", gap: "10px" },
  roleCard: { background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "14px 16px", cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", gap: "4px" },
  roleCardActive: { background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.5)" },
  roleLabel: { fontSize: "14px", fontWeight: "600", color: "#fff" },
  roleDesc: { fontSize: "12px", color: "rgba(255,255,255,0.65)" },
  right: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "#f8fafc", overflowY: "auto" },
  formCard: { width: "100%", maxWidth: "500px", background: "#fff", borderRadius: "20px", padding: "2.5rem", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9" },
  formHeader: { marginBottom: "2rem" },
  formTitle: { fontSize: "24px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" },
  formSub: { fontSize: "15px", color: "#64748b" },
  link: { color: "#2563eb", fontWeight: "500" },
  errorBox: { display: "flex", alignItems: "center", gap: "10px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", marginBottom: "1.5rem" },
  errorIcon: { width: "20px", height: "20px", background: "#dc2626", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", flexShrink: 0 },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  field: { display: "flex", flexDirection: "column", gap: "7px" },
  label: { fontSize: "13px", fontWeight: "500", color: "#374151" },
  extraSection: { background: "#f8fafc", borderRadius: "12px", padding: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "14px" },
  sectionLabel: { fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 },
  btn: { padding: "13px", borderRadius: "10px", background: "linear-gradient(135deg, #1e40af, #2563eb)", color: "#fff", border: "none", fontSize: "15px", fontWeight: "600", cursor: "pointer", marginTop: "4px" },
};

export default Register;