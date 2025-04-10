import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Card } from "react-bootstrap";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      // Redirect based on role
      const redirectPaths = {
        patient: "/appointments",
        doctor: "/doctor/appointments",
        admin: "/admin/dashboard",
      };
      navigate(redirectPaths[user.role] || "/");
    }
  }, [navigate]);

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold mb-4">OnnMed Clinic</h1>
              <p className="lead mb-4">
                Book appointments with top healthcare professionals in just a
                few clicks
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/login" variant="light" size="lg">
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="outline-light"
                  size="lg"
                >
                  Register
                </Button>
              </div>
            </Col>
            <Col md={6}>
              {/* Placeholder for hero image */}
              <div
                className="bg-light rounded"
                style={{ height: "300px" }}
              ></div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5">Our Services</h2>
          <Row>
            {[
              {
                title: "Easy Booking",
                text: "Schedule appointments 24/7 from any device",
              },
              {
                title: "Expert Doctors",
                text: "Qualified professionals across all specialties",
              },
              {
                title: "Instant Notifications",
                text: "Get reminders for your upcoming appointments",
              },
            ].map((feature, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="text-center">
                    <div
                      className="bg-primary bg-opacity-10 rounded-circle p-3 mb-3 mx-auto"
                      style={{ width: "80px" }}
                    >
                      {/* Icon placeholder */}
                      <span className="fs-3">📅</span>
                    </div>
                    <Card.Title>{feature.title}</Card.Title>
                    <Card.Text>{feature.text}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="bg-light py-5 mt-auto">
        <Container className="text-center">
          <h2 className="mb-4">Ready to book your appointment?</h2>
          <Button as={Link} to="/login" variant="primary" size="lg">
            Get Started
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;
