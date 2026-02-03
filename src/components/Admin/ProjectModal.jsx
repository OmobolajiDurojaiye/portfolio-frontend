import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert, Row, Col, Image } from "react-bootstrap";
import { FaSave, FaTimes } from "react-icons/fa";
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
      className="dark-modal"
    >
      <Modal.Header closeButton className="border-secondary bg-dark text-white">
        <Modal.Title className="fw-bold">
          {project ? "Edit Project" : "Add New Project"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="bg-dark text-white">
          {error && <Alert variant="danger">{error}</Alert>}
          
          <h6 className="text-secondary text-uppercase small fw-bold mb-3">General Info</h6>
          <Row className="g-3 mb-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label className="text-secondary small">Project Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="bg-dark text-white border-secondary"
                  placeholder="e.g. E-Commerce Platform"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-secondary small">Duration</Form.Label>
                <Form.Control
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 3 Months"
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="text-secondary small">Role / Contributions</Form.Label>
                <Form.Control
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Full-Stack Developer, UI/UX Design"
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label className="text-secondary small">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="bg-dark text-white border-secondary"
                  placeholder="Brief overview of the project..."
                />
              </Form.Group>
            </Col>
          </Row>

          <hr className="border-secondary my-4" />

          <h6 className="text-secondary text-uppercase small fw-bold mb-3">Media & URLS</h6>
          <Row className="g-3 mb-3">
             <Col md={8}>
                <Form.Group className="mb-3">
                    <Form.Label className="text-secondary small">Thumbnail Image URL</Form.Label>
                    <Form.Control
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    className="bg-dark text-white border-secondary"
                    placeholder="https://..."
                    />
                </Form.Group>
             </Col>
             <Col md={4}>
                <div className="border border-secondary rounded d-flex align-items-center justify-content-center" style={{ height: "80px", overflow: "hidden", backgroundColor: "rgba(255,255,255,0.02)" }}>
                    {formData.image_url ? (
                        <Image src={formData.image_url} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <span className="text-muted small">No Preview</span>
                    )}
                </div>
             </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-secondary small">Live URL</Form.Label>
                <Form.Control
                  type="text"
                  name="live_url"
                  value={formData.live_url}
                  onChange={handleChange}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-secondary small">GitHub URL</Form.Label>
                <Form.Control
                  type="text"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Col>
             <Col md={4}>
              <Form.Group>
                <Form.Label className="text-secondary small">Case Study URL</Form.Label>
                <Form.Control
                  type="text"
                  name="case_study_url"
                  value={formData.case_study_url}
                  onChange={handleChange}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Col>
          </Row>

          <hr className="border-secondary my-4" />

          <h6 className="text-secondary text-uppercase small fw-bold mb-3">Tech & Details</h6>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-secondary small">Tech Stack (comma-separated)</Form.Label>
                <Form.Control
                  type="text"
                  name="tech_stack"
                  value={formData.tech_stack}
                  onChange={handleChange}
                  placeholder="React, Flask, Python"
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-secondary small">Tools (comma-separated)</Form.Label>
                <Form.Control
                  type="text"
                  name="tools"
                  value={formData.tools}
                  onChange={handleChange}
                  placeholder="Docker, Postman"
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-secondary small">Cost</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-secondary small">Collaborators</Form.Label>
                <Form.Control
                  type="text"
                  name="collaborators"
                  value={formData.collaborators}
                  onChange={handleChange}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-secondary small">Display Order</Form.Label>
                <Form.Control
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Col>
          </Row>

        </Modal.Body>
        <Modal.Footer className="border-secondary bg-dark">
          <Button variant="outline-secondary" onClick={handleClose} disabled={loading}>
            <FaTimes className="me-2" /> Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading} className="px-4">
            {loading ? <Spinner size="sm" /> : <><FaSave className="me-2" /> Save Project</>}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProjectModal;
