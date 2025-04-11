import { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PatientAppointmentForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    doctorId: "",
    date: new Date(),
    timeSlot: "",
    notes: "",
  });

  // Fetch available doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        //console.log("TOKEN:", localStorage.getItem("token"));

        const res = await axios.get(`${process.env.BACKEND_URL}/api/doctors`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDoctors(res.data);
      } catch (err) {
        setError("Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Time slots (every 1 hour from 9AM to 5PM)
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    timeSlots.push(`${hour}:00`);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        `${process.env.BACKEND_URL}/api/appointments`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(formData);
      setSuccess("Appointment booked successfully!");
      setTimeout(() => navigate("/appointments"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Booking failed");
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Row className="justify-content-center mt-5">
      <Col md={8}>
        <Card>
          <Card.Header as="h5">Book New Appointment</Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Select Doctor</Form.Label>
                <Form.Select
                  value={formData.doctorId}
                  onChange={(e) =>
                    setFormData({ ...formData, doctorId: e.target.value })
                  }
                  required
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Appointment Date</Form.Label>
                <DatePicker
                  selected={formData.date}
                  onChange={(date) => setFormData({ ...formData, date })}
                  minDate={new Date()}
                  className="form-control"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Time Slot</Form.Label>
                <Form.Select
                  value={formData.timeSlot}
                  onChange={(e) =>
                    setFormData({ ...formData, timeSlot: e.target.value })
                  }
                  required
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Notes (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="primary" type="submit" size="lg">
                  Book Appointment
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default PatientAppointmentForm;
