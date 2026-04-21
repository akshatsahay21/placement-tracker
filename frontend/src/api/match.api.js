import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user"))?.token}`,
    "Content-Type": "multipart/form-data",
  },
});

export const matchResume = (driveId, formData) =>
  API.post(`/match/${driveId}`, formData, getConfig());