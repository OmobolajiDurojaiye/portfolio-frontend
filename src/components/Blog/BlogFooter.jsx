import { Container, Row, Col, Nav } from "react-bootstrap";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const BlogFooter = () => {
  return (
    <footer className="blog-footer">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <h4 className="fw-bold">The B Blog</h4>
            <p className="text-secondary mb-0">
              An ecosystem of thoughts and explorations.
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
        <Row className="mt-4 pt-4 border-top border-secondary">
          <p
            className="mb-0 text-secondary text-center"
            style={{ opacity: 0.7 }}
          >
            &copy; {new Date().getFullYear()} Bolaji. All rights reserved.
          </p>
        </Row>
      </Container>
    </footer>
  );
};

export default BlogFooter;
