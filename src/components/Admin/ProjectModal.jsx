import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert, Row, Col } from "react-bootstrap";
import apiClient from "../../services/api";

const ProjectModal = ({ show, handleClose, project, onSave }) => {
  const initialFormState = {
    title: "",
    description: "",
    role: "",
    tech_stack: "",
    tools: "",
    live_url: "",
    github_url: "",
    image_url: "",
    case_study_url: "",
    duration: "",
    cost: "",
    collaborators: "",
    order: 0,
  };
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        role: project.role || "",
        tech_stack: project.tech_stack ? project.tech_stack.join(",") : "",
        tools: project.tools ? project.tools.join(",") : "",
        live_url: project.live_url || "",
        github_url: project.github_url || "",
        image_url: project.image_url || "",
        case_study_url: project.case_study_url || "",
        duration: project.duration || "",
        cost: project.cost || "",
        collaborators: project.collaborators || "",
        order: project.order || 0,
      });
    } else {
      setFormData(initialFormState);
    }
    setError(null);
  }, [project, show]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const apiCall = project
      ? apiClient.put(`/api/portfolio/projects/${project.id}`, formData)
      : apiClient.post("/api/portfolio/projects", formData);

    try {
      await apiCall;
      onSave();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {project ? "Edit Project" : "Add New Project"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Duration</Form.Label>
                <Form.Control
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 3 Months"
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Role / Contributions</Form.Label>
            <Form.Control
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g., Full-Stack Developer, API Design"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tech Stack (comma-separated)</Form.Label>
                <Form.Control
                  type="text"
                  name="tech_stack"
                  value={formData.tech_stack}
                  onChange={handleChange}
                  placeholder="React,Flask,Python"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tools (comma-separated)</Form.Label>
                <Form.Control
                  type="text"
                  name="tools"
                  value={formData.tools}
                  onChange={handleChange}
                  placeholder="Docker,Postman,Vercel"
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Image/Thumbnail URL</Form.Label>
            <Form.Control
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
            />
          </Form.Group>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Live URL</Form.Label>
                <Form.Control
                  type="text"
                  name="live_url"
                  value={formData.live_url}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>GitHub URL</Form.Label>
                <Form.Control
                  type="text"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Case Study URL</Form.Label>
                <Form.Control
                  type="text"
                  name="case_study_url"
                  value={formData.case_study_url}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Cost (Optional)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Collaborators (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="collaborators"
                  value={formData.collaborators}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Display Order</Form.Label>
                <Form.Control
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Save Project"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProjectModal;
