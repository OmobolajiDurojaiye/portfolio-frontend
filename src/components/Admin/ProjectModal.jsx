import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Spinner,
  Alert,
  Row,
  Col,
  ProgressBar,
} from "react-bootstrap";
import apiClient from "../../services/api";

const ProjectModal = ({ show, handleClose, project, onSave }) => {
  const initialFormState = {
    title: "",
    description: "",
    tech_stack: "",
    tools: "",
    live_url: "",
    github_url: "",
    image_url: "",
    duration: "",
    cost: "",
    collaborators: "",
    order: 0,
  };
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        tech_stack: project.tech_stack ? project.tech_stack.join(",") : "",
        tools: project.tools ? project.tools.join(",") : "",
        live_url: project.live_url || "",
        github_url: project.github_url || "",
        image_url: project.image_url || "",
        duration: project.duration || "",
        cost: project.cost || "",
        collaborators: project.collaborators || "",
        order: project.order || 0,
      });
    } else {
      setFormData(initialFormState);
    }
    setError(null);
    setUploadProgress(0);
  }, [project, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      setUploadProgress(0);
      const res = await apiClient.post("/api/portfolio/upload", uploadData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      setFormData((prevFormData) => ({
        ...prevFormData,
        image_url: res.data.secure_url,
      }));
    } catch (err) {
      setError("File upload failed. Please try again.");
    } finally {
      setTimeout(() => setUploadProgress(0), 1500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const apiCall = project
      ? apiClient.put(`/api/portfolio/projects/${project.id}`, {
          ...formData,
          video_url: "",
        })
      : apiClient.post("/api/portfolio/projects", {
          ...formData,
          video_url: "",
        });

    try {
      await apiCall;
      onSave();
      handleClose();
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
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
            <Col md={6}>
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
            <Col md={6}>
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
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Image/Thumbnail</Form.Label>
                <Form.Control
                  type="file"
                  name="image_url"
                  onChange={handleFileUpload}
                  accept="image/*"
                />
                {formData.image_url && (
                  <small className="text-success d-block mt-1">
                    Current Image: {formData.image_url.split("/").pop()}
                  </small>
                )}
                {uploadProgress > 0 && (
                  <ProgressBar
                    now={uploadProgress}
                    label={`${uploadProgress}%`}
                    className="mt-2"
                  />
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Live URL (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  name="live_url"
                  value={formData.live_url}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
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
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Cost (Optional, numbers only)</Form.Label>
                <Form.Control
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="e.g., 49.99"
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
                  placeholder="e.g., Jane Doe"
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
