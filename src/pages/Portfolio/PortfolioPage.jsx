import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Spinner, Badge } from "react-bootstrap";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaFileAlt,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa";
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
        <div className="portfolio-list">
          {projects.map((project, index) => (
            <div className="portfolio-list-item" key={project.id}>
              <div className="portfolio-item-image">
                <a
                  href={project.live_url || project.github_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={project.image_url} alt={project.title} />
                </a>
              </div>
              <div className="portfolio-item-content">
                <span className="portfolio-item-duration">
                  {project.duration}
                </span>
                <h3 className="portfolio-item-title">{project.title}</h3>
                <div className="portfolio-item-description">
                  <p>{project.description}</p>
                </div>

                <div className="portfolio-item-details">
                  {project.role && (
                    <div>
                      <h6>Role</h6>
                      <span>{project.role}</span>
                    </div>
                  )}
                  {project.collaborators && (
                    <div>
                      <h6>
                        <FaUsers /> Collaborators
                      </h6>
                      <span>{project.collaborators}</span>
                    </div>
                  )}
                  {project.cost && (
                    <div>
                      <h6>
                        <FaDollarSign /> Budget
                      </h6>
                      <span>${project.cost.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="portfolio-item-tags">
                  <h6>Tech Stack & Tools</h6>
                  <div>
                    {project.tech_stack.map((t) => (
                      <Badge key={t} className="tech-badge">
                        {t}
                      </Badge>
                    ))}
                    {project.tools.map((t) => (
                      <Badge key={t} className="tool-badge">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="portfolio-item-links">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="portfolio-link-button"
                    >
                      <FaExternalLinkAlt /> Live Site
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="portfolio-link-button"
                    >
                      <FaGithub /> GitHub
                    </a>
                  )}
                  {project.case_study_url && (
                    <a
                      href={project.case_study_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="portfolio-link-button primary"
                    >
                      <FaFileAlt /> Case Study
                    </a>
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
