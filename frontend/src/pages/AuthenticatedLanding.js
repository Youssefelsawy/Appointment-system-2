import { Link } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

const AuthenticatedLanding = ({ user }) => {
  return (
    <Container className="py-4">
      <h2 className="mb-4">Welcome back, {user.name}!</h2>
      <Row>
        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>My Appointments</Card.Title>
              <Card.Text>View and manage your upcoming appointments</Card.Text>
              <Button as={Link} to="/appointments" variant="primary">
                Go to Appointments
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Book New Appointment</Card.Title>
              <Card.Text>
                Schedule a new consultation with our doctors
              </Card.Text>
              <Button as={Link} to="/book-appointment" variant="success">
                Book Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthenticatedLanding;
