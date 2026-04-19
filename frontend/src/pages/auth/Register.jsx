import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/auth.api";
import { useAuth } from "../../context/auth.context";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "student",
    cgpa: "", branch: "", backlogsCount: 0, companyName: "", hrEmail: "",
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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join Placement Tracker</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input style={styles.input} name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          <input style={styles.input} type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input style={styles.input} type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <select style={styles.input} name="role" value={form.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="tpo">TPO</option>
            <option value="company">Company HR</option>
          </select>
          {form.role === "student" && (
            <>
              <input style={styles.input} name="cgpa" type="number" step="0.1" placeholder="CGPA (e.g. 8.5)" value={form.cgpa} onChange={handleChange} />
              <input style={styles.input} name="branch" placeholder="Branch (e.g. CSE)" value={form.branch} onChange={handleChange} />
              <input style={styles.input} name="backlogsCount" type="number" placeholder="Number of backlogs" value={form.backlogsCount} onChange={handleChange} />
            </>
          )}
          {form.role === "company" && (
            <>
              <input style={styles.input} name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} />
              <input style={styles.input} name="hrEmail" placeholder="HR Email" value={form.hrEmail} onChange={handleChange} />
            </>
          )}
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p style={styles.link}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" },
  card: { background: "#fff", padding: "2rem", borderRadius: "12px", boxShadow: "0 2px 16px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" },
  title: { margin: "0 0 4px", fontSize: "22px", fontWeight: "600" },
  subtitle: { margin: "0 0 1.5rem", color: "#666", fontSize: "14px" },
  error: { background: "#fff0f0", color: "#c0392b", padding: "10px", borderRadius: "8px", fontSize: "14px", marginBottom: "1rem" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", outline: "none" },
  button: { padding: "10px", borderRadius: "8px", background: "#2563eb", color: "#fff", border: "none", fontSize: "15px", fontWeight: "500", cursor: "pointer" },
  link: { marginTop: "1rem", textAlign: "center", fontSize: "14px" },
};

export default Register;