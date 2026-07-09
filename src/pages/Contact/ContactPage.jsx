import { useState } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import BookingComponent from "../../components/Contact/BookingComponent";
import "./Contact.css";

import { useSearchParams } from "react-router-dom";

const ContactForm = () => {
  const [searchParams] = useSearchParams();
  const initialMessage = searchParams.get("message") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: initialMessage,
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
    <Form onSubmit={handleSubmit} noValidate className="clean-contact-form">
      {status.success && <Alert variant="success" className="mb-4">{status.success}</Alert>}
      {status.error && <Alert variant="danger" className="mb-4">{status.error}</Alert>}

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
    <div className="contact-page-container">
      <div className="contact-page-header">
        <h2 className="section-title text-center">Let's Connect</h2>
        <p className="section-subtitle text-center">
          Have a project idea, a question, or just want to say hi? I'd love to hear from you.
        </p>
      </div>

      <div className="contact-centered-box">
        {/* Switcher tabs */}
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

        {/* Content Section (No side panel) */}
        <div className="contact-content-pane">
          {view === "contact" ? <ContactForm /> : <BookingComponent />}
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
