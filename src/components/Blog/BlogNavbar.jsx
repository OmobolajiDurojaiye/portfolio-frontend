import { useState, useEffect } from "react";
import { Container, Nav, Form } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaThLarge, FaStream, FaSearch } from "react-icons/fa";
import apiClient from "../../services/api";
import "./BlogNavbar.css";

const BlogNavbar = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get("/api/blog/categories")
      .then((res) => setCategories(res.data.slice(0, 4))) // Show max 4 categories
      .catch((err) => console.error("Failed to fetch categories", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog/search?q=${searchQuery.trim()}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="blog-nav-wrapper">
      <Container className="blog-nav-container">
        <Nav className="blog-nav-links">
          <Nav.Link as={NavLink} to="/blog" end>
            <FaHome />
            <span>Home</span>
          </Nav.Link>
          <Nav.Link as={NavLink} to="/blog/categories">
            <FaThLarge />
            <span>All Categories</span>
          </Nav.Link>
          {/* Placeholder for Readlists link */}
          {/* <Nav.Link as={NavLink} to="/blog/readlists"><FaStream /><span>Readlists</span></Nav.Link> */}
        </Nav>
        <Nav className="blog-nav-categories ms-auto">
          {categories.map((cat) => (
            <Nav.Link
              as={NavLink}
              to={`/blog/categories/${cat.slug}`}
              key={cat.id}
              className="category-pill-link"
            >
              <span
                className="category-pill"
                style={{ "--category-color": cat.color }}
              >
                {cat.name}
              </span>
            </Nav.Link>
          ))}
        </Nav>
        <Form onSubmit={handleSearch} className="blog-search-form">
          <FaSearch className="search-icon" />
          <Form.Control
            type="search"
            placeholder="Search articles..."
            className="blog-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form>
      </Container>
    </div>
  );
};

export default BlogNavbar;
