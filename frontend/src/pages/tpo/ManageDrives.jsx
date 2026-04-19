import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDrive } from "../../api/drive.api";
import Navbar from "../../components/Navbar";

const ManageDrives = () => {
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
          allowedBranches: form.allowedBranches.split(",").map(b => b.trim()).filter(Boolean),
          maxBacklogs: Number(form.maxBacklogs),
        },
        rounds: form.rounds.split(",").map(r => r.trim()).filter(Boolean),
      });
      setSuccess("Drive created successfully! Redirecting...");
      setTimeout(() => navigate("/tpo/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create drive");
    } finally {
      setLoading(false);
    }
  };

  const inp = { padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0", fontSize: "14px", outline: "none", background: "#fff", color: "#0f172a", width: "100%", fontFamily: "inherit" };

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <button style={s.backBtn} onClick={() => navigate("/tpo/dashboard")}>← Back to Dashboard</button>
        <div style={s.pageHeader}>
          <h1 style={s.heading}>Create New Drive</h1>
          <p style={s.sub}>Fill in the details to post a new placement drive</p>
        </div>

        {error && <div style={s.errorBox}><span>⚠</span> {error}</div>}
        {success && <div style={s.successBox}><span>✓</span> {success}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionNum}>1</div>
              <div>
                <p style={s.sectionTitle}>Company & Role</p>
                <p style={s.sectionSub}>Basic information about the position</p>
              </div>
            </div>
            <div style={s.fields}>
              <div style={s.row}>
                <div style={s.field}>
                  <label style={s.label}>Company Name *</label>
                  <input style={inp} name="companyName" value={form.companyName} onChange={handleChange} placeholder="e.g. Google" required onFocus={e => e.target.style.borderColor="#2563eb"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Job Role *</label>
                  <input style={inp} name="jobRole" value={form.jobRole} onChange={handleChange} placeholder="e.g. SDE Intern" required onFocus={e => e.target.style.borderColor="#2563eb"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
                </div>
              </div>
              <div style={s.row}>
                <div style={s.field}>
                  <label style={s.label}>CTC (₹ per year) *</label>
                  <input style={inp} name="ctc" type="number" value={form.ctc} onChange={handleChange} placeholder="e.g. 1200000" required onFocus={e => e.target.style.borderColor="#2563eb"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Location *</label>
                  <input style={inp} name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangalore" required onFocus={e => e.target.style.borderColor="#2563eb"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
                </div>
              </div>
              <div style={s.row}>
                <div style={s.field}>
                  <label style={s.label}>Application Deadline *</label>
                  <input style={inp} name="deadline" type="date" value={form.deadline} onChange={handleChange} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Description</label>
                  <input style={inp} name="description" value={form.description} onChange={handleChange} placeholder="Brief job description..." onFocus={e => e.target.style.borderColor="#2563eb"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
                </div>
              </div>
            </div>
          </div>

          <div style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionNum}>2</div>
              <div>
                <p style={s.sectionTitle}>Eligibility Criteria</p>
                <p style={s.sectionSub}>Who can apply for this position</p>
              </div>
            </div>
            <div style={s.fields}>
              <div style={s.row}>
                <div style={s.field}>
                  <label style={s.label}>Minimum CGPA</label>
                  <input style={inp} name="minCgpa" type="number" step="0.1" min="0" max="10" value={form.minCgpa} onChange={handleChange} placeholder="e.g. 7.5" onFocus={e => e.target.style.borderColor="#2563eb"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Max Backlogs Allowed</label>
                  <input style={inp} name="maxBacklogs" type="number" min="0" value={form.maxBacklogs} onChange={handleChange} placeholder="e.g. 0" onFocus={e => e.target.style.borderColor="#2563eb"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
                </div>
              </div>
              <div style={s.field}>
                <label style={s.label}>Allowed Branches (comma separated)</label>
                <input style={inp} name="allowedBranches" value={form.allowedBranches} onChange={handleChange} placeholder="e.g. CSE, IT, ECE  (leave empty for all branches)" onFocus={e => e.target.style.borderColor="#2563eb"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
              </div>
            </div>
          </div>

          <div style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionNum}>3</div>
              <div>
                <p style={s.sectionTitle}>Interview Rounds</p>
                <p style={s.sectionSub}>Define the selection process</p>
              </div>
            </div>
            <div style={s.fields}>
              <div style={s.field}>
                <label style={s.label}>Rounds (comma separated)</label>
                <input style={inp} name="rounds" value={form.rounds} onChange={handleChange} placeholder="e.g. Aptitude, Technical, HR" onFocus={e => e.target.style.borderColor="#2563eb"} onBlur={e => e.target.style.borderColor="#e2e8f0"} />
              </div>
              <div style={s.previewRow}>
                {form.rounds.split(",").filter(Boolean).map((r, i) => (
                  <span key={i} style={s.roundPill}>{r.trim()}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={s.formActions}>
            <button type="button" style={s.cancelBtn} onClick={() => navigate("/tpo/dashboard")}>Cancel</button>
            <button type="submit" style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? "Creating Drive..." : "Create Drive →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "#f8fafc" },
  container: { maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem" },
  backBtn: { background: "none", border: "none", color: "#64748b", fontSize: "13px", cursor: "pointer", padding: "0 0 12px", display: "block" },
  pageHeader: { marginBottom: "2rem" },
  heading: { fontSize: "26px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px" },
  sub: { fontSize: "14px", color: "#64748b", margin: 0 },
  errorBox: { display: "flex", alignItems: "center", gap: "8px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", marginBottom: "1.5rem" },
  successBox: { display: "flex", alignItems: "center", gap: "8px", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", marginBottom: "1.5rem" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  section: { background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" },
  sectionHeader: { display: "flex", alignItems: "flex-start", gap: "14px", padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", background: "#fafbfc" },
  sectionNum: { width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, #1e40af, #2563eb)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: 0 },
  sectionTitle: { margin: "0 0 2px", fontWeight: "600", fontSize: "15px", color: "#0f172a" },
  sectionSub: { margin: 0, fontSize: "13px", color: "#94a3b8" },
  fields: { padding: "1.5rem", display: "flex", flexDirection: "column", gap: "16px" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "7px" },
  label: { fontSize: "13px", fontWeight: "500", color: "#374151" },
  previewRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  roundPill: { background: "#eff6ff", color: "#1d4ed8", fontSize: "12px", padding: "4px 12px", borderRadius: "20px", fontWeight: "500" },
  formActions: { display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "4px" },
  cancelBtn: { padding: "11px 24px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#fff", fontSize: "14px", color: "#64748b", cursor: "pointer", fontWeight: "500" },
  submitBtn: { padding: "11px 28px", borderRadius: "10px", background: "linear-gradient(135deg, #1e40af, #2563eb)", color: "#fff", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
};

export default ManageDrives;