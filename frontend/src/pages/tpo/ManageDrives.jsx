import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDrive } from "../../api/drive.api";
import { useAuth } from "../../context/auth.context";

const ManageDrives = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "", jobRole: "", description: "", ctc: "",
    location: "", deadline: "",
    minCgpa: "", allowedBranches: "", maxBacklogs: 0,
    rounds: "Aptitude, Technical, HR",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await createDrive({
        companyName: form.companyName,
        jobRole: form.jobRole,
        description: form.description,
        ctc: Number(form.ctc),
        location: form.location,
        deadline: form.deadline,
        eligibility: {
          minCgpa: Number(form.minCgpa),
          allowedBranches: form.allowedBranches.split(",").map((b) => b.trim()).filter(Boolean),
          maxBacklogs: Number(form.maxBacklogs),
        },
        rounds: form.rounds.split(",").map((r) => r.trim()).filter(Boolean),
      });
      setSuccess("Drive created successfully!");
      setTimeout(() => navigate("/tpo/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create drive");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <span style={styles.brand}>Placement Tracker — TPO</span>
        <div style={styles.navlinks}>
          <button style={styles.navbtn} onClick={() => navigate("/tpo/dashboard")}>Dashboard</button>
          <button style={styles.navbtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.container}>
        <h2 style={styles.heading}>Create New Drive</h2>
        <p style={styles.sub}>Fill in the details for the new placement drive</p>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.section}>
            <p style={styles.sectionTitle}>Company Details</p>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Company Name *</label>
                <input style={styles.input} name="companyName" value={form.companyName} onChange={handleChange} placeholder="e.g. Google" required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Job Role *</label>
                <input style={styles.input} name="jobRole" value={form.jobRole} onChange={handleChange} placeholder="e.g. SDE Intern" required />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea style={{ ...styles.input, height: "80px", resize: "vertical" }} name="description" value={form.description} onChange={handleChange} placeholder="Job description..." />
            </div>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>CTC (₹ per year) *</label>
                <input style={styles.input} name="ctc" type="number" value={form.ctc} onChange={handleChange} placeholder="e.g. 600000" required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Location *</label>
                <input style={styles.input} name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangalore" required />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Application Deadline *</label>
              <input style={styles.input} name="deadline" type="date" value={form.deadline} onChange={handleChange} required />
            </div>
          </div>

          <div style={styles.section}>
            <p style={styles.sectionTitle}>Eligibility Criteria</p>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Minimum CGPA</label>
                <input style={styles.input} name="minCgpa" type="number" step="0.1" value={form.minCgpa} onChange={handleChange} placeholder="e.g. 7.5" />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Max Backlogs Allowed</label>
                <input style={styles.input} name="maxBacklogs" type="number" value={form.maxBacklogs} onChange={handleChange} placeholder="e.g. 0" />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Allowed Branches (comma separated)</label>
              <input style={styles.input} name="allowedBranches" value={form.allowedBranches} onChange={handleChange} placeholder="e.g. CSE, IT, ECE" />
            </div>
          </div>

          <div style={styles.section}>
            <p style={styles.sectionTitle}>Interview Rounds</p>
            <div style={styles.field}>
              <label style={styles.label}>Rounds (comma separated)</label>
              <input style={styles.input} name="rounds" value={form.rounds} onChange={handleChange} placeholder="e.g. Aptitude, Technical, HR" />
            </div>
          </div>

          <div style={styles.actions}>
            <button type="button" style={styles.cancelBtn} onClick={() => navigate("/tpo/dashboard")}>Cancel</button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? "Creating..." : "Create Drive"}
            </button>
          </div>
        </form>
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
  container: { maxWidth: "760px", margin: "0 auto", padding: "2rem 1rem" },
  heading: { fontSize: "24px", fontWeight: "600", margin: "0 0 4px" },
  sub: { color: "#666", fontSize: "14px", margin: "0 0 2rem" },
  form: { display: "flex", flexDirection: "column", gap: "24px" },
  section: { background: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: "16px" },
  sectionTitle: { margin: "0 0 4px", fontWeight: "600", fontSize: "15px", color: "#1e40af" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "500", color: "#374151" },
  input: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", fontFamily: "inherit" },
  actions: { display: "flex", gap: "12px", justifyContent: "flex-end" },
  cancelBtn: { padding: "10px 24px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", fontSize: "14px", cursor: "pointer" },
  submitBtn: { padding: "10px 24px", borderRadius: "8px", border: "none", background: "#2563eb", color: "#fff", fontSize: "14px", fontWeight: "500", cursor: "pointer" },
  error: { background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: "8px", fontSize: "14px" },
  success: { background: "#dcfce7", color: "#166534", padding: "10px 14px", borderRadius: "8px", fontSize: "14px" },
};

export default ManageDrives;