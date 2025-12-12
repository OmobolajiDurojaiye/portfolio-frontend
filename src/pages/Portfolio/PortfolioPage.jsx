import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Spinner, Badge, Button } from "react-bootstrap";
import { FaGithub, FaExternalLinkAlt, FaFileAlt } from "react-icons/fa";
import "./PortfolioPage.css";

function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/portfolio/projects`
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <Container className="portfolio-page-container">
      <div className="text-center mb-5">
        <h2 className="section-title">My Work</h2>
        <p className="section-subtitle">
          A collection of projects where I've turned complex challenges into
          elegant, functional digital solutions.
        </p>
      </div>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="portfolio-grid-staggered">
          {projects.map((project, index) => (
            <div className="portfolio-card-staggered" key={project.id}>
              <div className="portfolio-card-image">
                <img src={project.image_url} alt={project.title} />
              </div>
              <div className="portfolio-card-content">
                <span className="portfolio-card-duration">
                  {project.duration}
                </span>
                <h3 className="portfolio-card-title">{project.title}</h3>
                <p className="portfolio-card-description">
                  {project.description}
                </p>
                {project.role && (
                  <p className="portfolio-card-role">
                    <strong>My Role:</strong> {project.role}
                  </p>
                )}

                <div className="portfolio-card-tags">
                  <h6>Tech Stack:</h6>
                  <div>
                    {project.tech_stack.map((t) => (
                      <Badge key={t} className="tech-badge">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="portfolio-card-links">
                  {project.live_url && (
                    <Button
                      variant="light"
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaExternalLinkAlt /> Live Site
                    </Button>
                  )}
                  {project.github_url && (
                    <Button
                      variant="outline-light"
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub /> GitHub
                    </Button>
                  )}
                  {project.case_study_url && (
                    <Button
                      variant="outline-info"
                      href={project.case_study_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFileAlt /> Case Study
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}

export default PortfolioPage;
