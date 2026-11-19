import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import apiClient from "../../services/api";
import "./Blog.css";

function CategoryPage() {
  const [data, setData] = useState({ category: null, posts: [] });
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/blog/categories/${slug}`);
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch category data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="paper-loading-box">
        <Spinner animation="border" size="sm" className="me-2" />
        Loading topic...
      </div>
    );
  }

  if (!data.category) {
    return (
      <div className="paper-row">
        <div className="paper-margin-cell">
          <span className="paper-margin-label">404</span>
        </div>
        <div className="paper-content-cell">
          <p className="paper-line-text">Category not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="paper-row">
        <div className="paper-margin-cell">
          <span className="paper-margin-label">Topic</span>
        </div>
        <div className="paper-content-cell">
          <div className="paper-entry-grid">
            <span
              className="paper-entry-icon paper-entry-icon--dot"
              style={{ backgroundColor: data.category.color || "#a162f7" }}
            />
            <span className="paper-entry-title" style={{ fontSize: "1.05rem" }}>
              {data.category.name}
            </span>
            <span className="paper-tag-stamp ms-auto">
              {data.posts?.length || 0} Articles
            </span>
          </div>
        </div>
      </div>

      <div className="paper-row paper-row--spacer">
        <div className="paper-margin-cell" />
        <div className="paper-content-cell" />
      </div>

      {data.posts && data.posts.length > 0 ? (
        data.posts.map((post, idx) => (
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
              No articles in this category yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
