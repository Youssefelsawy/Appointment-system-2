import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner, Card } from "react-bootstrap";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA verification");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/login`,
        {
          ...formData,
          recaptchaToken,
        }
      );

      // Store authentication data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data.user));

      // Redirect based on role
      const redirectPaths = {
        patient: "/",
        doctor: "/doctor/schedule",
        admin: "/admin/dashboard",
      };

      navigate(redirectPaths[res.data.user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: "100%", maxWidth: "450px" }}>
        <Card.Body>
          <div className="text-center mb-4">
            <h3>Appointment System Login</h3>
            <p className="text-muted">
              Sign in as patient, doctor, or administrator
            </p>
          </div>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
                required
              />
            </Form.Group>

            <ReCAPTCHA
              sitekey="6Lc-IhArAAAAAMjqwLRF9ytByfCWAM05xtr8Zoe3"
              onChange={(token) => setRecaptchaToken(token)}
              className="mb-3"
            />

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-100 py-2"
            >
              {loading ? (
                <Spinner as="span" size="sm" animation="border" role="status" />
              ) : (
                "Login"
              )}
            </Button>
          </Form>

          <div className="mt-3 text-center">
            <p className="mb-1">
              <a href="/forgot-password">Forgot password?</a>
            </p>
            <p>
              Don't have an account? <a href="/register">Register as patient</a>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
