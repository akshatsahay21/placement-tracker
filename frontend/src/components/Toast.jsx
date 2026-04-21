import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/auth.context";

const toastColors = {
  selected:    { bg: "#f0fdf4", border: "#86efac", color: "#15803d" },
  shortlisted: { bg: "#fefce8", border: "#fde047", color: "#a16207" },
  interview:   { bg: "#f5f3ff", border: "#c4b5fd", color: "#6d28d9" },
  rejected:    { bg: "#f8fafc", border: "#e2e8f0", color: "#64748b" },
  default:     { bg: "#eff6ff", border: "#93c5fd", color: "#1d4ed8" },
};

const Toast = () => {
  const { user } = useAuth();
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "student") return;

    const socket = io("http://localhost:5000");
    socket.emit("join", user._id);

    socket.on("statusUpdate", (data) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, ...data }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    });

    return () => socket.disconnect();
  }, [user]);

  if (toasts.length === 0) return null;

  return (
    <div style={s.container}>
      {toasts.map((toast) => {
        const colors = toastColors[toast.status] || toastColors.default;
        return (
          <div
            key={toast.id}
            style={{ ...s.toast, background: colors.bg, border: `1px solid ${colors.border}` }}
          >
            <p style={{ ...s.message, color: colors.color }}>{toast.message}</p>
            <p style={s.sub}>{toast.jobRole} · {toast.companyName}</p>
            <button style={s.close} onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>✕</button>
            <div style={{ ...s.progress, background: colors.border }} />
          </div>
        );
      })}
    </div>
  );
};

const s = {
  container: { position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "12px", maxWidth: "360px" },
  toast: { borderRadius: "14px", padding: "16px 20px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", position: "relative", overflow: "hidden", animation: "slideIn 0.3s ease" },
  message: { margin: "0 24px 4px 0", fontSize: "14px", fontWeight: "600", lineHeight: 1.4 },
  sub: { margin: 0, fontSize: "12px", color: "#94a3b8" },
  close: { position: "absolute", top: "12px", right: "12px", background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#94a3b8", padding: "2px" },
  progress: { position: "absolute", bottom: 0, left: 0, height: "3px", width: "100%", opacity: 0.4, animation: "shrink 5s linear forwards" },
};

export default Toast;