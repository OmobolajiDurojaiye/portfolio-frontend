import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Spinner,
  Alert,
  Card,
  Col,
} from "react-bootstrap";
import { jwtDecode } from "jwt-decode";

function AdminLoginPage() {
  const [isSetupNeeded, setIsSetupNeeded] = useState(null); // null is our initial loading state
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // This effect runs only once to check if an admin account exists
    const checkSetup = async () => {
      setStatus({ loading: true, error: null, success: null });
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/check-setup`
        );
        setIsSetupNeeded(res.data.setup_needed);
        setStatus({ loading: false, error: null, success: null });
      } catch (error) {
        // THIS IS THE KEY: We now show an error if the backend is not reachable
        const errorMessage = error.response
          ? error.response.data.error
          : "Cannot connect to the server. Is the backend running?";
        setStatus({ loading: false, error: errorMessage, success: null });
        setIsSetupNeeded(false); // Set a default to stop the loading state
      }
    };
    checkSetup();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );
      setStatus({ loading: false, success: res.data.message, error: null });
      setShowOtpForm(true);
    } catch (err) {
      setStatus({
        loading: false,
        error: err.response?.data?.error || "Registration failed.",
        success: null,
      });
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-otp`,
        {
          email: formData.email,
          otp: formData.otp,
        }
      );
      setStatus({
        loading: false,
        success: res.data.message + " Reloading...",
        error: null,
      });
      setTimeout(() => window.location.reload(), 2000); // Reload to show login form
    } catch (err) {
      setStatus({
        loading: false,
        error: err.response?.data?.error || "Verification failed.",
        success: null,
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          username: formData.username,
          password: formData.password,
        }
      );
      const token = res.data.access_token;

      // --- NEW DIAGNOSTIC LOG ---
      try {
        const decodedToken = jwtDecode(token);
        console.log(
          "--- BROWSER DEBUG: Decoded Token on Login ---",
          decodedToken
        );
      } catch (e) {
        console.error("--- BROWSER DEBUG: Could not decode token! ---", e);
      }
      // --- END DIAGNOSTIC LOG ---

      localStorage.setItem("admin_token", token);
      navigate("/admin/dashboard");
    } catch (err) {
      setStatus({
        loading: false,
        error: err.response?.data?.error || "Login failed.",
        success: null,
      });
    }
  };

  const renderContent = () => {
    // State 1: We are still checking the backend
    if (isSetupNeeded === null && status.loading) {
      return (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-secondary">Checking admin status...</p>
        </div>
      );
    }

    // State 2: OTP form
    if (showOtpForm) {
      return (
        <Form onSubmit={handleVerify}>
          <h3 className="text-center mb-4">Enter Verification Code</h3>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="otp"
              placeholder="6-Digit OTP"
              value={formData.otp}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={status.loading}
          >
            {status.loading ? <Spinner size="sm" /> : "Verify Account"}
          </Button>
        </Form>
      );
    }

    // State 3: Setup form
    if (isSetupNeeded) {
      return (
        <Form onSubmit={handleRegister}>
          <h3 className="text-center mb-4">Admin Account Setup</h3>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={status.loading}
          >
            {status.loading ? <Spinner size="sm" /> : "Create Account"}
          </Button>
        </Form>
      );
    }

    // State 4: Login form
    return (
      <Form onSubmit={handleLogin}>
        <h3 className="text-center mb-4">Admin Login</h3>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="w-100"
          disabled={status.loading}
        >
          {status.loading ? <Spinner size="sm" /> : "Login"}
        </Button>
      </Form>
    );
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Col md={6} lg={4}>
        <Card
          bg="dark"
          text="light"
          className="p-4"
          style={{
            backgroundColor: "var(--background-elevated)",
            border: "1px solid var(--border-color)",
          }}
        >
          <Card.Body>
            {renderContent()}
            {/* We always show the status alerts at the bottom */}
            {status.error && (
              <Alert variant="danger" className="mt-4">
                {status.error}
              </Alert>
            )}
            {status.success && (
              <Alert variant="success" className="mt-4">
                {status.success}
              </Alert>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
}

export default AdminLoginPage;
