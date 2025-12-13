import { useState } from "react";
import { Container, Nav } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import "./LandingPage.css";

const LandingPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLinkClick = () => setIsOpen(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.8 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <>
      <div className="landing-wrapper">
        <div className="landing-frame">
          <header className="landing-header">
            <Link to="/" className="landing-logo">
              B<span className="accent-dot">.</span>
            </Link>
            <Link
              to="/contact"
              className="landing-contact-button d-none d-md-block"
            >
              Contact
            </Link>
            <button
              className={`hamburger-menu d-md-none ${
                isOpen ? "is-active" : ""
              }`}
              onClick={toggleMenu}
            >
              <div className="bar"></div>
              <div className="bar"></div>
            </button>
          </header>

          <Container className="landing-content">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.p variants={itemVariants} className="landing-intro">
                I'm Omobolaji Durojaiye; you can call me Bolaji.
              </motion.p>
              <motion.p variants={itemVariants} className="landing-subline">
                I design and ship software across web, product, and platforms.
              </motion.p>
              <motion.div variants={itemVariants} className="landing-headline">
                <h1>Developer</h1>
                <h1>Writer</h1>
                <h1>Builder</h1>
              </motion.div>
            </motion.div>
          </Container>

          <aside className="landing-sidebar left">
            <div className="vertical-nav">
              <Link to="/about">About</Link>
              <Link to="/portfolio">Work</Link>
              <Link to="/blog">Blog</Link>
            </div>
            <div className="social-icons">
              <a
                href="https://github.com/OmobolajiDurojaiye"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/omobolaji-durojaiye-527872294/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* Full Screen Mobile Menu for Landing Page */}
      <div className={`fullscreen-menu ${isOpen ? "is-open" : ""}`}>
        <Nav className="flex-column fullscreen-nav-links">
          <Nav.Link as={NavLink} to="/about" onClick={handleLinkClick}>
            About
          </Nav.Link>
          <Nav.Link as={NavLink} to="/portfolio" onClick={handleLinkClick}>
            Portfolio
          </Nav.Link>
          <Nav.Link as={NavLink} to="/blog" onClick={handleLinkClick}>
            Blog
          </Nav.Link>
          <Nav.Link as={NavLink} to="/marketplace" onClick={handleLinkClick}>
            Marketplace
          </Nav.Link>
          <Nav.Link as={NavLink} to="/contact" onClick={handleLinkClick}>
            Contact
          </Nav.Link>
        </Nav>
      </div>
    </>
  );
};

export default LandingPage;
