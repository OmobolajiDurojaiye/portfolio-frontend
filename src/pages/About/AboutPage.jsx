import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner, Accordion } from "react-bootstrap";
import { FaSpotify } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import DynamicIcon from "../../utils/iconMap";
import "./AboutPage.css";

function AboutPage() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/about/`
        );
        setAboutData(response.data);
      } catch (error) {
        console.error("Error fetching about page data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!aboutData) {
    return (
      <Container className="text-center py-5">
        <p>Could not load page content.</p>
      </Container>
    );
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
