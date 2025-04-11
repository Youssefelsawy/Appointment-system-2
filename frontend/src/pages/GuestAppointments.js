import { useState } from "react";
import {
  Form,
  Button,
  Alert,
  Spinner,
  Card,
  Table,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GuestAppointments = () => {
  const [email, setEmail] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const fetchAppointments = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAppointments([]);
    setSubmitted(true);

    try {
      const res = await axios.get(
        `${process.env.BACKEND_URL}/api/guest/appointments`,
        {
          params: { email },
        }
      );

      if (res.data.error === "No guest found with this email") {
        setError(res.data.error);
      } else {
        setAppointments(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="justify-content-center mt-5">
      <Col md={8}>
        <Card>
          <Card.Header>Find Your Appointments</Card.Header>
          <Card.Body>
            <Form onSubmit={fetchAppointments} className="mb-3">
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Button type="submit" disabled={loading}>
                {loading ? "Searching..." : "Find Appointments"}
              </Button>
            </Form>

            {/* Error message for no guest found */}
            {error === "No guest found with this email" && (
              <Alert variant="danger" className="mt-3">
                {error}
                <div className="mt-2">
                  <Button
                    variant="link"
                    onClick={() => navigate("/guest-booking")}
                    className="p-0"
                  >
                    Book a new appointment with this email?
                  </Button>
                </div>
              </Alert>
            )}

            {/* Message for guest with no appointments */}
            {submitted && !loading && !error && appointments.length === 0 && (
              <Alert variant="info" className="mt-3">
                No appointments found for this email.
                <div className="mt-2">
                  <Button
                    variant="link"
                    onClick={() => navigate("/guest-booking")}
                    className="p-0"
                  >
                    Book a new appointment?
                  </Button>
                </div>
              </Alert>
            )}

            {/* Appointments table */}
            {appointments.length > 0 && (
              <>
                <h5>Appointments:</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Doctor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id}>
                        <td>{a.date}</td>
                        <td>{a.timeSlot}</td>
                        <td>{a.doctor?.name || "N/A"}</td>
                        <td>{a.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default GuestAppointments;
