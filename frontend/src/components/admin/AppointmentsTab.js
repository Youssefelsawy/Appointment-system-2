import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";

const AppointmentsTab = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "",
    doctorId: "",
    patientId: "",
  });

  const token = localStorage.getItem("token");

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const fetchAll = async () => {
    try {
      const [a, p, d] = await Promise.all([
        axios.get("http://localhost:5000/admin/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/admin/patients", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/admin/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setAppointments(a.data);
      setPatients(p.data);
      setDoctors(d.data);
    } catch (err) {
      setError("Failed to load data");
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await axios.delete(`http://localhost:5000/admin/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAll();
    } catch {
      setError("Failed to delete");
    }
  };

  const createAppointment = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/admin/appointments", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowCreate(false);
      setFormData({ date: "", timeSlot: "", doctorId: "", patientId: "" });
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create appointment");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (!appointments) return <Spinner animation="border" />;

  return (
    <>
      <Row className="mb-3">
        <Col>
          <h5>All Appointments</h5>
        </Col>
        <Col className="text-end">
          <Button onClick={() => setShowCreate(true)}>Create</Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Time</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a, i) => (
            <tr key={a.id}>
              <td>{i + 1}</td>
              <td>{a.date}</td>
              <td>{a.timeSlot}</td>
              <td>{a.patient?.name || a.guestEmail || "N/A"}</td>
              <td>{a.doctor?.name || "N/A"}</td>
              <td>{a.status}</td>
              <td>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => deleteAppointment(a.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createAppointment}>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Time Slot</Form.Label>
              <Form.Select
                required
                value={formData.timeSlot}
                onChange={(e) =>
                  setFormData({ ...formData, timeSlot: e.target.value })
                }
              >
                <option value="">Select time</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Doctor</Form.Label>
              <Form.Select
                required
                value={formData.doctorId}
                onChange={(e) =>
                  setFormData({ ...formData, doctorId: e.target.value })
                }
              >
                <option value="">Choose Doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    Dr. {doc.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Patient</Form.Label>
              <Form.Select
                required
                value={formData.patientId}
                onChange={(e) =>
                  setFormData({ ...formData, patientId: e.target.value })
                }
              >
                <option value="">Choose Patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button type="submit">Create</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AppointmentsTab;
