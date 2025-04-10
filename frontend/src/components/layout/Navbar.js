import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { PersonFill } from "react-bootstrap-icons";

const AppNavbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check for user data on mount and when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      setUser(userData);
    };

    // Initial check
    handleStorageChange();

    // Listen for storage events
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Add this to listen for login/logout within same tab
  useEffect(() => {
    const interval = setInterval(() => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if ((userData && !user) || (!userData && user)) {
        setUser(userData);
      }
    }, 500); // Check every 500ms

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUser(null);
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Appointment System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user?.role === "patient" && (
              <>
                <Nav.Link as={Link} to="/appointments">
                  My Appointments
                </Nav.Link>
                <Nav.Link as={Link} to="/book-appointment">
                  Book Appointment
                </Nav.Link>
              </>
            )}
            {user?.role === "doctor" && (
              <Nav.Link as={Link} to="/doctor/schedule">
                My Schedule
              </Nav.Link>
            )}
            {user?.role === "admin" && (
              <Nav.Link as={Link} to="/admin/dashboard">
                Admin Dashboard
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3">
                  <PersonFill className="me-1" />
                  {user.name} ({user.role})
                </Navbar.Text>
                <Button variant="outline-danger" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="primary" as={Link} to="/login" className="ms-2">
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
