import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    success: null,
    error: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        formData
      );
      setStatus({
        loading: false,
        success: response.data.message,
        error: null,
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      setStatus({ loading: false, success: null, error: errorMessage });
    }
  };

  return (
    <Container>
      <div className="text-center mb-5">
        <h2 className="section-title">Let's Talk</h2>
        <p className="section-subtitle">
          Have a project idea or just want to connect? Drop me a line!
        </p>
      </div>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                required
                value={formData.name}
                onChange={handleChange}
                style={inputStyles}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
                style={inputStyles}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                name="message"
                rows={5}
                placeholder="Your message here..."
                required
                value={formData.message}
                onChange={handleChange}
                style={inputStyles}
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit" disabled={status.loading}>
                {status.loading ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  "Send Message"
                )}
              </Button>
            </div>
          </Form>
          <div className="mt-4">
            {status.success && (
              <Alert variant="success">{status.success}</Alert>
            )}
            {status.error && <Alert variant="danger">{status.error}</Alert>}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

const inputStyles = {
  backgroundColor: "#141421",
  color: "#EFEFEF",
  border: "1px solid #2a2a3a",
};

export default ContactPage;
