import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import apiClient from "../../services/api";
import "./Blog.css";

function CategoriesListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get("/api/blog/categories");
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="paper-loading-box">
        <Spinner animation="border" size="sm" className="me-2" />
        Loading categories...
      </div>
    );
  }

  return (
    <div>
      <div className="paper-row">
        <div className="paper-margin-cell">
          <span className="paper-margin-label">Categories</span>
        </div>
        <div className="paper-content-cell">
          <p className="paper-line-text">Explore notebook entries by topic.</p>
        </div>
      </div>

      <div className="paper-row paper-row--spacer">
        <div className="paper-margin-cell" />
        <div className="paper-content-cell" />
      </div>

      {categories.map((cat, idx) => (
        <Link
          key={cat.id}
          to={`/blog/categories/${cat.slug}`}
          className="paper-row paper-row--interactive"
        >
          <div className="paper-margin-cell">
            <span className="paper-margin-num">
              {String(idx + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="paper-content-cell">
            <div className="paper-entry-grid">
              <span
                className="paper-entry-icon paper-entry-icon--dot"
                style={{ backgroundColor: cat.color || "#a162f7" }}
              />
              <div className="paper-entry-main">
                <span className="paper-entry-title">{cat.name}</span>
                {cat.description && (
                  <span className="paper-entry-desc">{cat.description}</span>
                )}
              </div>
              <FiArrowUpRight className="paper-entry-arrow" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default CategoriesListPage;
