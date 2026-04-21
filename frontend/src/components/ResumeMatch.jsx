import { useState } from "react";
import { matchResume } from "../api/match.api";

const ResumeMatch = ({ drive, onClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.type === "application/pdf") setFile(f);
    else setError("Please upload a PDF file");
  };

  const handleMatch = async () => {
    if (!file) return setError("Please select a PDF resume first");
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const { data } = await matchResume(drive._id, formData);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Matching failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 75) return "#15803d";
    if (score >= 50) return "#a16207";
    if (score >= 30) return "#c2410c";
    return "#dc2626";
  };

  const scoreBg = (score) => {
    if (score >= 75) return "#f0fdf4";
    if (score >= 50) return "#fefce8";
    if (score >= 30) return "#fff7ed";
    return "#fef2f2";
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <div>
            <h2 style={s.modalTitle}>AI Resume Match</h2>
            <p style={s.modalSub}>{drive.companyName} — {drive.jobRole}</p>
          </div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        {!result ? (
          <div style={s.uploadSection}>
            <div style={s.uploadBox}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f?.type === "application/pdf") setFile(f);
                else setError("Please drop a PDF file");
              }}
            >
              <div style={s.uploadIcon}>📄</div>
              <p style={s.uploadTitle}>{file ? file.name : "Drop your resume here"}</p>
              <p style={s.uploadSub}>{file ? `${(file.size / 1024).toFixed(1)} KB` : "PDF files only, max 5MB"}</p>
              <label style={s.uploadBtn}>
                {file ? "Change File" : "Browse PDF"}
                <input type="file" accept=".pdf" onChange={handleFileChange} style={{ display: "none" }} />
              </label>
            </div>

            {error && <p style={s.errorText}>{error}</p>}

            <button
              style={{ ...s.matchBtn, opacity: (!file || loading) ? 0.7 : 1 }}
              onClick={handleMatch}
              disabled={!file || loading}
            >
              {loading ? (
                <span style={s.loadingRow}>
                  <span style={s.spinner} /> Analyzing with AI...
                </span>
              ) : "Analyze Resume →"}
            </button>
          </div>
        ) : (
          <div style={s.resultSection}>
            <div style={{ ...s.scoreCard, background: scoreBg(result.matchScore) }}>
              <div style={s.scoreLeft}>
                <span style={{ ...s.scoreNum, color: scoreColor(result.matchScore) }}>
                  {result.matchScore}%
                </span>
                <span style={s.scoreLabel}>Match Score</span>
              </div>
              <div style={s.scoreDivider} />
              <div style={s.scoreRight}>
                <span style={{ ...s.matchLevel, color: scoreColor(result.matchScore) }}>
                  {result.matchLevel} Match
                </span>
                <p style={s.summary}>{result.summary}</p>
              </div>
            </div>

            <div style={s.grid}>
              <div style={s.resultCard}>
                <p style={s.cardTitle}>✅ Matched Skills</p>
                <div style={s.tagList}>
                  {result.matchedSkills?.length > 0
                    ? result.matchedSkills.map((sk) => (
                        <span key={sk} style={{ ...s.tag, background: "#f0fdf4", color: "#15803d" }}>{sk}</span>
                      ))
                    : <p style={s.emptyTag}>None found</p>}
                </div>
              </div>

              <div style={s.resultCard}>
                <p style={s.cardTitle}>❌ Missing Skills</p>
                <div style={s.tagList}>
                  {result.missingSkills?.length > 0
                    ? result.missingSkills.map((sk) => (
                        <span key={sk} style={{ ...s.tag, background: "#fef2f2", color: "#dc2626" }}>{sk}</span>
                      ))
                    : <p style={s.emptyTag}>Nothing missing!</p>}
                </div>
              </div>

              <div style={s.resultCard}>
                <p style={s.cardTitle}>💪 Strengths</p>
                <div style={s.tagList}>
                  {result.strengths?.map((st) => (
                    <span key={st} style={{ ...s.tag, background: "#eff6ff", color: "#1d4ed8" }}>{st}</span>
                  ))}
                </div>
              </div>

              <div style={s.resultCard}>
                <p style={s.cardTitle}>💡 Suggestions</p>
                <div style={s.suggList}>
                  {result.suggestions?.map((sg, i) => (
                    <p key={i} style={s.suggItem}>→ {sg}</p>
                  ))}
                </div>
              </div>
            </div>

            <button style={s.retryBtn} onClick={() => { setResult(null); setFile(null); }}>
              Try Another Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" },
  modal: { background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "680px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "1.5rem 1.5rem 0" },
  modalTitle: { fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" },
  modalSub: { fontSize: "13px", color: "#64748b", margin: 0 },
  closeBtn: { background: "#f1f5f9", border: "none", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", fontSize: "14px", color: "#64748b", flexShrink: 0 },
  uploadSection: { padding: "1.5rem", display: "flex", flexDirection: "column", gap: "16px" },
  uploadBox: { border: "2px dashed #e2e8f0", borderRadius: "14px", padding: "2.5rem", textAlign: "center", background: "#f8fafc", cursor: "pointer" },
  uploadIcon: { fontSize: "40px", marginBottom: "12px" },
  uploadTitle: { fontSize: "15px", fontWeight: "600", color: "#0f172a", margin: "0 0 6px" },
  uploadSub: { fontSize: "13px", color: "#94a3b8", margin: "0 0 16px" },
  uploadBtn: { display: "inline-block", padding: "9px 20px", borderRadius: "8px", background: "linear-gradient(135deg, #1e40af, #2563eb)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
  errorText: { color: "#dc2626", fontSize: "13px", margin: 0 },
  matchBtn: { padding: "13px", borderRadius: "10px", background: "linear-gradient(135deg, #1e40af, #2563eb)", color: "#fff", border: "none", fontSize: "15px", fontWeight: "600", cursor: "pointer" },
  loadingRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" },
  spinner: { width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" },
  resultSection: { padding: "1.5rem", display: "flex", flexDirection: "column", gap: "16px" },
  scoreCard: { borderRadius: "14px", padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem" },
  scoreLeft: { display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 },
  scoreNum: { fontSize: "48px", fontWeight: "800", lineHeight: 1 },
  scoreLabel: { fontSize: "12px", color: "#94a3b8", marginTop: "4px" },
  scoreDivider: { width: "1px", height: "60px", background: "#e2e8f0", flexShrink: 0 },
  scoreRight: { flex: 1 },
  matchLevel: { fontSize: "18px", fontWeight: "700", display: "block", marginBottom: "8px" },
  summary: { fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  resultCard: { background: "#f8fafc", borderRadius: "12px", padding: "1rem", border: "1px solid #e2e8f0" },
  cardTitle: { fontSize: "13px", fontWeight: "600", color: "#374151", margin: "0 0 10px" },
  tagList: { display: "flex", flexWrap: "wrap", gap: "6px" },
  tag: { fontSize: "12px", padding: "3px 10px", borderRadius: "20px", fontWeight: "500" },
  emptyTag: { fontSize: "12px", color: "#94a3b8", margin: 0 },
  suggList: { display: "flex", flexDirection: "column", gap: "6px" },
  suggItem: { fontSize: "12px", color: "#475569", margin: 0, lineHeight: 1.5 },
  retryBtn: { padding: "10px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#fff", fontSize: "14px", color: "#64748b", cursor: "pointer", fontWeight: "500" },
};

export default ResumeMatch;