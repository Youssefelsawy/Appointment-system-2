import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/layout/Navbar";
import AuthWrapper from "./components/AuthWrapper";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PatientAppointmentForm from "./pages/PatientAppointmentForm";
import Appointments from "./pages/Appointments";

function App() {
  return (
    <Router>
      <AppNavbar />
      <Routes>
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
      </Routes>
    </Router>
  );
}

export default App;
