import { useState, useEffect, useCallback } from "react";
import { Button, Spinner, Alert, Row, Col, Card, Badge, Container } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import apiClient from "../../services/api";
import ProjectModal from "./ProjectModal";
import "../../pages/Admin/Admin.css";

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
      <div className="text-center py-5">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  return (
    <div className="project-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-white fw-bold m-0">Portfolio Projects</h3>
        <Button onClick={handleAdd} className="theme-button">
          <FaPlus className="me-2" /> New Project
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Col key={project.id} xs={12} md={6} lg={4} xl={3}>
              <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: "var(--background-elevated)", overflow: "hidden" }}>
                <div style={{ height: "160px", overflow: "hidden", position: "relative" }}>
                   {project.image_url ? (
                     <img 
                       src={project.image_url} 
                       alt={project.title} 
                       style={{ width: "100%", height: "100%", objectFit: "cover" }}
                     />
                   ) : (
                     <div className="d-flex align-items-center justify-content-center h-100 bg-dark text-secondary">
                        <span className="small">No Image</span>
                     </div>
                   )}
                   <div style={{ position: "absolute", top: 10, right: 10 }}>
                      <Badge bg="dark" className="opacity-75">Order: {project.order}</Badge>
                   </div>
                </div>
                
                <Card.Body className="d-flex flex-column">
                  <h5 className="text-white fw-bold mb-1 text-truncate" title={project.title}>{project.title}</h5>
                  <p className="text-secondary small mb-3">{project.role}</p>
                  
                  <div className="mb-3 flex-grow-1">
                    <div className="d-flex flex-wrap gap-1">
                        {project.tech_stack && project.tech_stack.slice(0, 3).map((tech, i) => (
                            <Badge key={i} bg="secondary" className="fw-normal">{tech.trim()}</Badge>
                        ))}
                        {project.tech_stack && project.tech_stack.length > 3 && (
                            <Badge bg="secondary" className="fw-normal">+{project.tech_stack.length - 3}</Badge>
                        )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between pt-3 border-top border-secondary">
                     <div className="d-flex gap-2">
                        {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="text-secondary hover-white"><FaGithub/></a>}
                        {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" className="text-secondary hover-white"><FaExternalLinkAlt/></a>}
                     </div>
                     <div className="d-flex gap-2">
                        <Button variant="outline-info" size="sm" onClick={() => handleEdit(project)} className="p-1 px-2">
                            <FaEdit />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(project.id)} className="p-1 px-2">
                            <FaTrash />
                        </Button>
                     </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12}>
             <div className="text-center py-5 rounded border border-secondary border-dashed" style={{backgroundColor: "rgba(255,255,255,0.02)"}}>
                <h5 className="text-secondary">No projects found.</h5>
                <p className="text-muted">Start building your portfolio by adding a project.</p>
                <Button variant="outline-primary" onClick={handleAdd}>Add First Project</Button>
             </div>
          </Col>
        )}
      </Row>

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
