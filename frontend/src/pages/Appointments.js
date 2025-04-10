import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AppointmentCard from "../components/AppointmentCard";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        // Decode token to get user role
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);

        // Determine endpoint based on role
        let endpoint = "http://localhost:5000/api/appointments";
        if (decoded.role === "patient") {
          endpoint = `http://localhost:5000/api/appointments`;
        } else if (decoded.role === "doctor") {
          endpoint = `http://localhost:5000/api/doctors/appointments`;
        }

        // Make API request
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAppointments(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to fetch appointments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading appointments...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {userRole === "patient" ? "My Appointments" : "Appointments"}
      </h1>

      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              currentRole={userRole}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No appointments found</p>
      )}
    </div>
  );
};

export default Appointments;
