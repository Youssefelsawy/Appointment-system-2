import { useEffect, useState } from "react";
import { Table, Button, Alert, Spinner, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const DoctorSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  const token = localStorage.getItem("token");

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/doctor/appointments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(res.data);
    } catch {
      setError("Failed to load appointments");
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setUpdating(appointmentId);
      await axios.put(
        "http://localhost:5000/api/doctor/appointments/status",
        { appointmentId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments(); // Refresh
    } catch {
      setError("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (!appointments.length) return <Spinner animation="border" />;

  return (
    <div className="container mt-5">
      <h3 className="mb-4">My Schedule</h3>
      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Patient</th>
            <th>Email</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Change Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a, i) => (
            <tr key={a.id}>
              <td>{i + 1}</td>
              <td>{a.patient?.name || "N/A"}</td>
              <td>{a.patient?.email || "N/A"}</td>
              <td>{a.date}</td>
              <td>{a.timeSlot}</td>
              <td>{a.status}</td>
              <td>
                <Form.Select
                  size="sm"
                  value={a.status}
                  disabled={updating === a.id}
                  onChange={(e) => handleStatusChange(a.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Form.Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DoctorSchedule;
