import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AppNavbar from "./components/layout/Navbar";
import AuthWrapper from "./components/AuthWrapper";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PatientAppointmentForm from "./pages/PatientAppointmentForm";
import AdminDashboard from "./pages/AdminDashboard";
import Appointments from "./pages/Appointments";
import DoctorSchedule from "./pages/DoctorSchedule";
import GuestBooking from "./pages/GuestBooking";
import GuestAppointments from "./pages/GuestAppointments";

function App() {
  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/book-appointment"
          element={
            <AuthWrapper allowedRoles={["patient"]}>
              <PatientAppointmentForm />
            </AuthWrapper>
          }
        />
        <Route
          path="/appointments"
          element={
            <AuthWrapper allowedRoles={["patient", "doctor", "admin"]}>
              <Appointments />
            </AuthWrapper>
          }
        />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/doctor/schedule" element={<DoctorSchedule />} />
        <Route path="/guest-booking" element={<GuestBooking />} />
        <Route path="/guest-appointments" element={<GuestAppointments />} />
      </Routes>
    </Router>
  );
}

export default App;
