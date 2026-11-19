import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import apiClient from "../../services/api";
import "./Blog.css";

function ReadlistPage() {
  const [readlist, setReadlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchReadlist = async () => {
      try {
        const response = await apiClient.get(`/api/blog/readlists/${slug}`);
        setReadlist(response.data);
      } catch (err) {
        setError("Readlist not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchReadlist();
  }, [slug]);

  if (loading) {
    return (
      <div className="paper-loading-box">
        <Spinner animation="border" size="sm" className="me-2" />
        Loading readlist...
      </div>
    );
  }

  if (error || !readlist) {
    return (
      <div className="paper-row">
        <div className="paper-margin-cell">
          <span className="paper-margin-label">404</span>
        </div>
        <div className="paper-content-cell">
          <p className="paper-line-text">{error || "Readlist not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Row */}
      <div className="paper-row">
        <div className="paper-margin-cell">
          <span className="paper-margin-label">Readlist</span>
        </div>
        <div className="paper-content-cell">
          <div className="paper-readlist-banner">
            {readlist.image_url && (
              <img
                src={readlist.image_url}
                alt={readlist.name}
                className="paper-readlist-thumb"
              />
            )}
            <div>
              <h1 className="paper-article-title" style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
                {readlist.name}
              </h1>
              {readlist.description && (
                <p className="paper-line-text paper-line-muted">{readlist.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="paper-row paper-row--spacer">
        <div className="paper-margin-cell" />
        <div className="paper-content-cell" />
      </div>

      {/* Articles in Readlist */}
      {readlist.posts && readlist.posts.length > 0 ? (
        readlist.posts.map((post, index) => (
          <Link
            to={`/blog/${post.slug}`}
            key={post.id}
            className="paper-row paper-row--interactive"
          >
            <div className="paper-margin-cell">
              <span className="paper-margin-num">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="paper-content-cell">
              <div className="paper-entry-grid">
                <div className="paper-entry-icon">
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="paper-entry-main">
                  <span className="paper-entry-title">{post.title}</span>
                  {post.excerpt && (
                    <span className="paper-entry-desc">{post.excerpt}</span>
                  )}
                </div>
                <FiArrowUpRight className="paper-entry-arrow" />
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="paper-row">
          <div className="paper-margin-cell" />
          <div className="paper-content-cell">
            <p className="paper-line-text paper-line-muted">
              No articles added to this readlist yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadlistPage;
