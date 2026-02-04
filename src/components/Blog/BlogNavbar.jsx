import { useState, useEffect } from "react";
import { Container, Nav, Form } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaThLarge, FaStream, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import apiClient from "../../services/api";
import "./BlogNavbar.css";

const BlogNavbar = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState(false); // Default collapsed on mobile
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get("/api/blog/categories")
      .then((res) => setCategories(res.data.slice(0, 4)))
      .catch((err) => console.error("Failed to fetch categories", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog/search?q=${searchQuery.trim()}`);
      setSearchQuery("");
      setExpanded(false); // Collapse after search
    }
  };

  return (
    <div className={`blog-nav-wrapper ${expanded ? "expanded" : "collapsed"}`}>
      <Container className="blog-nav-container">
        <div className="blog-nav-top">
            <Nav className="blog-nav-links">
            <Nav.Link as={NavLink} to="/blog" end onClick={() => setExpanded(false)}>
                <FaHome />
                <span className="d-none d-md-inline">Home</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/blog/categories" onClick={() => setExpanded(false)}>
                <FaThLarge />
                <span className="d-none d-md-inline">Categories</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/blog/readlists" onClick={() => setExpanded(false)}>
                <FaStream />
                <span className="d-none d-md-inline">Readlists</span>
            </Nav.Link>
            </Nav>

            <button 
                className="blog-nav-toggle d-lg-none" 
                onClick={() => setExpanded(!expanded)}
                aria-label="Toggle navigation"
            >
                {expanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
        </div>

        <div className="blog-nav-collapsible">
            <Nav className="blog-nav-categories">
            {categories.map((cat) => (
                <Nav.Link
                as={NavLink}
                to={`/blog/categories/${cat.slug}`}
                key={cat.id}
                className="category-pill-link"
                onClick={() => setExpanded(false)}
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
            <Form.Control
                type="search"
                placeholder="Search..."
                className="blog-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-icon-btn">
                <FaSearch />
            </button>
            </Form>
        </div>
      </Container>
    </div>
  );
};

export default BlogNavbar;
