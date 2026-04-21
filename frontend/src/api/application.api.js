import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

const getConfig = () => ({
  headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user"))?.token}` },
});

export const applyToDrive = (driveId) => API.post(`/applications/apply/${driveId}`, {}, getConfig());
export const getMyApplications = () => API.get("/applications/my", getConfig());
export const getDriveApplicants = (driveId) => API.get(`/applications/drive/${driveId}`, getConfig());
export const updateApplicationStatus = (id, data) => API.put(`/applications/${id}/status`, data, getConfig());
export const getAnalytics = () => API.get("/applications/analytics", getConfig());