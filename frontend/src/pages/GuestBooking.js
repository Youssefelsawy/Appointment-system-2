import { useEffect, useState } from "react";
import { Form, Button, Alert, Spinner, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const GuestBooking = () => {
  const [formData, setFormData] = useState({
    guestEmail: "",
    doctorId: "",
    date: new Date(),
    timeSlot: "",
  });
  const [captchaToken, setCaptchaToken] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/guest/doctors");
      setDoctors(res.data);
    } catch {
      setError("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:5000/api/guest/appointment", {
        ...formData,
        date: formData.date.toISOString().split("T")[0], // format: YYYY-MM-DD
        token: captchaToken,
      });
      setSuccess("Appointment request submitted successfully!");
      setFormData({
        guestEmail: "",
        doctorId: "",
        date: new Date(),
        timeSlot: "",
      });
      setCaptchaToken("");
    } catch (err) {
      setError(err.response?.data?.error || "Booking failed");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <Row className="justify-content-center mt-5">
      <Col md={8}>
        <Card>
          <Card.Header>Book an Appointment (Guest)</Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Your Email</Form.Label>
                <Form.Control
                  type="email"
                  required
                  value={formData.guestEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, guestEmail: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Select Doctor</Form.Label>
                <Form.Select
                  required
                  value={formData.doctorId}
                  onChange={(e) =>
                    setFormData({ ...formData, doctorId: e.target.value })
                  }
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <DatePicker
                  selected={formData.date}
                  onChange={(date) => setFormData({ ...formData, date })}
                  minDate={new Date()}
                  className="form-control"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Time</Form.Label>
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
                <ReCAPTCHA
                  sitekey="YOUR_SITE_KEY"
                  onChange={(token) => setCaptchaToken(token)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" disabled={!captchaToken}>
                Submit Request
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default GuestBooking;
