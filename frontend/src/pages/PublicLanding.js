import { Link } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

const PublicLanding = () => {
  return (
    <Container className="text-center py-5">
      <h1>Welcome to Our Onnmed Clinic</h1>
      <p className="lead mb-4">
        Book appointments with top healthcare professionals
      </p>
      <div className="d-flex justify-content-center gap-3 flex-wrap">
        <Button
          as={Link}
          to="/login"
          variant="primary"
          size="lg"
          className="px-4"
        >
          Login
        </Button>
        <Button
          as={Link}
          to="/register"
          variant="primary"
          size="lg"
          className="px-4"
        >
          Register
        </Button>
        <Button
          as={Link}
          to="/guest-booking"
          variant="primary"
          size="lg"
          className="px-4"
        >
          Book as Guest
        </Button>
        <Button
          as={Link}
          to="/guest-appointments"
          variant="primary"
          size="lg"
          className="px-4"
        >
          View My Appointments
        </Button>
      </div>
    </Container>
  );
};

export default PublicLanding;
