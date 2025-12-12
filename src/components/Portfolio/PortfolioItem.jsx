import { useState } from "react";
import { Badge } from "react-bootstrap";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaUsers,
  FaDollarSign,
  FaClock,
} from "react-icons/fa";

const PortfolioItem = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="portfolio-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="portfolio-media">
        <img
          src={project.image_url || "https://via.placeholder.com/600x400"}
          alt={project.title}
          className="portfolio-thumbnail"
        />
        {project.video_url && (
          <video
            src={project.video_url}
            className={`portfolio-video ${isHovered ? "visible" : ""}`}
            autoPlay
            loop
            muted
            playsInline
          />
        )}
      </div>
      <div className="portfolio-content">
        <div className="portfolio-header">
          <h3 className="portfolio-title">{project.title}</h3>
          <div className="portfolio-links">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaExternalLinkAlt />
              </a>
            )}
          </div>
        </div>
        <p className="portfolio-description">{project.description}</p>

        <div className="portfolio-details">
          {project.duration && (
            <div>
              <FaClock className="me-2" />
              {project.duration}
            </div>
          )}
          {project.cost && (
            <div>
              <FaDollarSign className="me-2" />
              {project.cost.toFixed(2)}
            </div>
          )}
          {project.collaborators && (
            <div>
              <FaUsers className="me-2" />
              {project.collaborators}
            </div>
          )}
        </div>

        <div className="portfolio-tags">
          {project.tech_stack.map((tag) => (
            <Badge key={tag} className="tech-badge">
              {tag}
            </Badge>
          ))}
          {project.tools.map((tag) => (
            <Badge key={tag} className="tool-badge">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioItem;
