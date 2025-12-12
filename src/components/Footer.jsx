import { Container, Row, Col, Nav } from "react-bootstrap";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="py-4" style={{ backgroundColor: "#141421" }}>
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0 text-secondary">
              &copy; {new Date().getFullYear()} Bolaji. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <Nav className="justify-content-center justify-content-md-end">
              <Nav.Link
                href="https://github.com"
                target="_blank"
                className="text-secondary fs-4"
              >
                <FaGithub />
              </Nav.Link>
              <Nav.Link
                href="https://linkedin.com"
                target="_blank"
                className="text-secondary fs-4"
              >
                <FaLinkedin />
              </Nav.Link>
              <Nav.Link
                href="https://twitter.com"
                target="_blank"
                className="text-secondary fs-4"
              >
                <FaTwitter />
              </Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
