import { useState, useEffect, useCallback } from "react";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import apiClient from "../../services/api";
import ProjectModal from "./ProjectModal";

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/api/portfolio/projects");
      setProjects(response.data);
    } catch (err) {
      setError("Failed to fetch projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAdd = () => {
    setSelectedProject(null);
    setShowModal(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await apiClient.delete(`/api/portfolio/projects/${id}`);
        fetchProjects(); // Refresh the list
      } catch (err) {
        setError("Failed to delete project.");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={handleAdd}>
          Add New Project
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover variant="dark" responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Tech Stack</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <tr key={project.id}>
                <td>{index + 1}</td>
                <td>{project.title}</td>
                <td>{project.tech_stack.join(", ")}</td>
                <td>
                  <Button
                    variant="outline-info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(project)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-secondary">
                No projects found. Add one to get started.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <ProjectModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        project={selectedProject}
        onSave={fetchProjects}
      />
    </div>
  );
};

export default ProjectManager;
