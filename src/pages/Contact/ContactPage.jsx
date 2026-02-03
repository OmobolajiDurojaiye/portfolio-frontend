import { useState } from "react";
import { Container, Row, Col, Form, Button, Spinner, Alert } from "react-bootstrap";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import BookingComponent from "../../components/Contact/BookingComponent";
import "./Contact.css";

const ContactForm = () => {
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
        `${import.meta.env.VITE_API_URL}/api/contact/contact`,
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
    <Form onSubmit={handleSubmit} noValidate>
      <h5 className="mb-4" style={{ color: "var(--text-primary)", fontWeight: "600" }}>Send a Message</h5>
      {status.success && <Alert variant="success">{status.success}</Alert>}
      {status.error && <Alert variant="danger">{status.error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          placeholder="Enter your name"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>Message</Form.Label>
        <Form.Control
          as="textarea"
          name="message"
          rows={5}
          placeholder="Your message here..."
          required
          value={formData.message}
          onChange={handleChange}
        />
      </Form.Group>
      <div className="d-grid">
        <Button
          type="submit"
          disabled={status.loading}
          className="theme-button"
        >
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
  );
};

function ContactPage() {
  const [view, setView] = useState("contact");

  return (
    <Container className="contact-page-container">
      <div className="text-center mb-5">
        <h2 className="section-title">Let's Connect</h2>
        <p className="section-subtitle">
          Have a project idea, a question, or just want to say hi? I'd love to
          hear from you.
        </p>
      </div>
      <Row className="justify-content-center">
        <Col md={12} lg={10}>
          <div className="contact-wrapper">
            <div className="contact-info">
              <h3>Get in Touch</h3>
              <p>
                Use the form for general messages or book a dedicated session
                with me. You can also find me on these platforms:
              </p>
              <div className="social-links">
                <a
                  href="https://github.com/OmobolajiDurojaiye"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub /> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/omobolaji-durojaiye-527872294/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin /> LinkedIn
                </a>
                <a href="mailto:durojaiyeomobolaji93@gmail.com">
                  <FaEnvelope /> Email
                </a>
              </div>
            </div>
            <div className="contact-form-section">
              <div className="view-switcher">
                <button
                  className={view === "contact" ? "active" : ""}
                  onClick={() => setView("contact")}
                >
                  Send a Message
                </button>
                <button
                  className={view === "booking" ? "active" : ""}
                  onClick={() => setView("booking")}
                >
                  Book a Session
                </button>
              </div>
              {view === "contact" ? <ContactForm /> : <BookingComponent />}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ContactPage;
