import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPalette,
  FaCode,
  FaRocket,
  FaPaperPlane,
  FaHandshake,
} from "react-icons/fa";
import "./LandingPage.css";

const ServiceCard = ({ icon, title, description, link, linkText }) => (
  <motion.div className="service-card" whileHover={{ y: -5 }}>
    <div className="service-icon">{icon}</div>
    <h4 className="service-title">{title}</h4>
    <p className="service-description">{description}</p>
    <Link to={link} className="service-link">
      {linkText} &rarr;
    </Link>
  </motion.div>
);

function LandingPage() {
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
      {/* Hero Section */}
      <section className="landing-section hero-section text-center">
        <Container>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          >
            <motion.div variants={fadeIn(0)} className="hero-avatar">
              <Link to="/" className="hero-brand-link">
                B<span className="accent-text">.</span>
              </Link>
            </motion.div>
            <motion.h1 variants={fadeIn(0.2)} className="hero-headline">
              Creating softwares to simplify life and Business
              workflow.
            </motion.h1>
            <motion.div variants={fadeIn(0.4)}>
              <Link to="/about">
                <Button size="md" className="cta-button">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Services Section */}
      <section className="landing-section services-section">
        <Container>
          <div className="text-center">
            <span className="section-eyebrow">Services</span>
            <h2 className="section-title">
              Collaborate with brands and agencies to create impactful results.
            </h2>
          </div>
          <Row className="mt-5">
            <Col md={6} lg={3} className="mb-4">
              <ServiceCard
                icon={<FaPalette />}
                title="UI & UX"
                description="Designing interfaces that are intuitive, efficient, and enjoyable to use."
                link="/about"
                linkText="My Process"
              />
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <ServiceCard
                icon={<FaCode />}
                title="Web & App Development"
                description="Building exceptional web and mobile app experiences from the ground up."
                link="/portfolio"
                linkText="View Projects"
              />
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <ServiceCard
                icon={<FaRocket />}
                title="Digital Products"
                description="Creating ready-to-use digital assets and applications."
                link="/marketplace"
                linkText="Visit Marketplace"
              />
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <ServiceCard
                icon={<FaPaperPlane />}
                title="Writing & Insights"
                description="Exploring ideas in tech, conservations, and music through writing."
                link="/blog"
                linkText="Read The Blog"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="landing-section cta-section text-center">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeIn()}
          >
            <div className="cta-icon">
              <FaHandshake />
            </div>
            <h2 className="section-title">Tell me about your next project</h2>
            <div className="d-flex gap-3 justify-content-center mt-4">
              <Button as={Link} to="/contact" size="md" className="cta-button">
                Book an Appointment
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}

export default LandingPage;
