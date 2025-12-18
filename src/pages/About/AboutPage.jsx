import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Button,
  Accordion,
} from "react-bootstrap";
import { FaSpotify } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { useApi } from "../../hooks/useApi";
import ErrorDisplay from "../../components/ErrorDisplay";
import DynamicIcon from "../../utils/iconMap";
import "./AboutPage.css";

const workProcess = [
  {
    title: "01 Discovery Call",
    description:
      "In the first stage, we'll have a Discovery Call to discuss your goals, needs, and project requirements. This helps us align our vision and set the foundation for a successful collaboration.",
  },
  {
    title: "02 Project Proposal",
    description:
      "After our call, I will send you a detailed project proposal including the price quote. Upon agreement, you'll pay a deposit to secure the first milestone.",
  },
  {
    title: "03 Design & Development",
    description:
      "This is where the magic happens. I will design and develop your project, providing regular updates and milestones for your review and feedback.",
  },
  {
    title: "04 Review & Revisions",
    description:
      "We'll review the completed milestones together. This is the time for revisions to ensure the project perfectly matches your vision.",
  },
  {
    title: "05 Launch & Handover",
    description:
      "Once everything is approved, we'll deploy the project. I'll hand over all the necessary files and provide documentation for a smooth transition.",
  },
];

const HowIWork = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="how-i-work-container">
      <span className="section-eyebrow">How I Work</span>
      <div className="step-content">
        <h3 className="step-title">{workProcess[activeStep].title}</h3>
        <p className="step-description">
          {workProcess[activeStep].description}
        </p>
      </div>
      <div className="step-buttons">
        {workProcess.map((step, index) => (
          <button
            key={index}
            className={`step-button ${activeStep === index ? "active" : ""}`}
            onClick={() => setActiveStep(index)}
          >
            Step {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

function AboutPage() {
  const { data: aboutData, loading, error, retry } = useApi("/api/about/");

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (error) {
    return <ErrorDisplay onRetry={retry} />;
  }
  if (!aboutData) {
    return null;
  }

  return (
    <Container className="about-container py-5">
      <Row>
        <Col lg={5} className="mb-5 mb-lg-0">
          <h2 className="about-title">About Me</h2>
          <div className="about-bio text-secondary">
            <ReactMarkdown>{aboutData.bio}</ReactMarkdown>
          </div>
          {aboutData.spotify_url && (
            <a
              href={aboutData.spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              className="spotify-link"
            >
              <FaSpotify />
              <span>My Spotify Profile</span>
            </a>
          )}
        </Col>
        <Col lg={7}>
          <div className="section-block">
            <h3 className="section-heading">My Toolkit</h3>
            <div className="skills-grid">
              {aboutData.skills.map((skill) => (
                <div className="skill-item" key={skill.id}>
                  <DynamicIcon name={skill.icon_name} />
                  <span>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="section-block mt-4">
            <h3 className="section-heading">Work Tools</h3>
            <div className="skills-grid">
              {aboutData.tools.map((tool) => (
                <div className="skill-item" key={tool.id}>
                  <DynamicIcon name={tool.icon_name} />
                  <span>{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mt-5 pt-5">
        <Col>
          <HowIWork />
        </Col>
      </Row>
      <Row className="mt-5 pt-5">
        <Col>
          <div className="text-center mb-5">
            <h2 className="section-heading">Work Journey</h2>
          </div>
          <Accordion className="timeline-accordion">
            {aboutData.work_experiences.map((job, index) => (
              <Accordion.Item
                eventKey={String(index)}
                key={index}
                className="timeline-accordion-item"
              >
                <Accordion.Header className="timeline-accordion-header">
                  <div
                    className={`timeline-item ${
                      index % 2 === 0 ? "left" : "right"
                    }`}
                  >
                    <div className="timeline-content">
                      <h5 className="role">{job.role}</h5>
                      <p className="company text-secondary">{job.company}</p>
                      <span className="duration">{job.duration}</span>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body className="timeline-accordion-body">
                  <div
                    className={`timeline-item-body ${
                      index % 2 === 0 ? "left" : "right"
                    }`}
                  >
                    {job.description && (
                      <div className="work-description text-secondary">
                        <ReactMarkdown>{job.description}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutPage;
