import { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
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
  <div className="service-card-sm bento-hover-lift">
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
    className="featured-project-card bento-hover-lift"
  >
    <div className="featured-project-image">
      <img src={project.image_url} alt={project.title} />
    </div>
    <div className="featured-project-content">
      <h4 className="featured-project-title">{project.title}</h4>
      <span className="featured-project-view">View Project &rarr;</span>
    </div>
  </a>
);

function LandingPage() {
  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    apiClient
      .get("/api/portfolio/projects/featured")
      .then((res) => setFeaturedProjects(res.data.slice(0, 3))) // Fetch up to 3 to fill the space nicely
      .catch((err) => console.error("Failed to fetch featured projects", err));
  }, []);

  const fadeIn = (delay = 0) => ({
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
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

      <Container>
        <motion.div
           className="bento-grid"
           initial="hidden"
           animate="visible"
           variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Main Hero Card (Spans 2 cols, 2 rows) */}
          <motion.div variants={fadeIn(0)} className="bento-card bento-hero text-center d-flex flex-column align-items-center justify-content-center">
            <div className="hero-avatar">
              <img src={headshot} alt="Bolaji" className="hero-headshot" />
            </div>
            <h1 className="hero-headline">
              I create softwares to <br/>
              <span className="text-gradient">simplify life</span> and <span className="text-gradient">business workflow.</span>
            </h1>
            <p className="hero-subheadline">
              I’m Bolaji. I’m a software engineer, writer, and startup founder.
            </p>
            <div className="mt-2">
              <Link to="/portfolio">
                <Button size="md" className="cta-button">
                  View my portfolio
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* About Snippet Card (Spans 1 col, 1 row) */}
          <motion.div variants={fadeIn(0.1)} className="bento-card bento-about d-flex flex-column justify-content-center">
            <h4 className="bento-title playfair-font">
              Building digital products, brands, and experiences.
            </h4>
            <Link to="/about" className="bento-link text-gradient mt-auto d-inline-block pt-3">
              Learn more about me &rarr;
            </Link>
          </motion.div>

          {/* Featured Projects Card (Spans 1 col, 2 rows) */}
          <motion.div variants={fadeIn(0.2)} className="bento-card bento-projects d-flex flex-column">
            <h4 className="bento-title mb-4">Featured Projects</h4>
            <div className="bento-project-list flex-grow-1">
              {featuredProjects.map((p) => (
                <FeaturedProjectCard key={p.id} project={p} />
              ))}
              {featuredProjects.length === 0 && (
                <p className="text-muted small">Loading projects...</p>
              )}
            </div>
            <div className="pt-3 border-top-subtle mt-auto">
              <Link to="/portfolio" className="bento-link">
                View all projects &rarr;
              </Link>
            </div>
          </motion.div>

          {/* Services Card (Spans 2 cols, 1 row) */}
          <motion.div variants={fadeIn(0.3)} className="bento-card bento-services">
            <h4 className="bento-title mb-4">Core Capabilities</h4>
            <div className="bento-services-grid">
              <ServiceCard
                icon={<FaPalette />}
                title="UI & UX"
                description="Designing interfaces that are intuitive, efficient, and visually engaging."
              />
              <ServiceCard
                icon={<FaCode />}
                title="Web & App Dev"
                description="Transforming ideas into exceptional frontend and scalable backend systems."
              />
              <ServiceCard
                icon={<FaRocket />}
                title="Design & Creative"
                description="Crafting visually stunning structural architectures that connect."
              />
              <ServiceCard
                icon={<FaPaperPlane />}
                title="Writing & Insights"
                description="Bringing your vision to life with technical writing and documentation."
              />
            </div>
          </motion.div>

          {/* Bottom Contact CTA Card (Spans 3 cols) */}
          <motion.div variants={fadeIn(0.4)} className="bento-card bento-contact text-center d-flex flex-column align-items-center justify-content-center">
            <div className="cta-icon">
              <FaHandshake />
            </div>
            <h2 className="section-title mb-4 playfair-font">Tell me about your next project</h2>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button as={Link} to="/contact" className="cta-button px-5 py-3">
                Email Me
              </Button>
              <Button
                as={Link}
                to="/contact"
                variant="outline-light"
                className="cta-button-outline px-5 py-3"
              >
                Book a Call
              </Button>
            </div>
          </motion.div>

        </motion.div>
      </Container>
    </div>
  );
}

export default LandingPage;
