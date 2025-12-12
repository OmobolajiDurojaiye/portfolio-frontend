import { Row, Col, Badge } from "react-bootstrap";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import "./ProjectItem.css";

function ProjectItem({ project, index }) {
  const isReversed = index % 2 !== 0;

  return (
    <Row
      className={`project-item-row align-items-center ${
        isReversed ? "flex-row-reverse" : ""
      }`}
    >
      <Col lg={7}>
        <div className="project-media-wrapper">
          <img
            src={project.image_url || "https://via.placeholder.com/800x600"}
            alt={project.title}
            className="project-thumbnail"
          />
        </div>
      </Col>
      <Col lg={5}>
        <div
          className={`project-details ${
            isReversed ? "text-lg-end" : "text-lg-start"
          }`}
        >
          <h3 className="project-title fw-bold mb-3">{project.title}</h3>
          <p className="project-description bg-transparent p-4 rounded">
            {project.description}
          </p>
          <div
            className={`d-flex flex-wrap gap-2 my-4 ${
              isReversed ? "justify-content-lg-end" : ""
            }`}
          >
            {project.tech_stack.map((tech) => (
              <Badge pill className="tech-badge" key={tech}>
                {tech}
              </Badge>
            ))}
            {project.tools.map((tool) => (
              <Badge pill className="tool-badge" key={tool}>
                {tool}
              </Badge>
            ))}
          </div>
          <div
            className={`project-links fs-4 mt-4 ${
              isReversed ? "text-lg-end" : ""
            }`}
          >
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="me-3"
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
      </Col>
    </Row>
  );
}

export default ProjectItem;
