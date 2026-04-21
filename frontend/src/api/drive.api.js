import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });


const getConfig = () => ({
  headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user"))?.token}` },
});

export const getAllDrives = () => API.get("/drives", getConfig());
export const createDrive = (data) => API.post("/drives", data, getConfig());
export const updateDrive = (id, data) => API.put(`/drives/${id}`, data, getConfig());
export const deleteDrive = (id) => API.delete(`/drives/${id}`, getConfig()); 