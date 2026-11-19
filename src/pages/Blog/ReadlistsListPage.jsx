import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import apiClient from "../../services/api";
import "./Blog.css";

function ReadlistsListPage() {
  const [readlists, setReadlists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadlists = async () => {
      try {
        const res = await apiClient.get("/api/blog/readlists");
        setReadlists(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to fetch readlists", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReadlists();
  }, []);

  if (loading) {
    return (
      <div className="paper-loading-box">
        <Spinner animation="border" size="sm" className="me-2" />
        Loading readlists...
      </div>
    );
  }

  return (
    <div>
      <div className="paper-row">
        <div className="paper-margin-cell">
          <span className="paper-margin-label">Readlists</span>
        </div>
        <div className="paper-content-cell">
          <p className="paper-line-text">
            Curated multi-part series &amp; themed reading collections.
          </p>
        </div>
      </div>

      <div className="paper-row paper-row--spacer">
        <div className="paper-margin-cell" />
        <div className="paper-content-cell" />
      </div>

      {readlists.length > 0 ? (
        readlists.map((rl, idx) => (
          <Link
            key={rl.id}
            to={`/blog/readlists/${rl.slug}`}
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
                  {rl.image_url ? (
                    <img src={rl.image_url} alt={rl.name} />
                  ) : (
                    <span>§</span>
                  )}
                </div>
                <div className="paper-entry-main">
                  <span className="paper-entry-title">{rl.name}</span>
                  {rl.description && (
                    <span className="paper-entry-desc">{rl.description}</span>
                  )}
                </div>
                <div className="paper-entry-meta">
                  <span className="paper-tag-stamp">
                    {rl.posts?.length || 0} Articles
                  </span>
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
              No readlists curated yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadlistsListPage;
