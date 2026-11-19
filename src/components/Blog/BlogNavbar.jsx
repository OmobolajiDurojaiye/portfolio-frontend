import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import apiClient from "../../services/api";
import "./BlogNavbar.css";

const BlogNavbar = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get("/api/blog/categories")
      .then((res) => setCategories(Array.isArray(res.data) ? res.data.slice(0, 6) : []))
      .catch((err) => console.error("Failed to fetch categories", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="paper-nav-header">
      {/* Top blank notebook header band */}
      <div className="paper-row paper-row--top-pad">
        <div className="paper-margin-cell" />
        <div className="paper-content-cell paper-brand-line">
          <div className="paper-brand-title">
            <span className="paper-brand-name">bolaji</span>
            <span className="paper-brand-glyph" aria-hidden="true">✎</span>
            <span className="paper-brand-sub">The B Blog &amp; Notebook</span>
          </div>

          <form onSubmit={handleSearch} className="paper-search-form">
            <FaSearch className="paper-search-icon" />
            <input
              type="search"
              placeholder="Search notes..."
              className="paper-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search blog articles"
            />
          </form>
        </div>
      </div>

      {/* Navigation line */}
      <div className="paper-row">
        <div className="paper-margin-cell">
          <span className="paper-margin-label">Index</span>
        </div>
        <div className="paper-content-cell paper-nav-tabs-line">
          <nav className="paper-nav-tabs" aria-label="Blog sections">
            <NavLink
              to="/blog"
              end
              className={({ isActive }) => `paper-nav-tab ${isActive ? "is-active" : ""}`}
            >
              All Notes
            </NavLink>
            <NavLink
              to="/blog/readlists"
              className={({ isActive }) => `paper-nav-tab ${isActive ? "is-active" : ""}`}
            >
              Readlists
            </NavLink>
            <NavLink
              to="/blog/categories"
              className={({ isActive }) => `paper-nav-tab ${isActive ? "is-active" : ""}`}
            >
              Categories
            </NavLink>
          </nav>

          {categories.length > 0 && (
            <div className="paper-topic-chips">
              {categories.map((cat) => (
                <NavLink
                  key={cat.id}
                  to={`/blog/categories/${cat.slug}`}
                  className={({ isActive }) => `paper-topic-chip ${isActive ? "is-active" : ""}`}
                >
                  <span
                    className="paper-ink-dot"
                    style={{ backgroundColor: cat.color || "#a162f7" }}
                  />
                  <span>{cat.name}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default BlogNavbar;
