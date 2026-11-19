import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useSearchParams, Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import apiClient from "../../services/api";
import "./Blog.css";

const BlogSearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      setLoading(true);
      apiClient
        .get(`/api/blog/search?q=${encodeURIComponent(query)}`)
        .then((res) => setResults(Array.isArray(res.data) ? res.data : []))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [query]);

  return (
    <div>
      <div className="paper-row">
        <div className="paper-margin-cell">
          <span className="paper-margin-label">Search</span>
        </div>
        <div className="paper-content-cell">
          <p className="paper-line-text">
            Results for <strong>"{query}"</strong>
          </p>
        </div>
      </div>

      <div className="paper-row paper-row--spacer">
        <div className="paper-margin-cell" />
        <div className="paper-content-cell" />
      </div>

      {loading ? (
        <div className="paper-loading-box">
          <Spinner animation="border" size="sm" className="me-2" />
          Searching notebook...
        </div>
      ) : results.length > 0 ? (
        results.map((post, idx) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="paper-row paper-row--interactive"
          >
            <div className="paper-margin-cell">
              <span className="paper-margin-num">
                {String(idx + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="paper-content-cell">
              <div className="paper-entry-grid">
                <div className="paper-entry-icon">
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} />
                  ) : (
                    <span>{post.title?.[0] || "B"}</span>
                  )}
                </div>
                <div className="paper-entry-main">
                  <span className="paper-entry-title">{post.title}</span>
                  {post.excerpt && (
                    <span className="paper-entry-desc">{post.excerpt}</span>
                  )}
                </div>
                <div className="paper-entry-meta">
                  {post.category && (
                    <span className="paper-tag-stamp">{post.category.name}</span>
                  )}
                  <FiArrowUpRight className="paper-entry-arrow" />
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="paper-row">
          <div className="paper-margin-cell" />
          <div className="paper-content-cell">
            <p className="paper-line-text paper-line-muted">
              No articles found matching "{query}".
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogSearchResults;
