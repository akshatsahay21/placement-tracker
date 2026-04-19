import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./pages/student/StudentDashboard";
import DriveList from "./pages/student/DriveList";
import MyApplications from "./pages/student/MyApplications";
import TpoDashboard from "./pages/tpo/TpoDashboard";
import ManageDrives from "./pages/tpo/ManageDrives";
import DriveApplicants from "./pages/tpo/DriveApplicants";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/student/drives" element={<ProtectedRoute role="student"><DriveList /></ProtectedRoute>} />
        <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/applications" element={<ProtectedRoute role="student"><MyApplications /></ProtectedRoute>} />

        <Route path="/tpo/dashboard" element={<ProtectedRoute role="tpo"><TpoDashboard /></ProtectedRoute>} />
        <Route path="/tpo/drives" element={<ProtectedRoute role="tpo"><ManageDrives /></ProtectedRoute>} />
        <Route path="/tpo/drives/:driveId/applicants" element={<ProtectedRoute role="tpo"><DriveApplicants /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;