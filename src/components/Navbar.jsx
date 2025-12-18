import { useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function AppNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Navbar
        expand="lg"
        variant="dark"
        className={`main-navbar ${isOpen ? "menu-open" : ""}`}
        sticky="top"
      >
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="fw-bold">
            Bolaji<span className="accent-text">.</span>
          </Navbar.Brand>

          {/* Mobile Nav Toggle */}
          <button
            className={`hamburger-menu d-lg-none ${isOpen ? "is-active" : ""}`}
            onClick={toggleMenu}
          >
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </button>

          {/* Desktop Nav */}
          <Navbar.Collapse className="d-none d-lg-flex">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={NavLink} to="/about" className="nav-item-custom">
                About
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/portfolio"
                className="nav-item-custom"
              >
                Portfolio
              </Nav.Link>
              <Nav.Link as={NavLink} to="/blog" className="nav-item-custom">
                Blog
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/marketplace"
                className="nav-item-custom"
              >
                Marketplace
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contact">
                <Button
                  variant="outline-primary"
                  className="ms-lg-3 cta-button-nav"
                >
                  Contact Me
                </Button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Full Screen Mobile Menu */}
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
}

export default AppNavbar;
