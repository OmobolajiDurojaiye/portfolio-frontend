import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./LandingPage.css";

function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <div className="landing-wrapper">
      <Container className="text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="display-2 fw-bolder mb-3"
          >
            Architecting Digital Realities.
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="lead-custom mx-auto mb-5"
          >
            I'm Bolaji, a software engineer specializing in building elegant,
            high-performance systems. A fusion of logic and creative intuition,
            where complex problems find seamless solutions.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link to="/portfolio">
              <Button
                variant="primary"
                size="lg"
                className="me-3 mb-2 mb-md-0 cta-button"
              >
                View My Work
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline-primary"
                size="lg"
                className="cta-button-outline"
              >
                More About Me
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </Container>
      <div className="generative-art-bg"></div>
    </div>
  );
}

export default LandingPage;
