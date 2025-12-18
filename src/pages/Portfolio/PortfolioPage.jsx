import { Container, Spinner, Badge, Button } from "react-bootstrap";
import { FaGithub, FaExternalLinkAlt, FaFileAlt } from "react-icons/fa";
import { useApi } from "../../hooks/useApi";
import ErrorDisplay from "../../components/ErrorDisplay";
import "./PortfolioPage.css";

function PortfolioPage() {
  const {
    data: projects,
    loading,
    error,
    retry,
  } = useApi("/api/portfolio/projects");

  return (
    <Container className="portfolio-page-container">
      <div className="text-center mb-5">
        <h2 className="section-title">My Work</h2>
        <p className="section-subtitle">
          A collection of projects where I've turned complex challenges into
          elegant, functional digital solutions.
        </p>
      </div>
      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}
      {error && <ErrorDisplay onRetry={retry} />}
      {projects && (
        <div className="portfolio-list">
          {projects.map((project) => (
            <div className="portfolio-list-item" key={project.id}>
              <div className="portfolio-item-image">
                <img src={project.image_url} alt={project.title} />
              </div>
              <div className="portfolio-item-content">
                <span className="portfolio-item-duration">
                  {project.duration}
                </span>
                <h3 className="portfolio-item-title">{project.title}</h3>
                <p className="portfolio-item-description">
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
