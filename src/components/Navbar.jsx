import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function AppNavbar() {
  return (
    <Navbar
      expand="lg"
      variant="dark"
      style={{ background: "transparent", backdropFilter: "blur(10px)" }}
      sticky="top"
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold">
          Bolaji<span style={{ color: "#9D5DFF" }}>.</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={NavLink} to="/about" className="nav-item-custom">
              About
            </Nav.Link>
            <Nav.Link as={NavLink} to="/portfolio" className="nav-item-custom">
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
  );
}

export default AppNavbar;
