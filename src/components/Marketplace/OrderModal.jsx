import { useState } from "react";
import { Modal, Form, Button, Spinner, Alert } from "react-bootstrap";
import apiClient from "../../services/api";

const OrderModal = ({ show, handleClose, product }) => {
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.product_id = product.id;

    try {
      const res = await apiClient.post("/api/marketplace/orders", data);
      setStatus({ loading: false, error: null, success: res.data.message });
    } catch (err) {
      setStatus({
        loading: false,
        success: null,
        error: "Failed to submit order. Please try again.",
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Order Inquiry: {product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {status.success ? (
          <Alert variant="success">{status.success}</Alert>
        ) : (
          <Form onSubmit={handleSubmit}>
            {status.error && <Alert variant="danger">{status.error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control name="name" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" name="email" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number (Optional)</Form.Label>
              <Form.Control type="tel" name="phone" />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={status.loading}
              className="w-100"
            >
              {status.loading ? <Spinner size="sm" /> : "Submit Inquiry"}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default OrderModal;
