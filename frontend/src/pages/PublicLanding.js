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
        <Button as={Link} to="/login" variant="primary" size="lg">
          Login
        </Button>
        <Button as={Link} to="/register" variant="outline-primary" size="lg">
          Register
        </Button>
        <Button as={Link} to="/guest-booking" variant="success" size="lg">
          Book as Guest
        </Button>
      </div>
    </Container>
  );
};

export default PublicLanding;
