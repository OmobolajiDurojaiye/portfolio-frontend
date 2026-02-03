import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  FaPalette,
  FaCode,
  FaRocket,
  FaPaperPlane,
  FaHandshake,
} from "react-icons/fa";
import apiClient from "../../services/api";
import headshot from "../../assets/PFP.jpg";
import "./LandingPage.css";

const ServiceCard = ({ icon, title, description }) => (
  <div className="service-card-sm">
    <div className="service-icon-sm">{icon}</div>
    <div>
      <h5 className="service-title-sm">{title}</h5>
      <p className="service-description-sm">{description}</p>
    </div>
  </div>
);

const FeaturedProjectCard = ({ project }) => (
  <a
    href={project.case_study_url || project.live_url || project.github_url}
    target="_blank"
    rel="noopener noreferrer"
    className="featured-project-card"
  >
    <div className="featured-project-image">
      <img src={project.image_url} alt={project.title} />
    </div>
    <div className="featured-project-content">
      <h4 className="featured-project-title">{project.title}</h4>
    </div>
  </a>
);

function LandingPage() {
  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    apiClient
      .get("/api/portfolio/projects/featured")
      .then((res) => setFeaturedProjects(res.data.slice(0, 2)))
      .catch((err) => console.error("Failed to fetch featured projects", err));
  }, []);

  const fadeIn = (delay = 0) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay },
    },
  });

  return (
    <div className="landing-page-wrapper">
      <Helmet>
        <title>Bolaji — Software Engineer & Digital Architect</title>
        <meta
          name="description"
          content="Portfolio of Bolaji — a software engineer crafting high-performance backend systems, intuitive frontend interfaces, and polished digital experiences."
        />
        <meta property="og:title" content="Bolaji — Software Engineer" />
        <meta
          property="og:description"
          content="Explore the portfolio and digital creations of Bolaji — building clean, scalable, and elegant software."
        />
        <meta property="og:image" content="https://bolaji.tech/favicon.jpg" />
        <meta property="og:url" content="https://bolaji.tech" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bolaji — Software Engineer" />
        <meta
          name="twitter:description"
          content="Clean engineering. Modern design. Thoughtful software by Bolaji."
        />
        <meta name="twitter:image" content="https://bolaji.tech/favicon.jpg" />
      </Helmet>
      <div className="landing-grid">
        {/* Main Content Area */}
        <div className="main-content">
          <section className="landing-section hero-section text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
            >
              <motion.div variants={fadeIn(0)} className="hero-avatar">
                <img
                  src={headshot}
                  alt="Bolaji"
                  className="hero-headshot"
                />
              </motion.div>
              <motion.h1 variants={fadeIn(0.2)} className="hero-headline">
                I create softwares to simplify life and Business workflow.
              </motion.h1>
              <motion.p variants={fadeIn(0.3)} className="hero-subheadline">
                I’m Bolaji. I’m a software
                engineer, writer, and startup founder.
              </motion.p>
              <motion.div variants={fadeIn(0.4)}>
                <Link to="/portfolio">
                  <Button size="md" className="cta-button">
                    View my portfolio
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </section>

          <section className="landing-section services-section">
            <Container>
              <div className="text-center">
                <span className="section-eyebrow">Services</span>
                <h2 className="section-title">
                  Collaborate with brands and agencies to create impactful
                  results.
                </h2>
              </div>
              <Row className="mt-5 justify-content-center">
                <Col lg={10}>
                  <Row>
                    <Col md={6} className="mb-4">
                      <ServiceCard
                        icon={<FaPalette />}
                        title="UI & UX"
                        description="Designing interfaces that are intuitive, efficient, and enjoyable to use."
                      />
                    </Col>
                    <Col md={6} className="mb-4">
                      <ServiceCard
                        icon={<FaCode />}
                        title="Web & App Development"
                        description="Transforming ideas into exceptional web and mobile app experiences."
                      />
                    </Col>
                    <Col md={6} className="mb-4">
                      <ServiceCard
                        icon={<FaRocket />}
                        title="Design & Creative"
                        description="Crafting visually stunning designs that connect with your audience."
                      />
                    </Col>
                    <Col md={6} className="mb-4">
                      <ServiceCard
                        icon={<FaPaperPlane />}
                        title="Writing & Insights"
                        description="Bringing your vision to life with the latest technology and design trends."
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </section>
        </div>

        {/* Sidebar Area */}
        <aside className="sidebar-content">
          <div className="sidebar-card">
            <h4 className="sidebar-title">
              Building digital products, brands, and experience.
            </h4>
            <Link to="/about" className="sidebar-link">
              Learn More &rarr;
            </Link>
          </div>

          <div className="sidebar-card">
            <h4 className="sidebar-title">
              Collaborate with brands and agencies to create impactful results.
            </h4>
            <div className="featured-projects-grid">
              {featuredProjects.map((p) => (
                <FeaturedProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>

          <div className="sidebar-card text-center">
            <div className="cta-icon">
              <FaHandshake />
            </div>
            <h4 className="sidebar-title">Tell me about your next project</h4>
            <div className="d-flex gap-2 justify-content-center mt-3">
              <Button
                as={Link}
                to="/contact"
                className="cta-button flex-grow-1"
              >
                Email Me
              </Button>
              <Button
                as={Link}
                to="/contact"
                variant="outline-light"
                className="cta-button-outline flex-grow-1"
              >
                Book a Call
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default LandingPage;
