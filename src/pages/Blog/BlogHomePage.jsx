import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiCornerDownLeft } from "react-icons/fi";
import apiClient from "../../services/api";
import ErrorDisplay from "../../components/ErrorDisplay";
import "./Blog.css";

function BlogHomePage() {
  const [data, setData] = useState({
    featuredPost: null,
    posts: [],
    readlists: [],
    pagination: {},
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchBlogData = async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const [homeRes, readlistsRes] = await Promise.all([
        apiClient.get(`/api/blog/home-data?page=${pageNum}`),
        pageNum === 1
          ? apiClient.get("/api/blog/readlists")
          : Promise.resolve({ data: null }),
      ]);

      const newData = homeRes.data;
      const readlistsData = readlistsRes.data;

      setData((prevData) => {
        if (pageNum === 1) {
          return {
            ...newData,
            readlists: readlistsData || newData.readlists || [],
          };
        }
        return {
          ...newData,
          posts: [...prevData.posts, ...(newData.posts || [])],
          featuredPost: prevData.featuredPost,
          readlists: prevData.readlists,
        };
      });
    } catch (err) {
      setError("Failed to load blog content. Please check back later.");
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBlogData(page);
  }, [page]);

  if (loading && page === 1) {
    return (
      <div className="paper-loading-box">
        <Spinner animation="border" size="sm" className="me-2" />
        Opening notebook...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorDisplay onRetry={() => fetchBlogData(1)} />
      </div>
    );
  }

  const { featuredPost, posts = [], readlists = [], pagination = {} } = data;

  // Polaroid preview covers from featured/latest posts
  const polaroidImages = [
    featuredPost?.image_url,
    ...posts.map((p) => p.image_url),
  ]
    .filter(Boolean)
    .slice(0, 2);

  return (
    <div className="paper-home-content">
      {/* Decorative Fanned Polaroid Stack (top right, like Image 6) */}
      {polaroidImages.length > 0 && (
        <div className="paper-polaroid-cluster" aria-hidden="true">
          {polaroidImages[1] && (
            <div className="paper-polaroid-card paper-polaroid-card--back">
              <img src={polaroidImages[1]} alt="" />
            </div>
          )}
          <div className="paper-polaroid-card paper-polaroid-card--front">
            <img src={polaroidImages[0]} alt="" />
          </div>
        </div>
      )}

      {/* About / Intro lines */}
      <div className="paper-row">
        <div className="paper-margin-cell">
          <span className="paper-margin-label">About</span>
        </div>
        <div className="paper-content-cell">
          <p className="paper-line-text">
            Thoughts, tutorials &amp; field notes on software engineering and startups.
          </p>
        </div>
      </div>

      <div className="paper-row">
        <div className="paper-margin-cell" />
        <div className="paper-content-cell">
          <p className="paper-line-text paper-line-muted">
            Written by Omobolaji Durojaiye — systems, AI agents, music &amp; curiosities.
          </p>
        </div>
      </div>

      <div className="paper-row paper-row--spacer">
        <div className="paper-margin-cell" />
        <div className="paper-content-cell" />
      </div>

      {/* Featured Article */}
      {featuredPost && (
        <>
          <Link
            to={`/blog/${featuredPost.slug}`}
            className="paper-row paper-row--interactive"
          >
            <div className="paper-margin-cell">
              <span className="paper-margin-label">Featured</span>
            </div>
            <div className="paper-content-cell">
              <div className="paper-entry-grid">
                <div className="paper-entry-icon">
                  {featuredPost.image_url ? (
                    <img src={featuredPost.image_url} alt={featuredPost.title} />
                  ) : (
                    <span>★</span>
                  )}
                </div>
                <div className="paper-entry-main">
                  <span className="paper-entry-title">{featuredPost.title}</span>
                  {featuredPost.excerpt && (
                    <span className="paper-entry-desc">{featuredPost.excerpt}</span>
                  )}
                </div>
                <div className="paper-entry-meta">
                  {featuredPost.category && (
                    <span className="paper-tag-stamp">{featuredPost.category.name}</span>
                  )}
                  <FiArrowUpRight className="paper-entry-arrow" />
                </div>
              </div>
            </div>
          </Link>

          <div className="paper-row paper-row--spacer">
            <div className="paper-margin-cell" />
            <div className="paper-content-cell" />
          </div>
        </>
      )}

      {/* Latest Articles */}
      {posts.length > 0 ? (
        posts.map((post, idx) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="paper-row paper-row--interactive"
          >
            <div className="paper-margin-cell">
              {idx === 0 ? (
                <span className="paper-margin-label">Latest</span>
              ) : (
                <span className="paper-margin-num">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              )}
            </div>
            <div className="paper-content-cell">
              <div className="paper-entry-grid">
                <div className="paper-entry-icon">
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} loading="lazy" />
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
                  {post.date_posted && (
                    <span className="paper-date-stamp d-none d-md-inline">
                      {new Date(post.date_posted).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  <FiArrowUpRight className="paper-entry-arrow" />
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="paper-row">
          <div className="paper-margin-cell">
            <span className="paper-margin-label">Latest</span>
          </div>
          <div className="paper-content-cell">
            <p className="paper-line-text paper-line-muted">No articles published yet.</p>
          </div>
        </div>
      )}

      {/* Load More Row */}
      {pagination.hasNext && (
        <div className="paper-row">
          <div className="paper-margin-cell" />
          <div className="paper-content-cell">
            <button
              type="button"
              className="paper-load-more-btn"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={loadingMore}
            >
              {loadingMore ? "Turning page..." : "Load more notes ↓"}
            </button>
          </div>
        </div>
      )}

      <div className="paper-row paper-row--spacer">
        <div className="paper-margin-cell" />
        <div className="paper-content-cell" />
      </div>

      {/* Curated Readlists Section */}
      {readlists.length > 0 && (
        <>
          {readlists.map((rl, idx) => (
            <Link
              key={rl.id}
              to={`/blog/readlists/${rl.slug}`}
              className="paper-row paper-row--interactive"
            >
              <div className="paper-margin-cell">
                {idx === 0 ? (
                  <span className="paper-margin-label">Readlists</span>
                ) : (
                  <span className="paper-margin-num">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                )}
              </div>
              <div className="paper-content-cell">
                <div className="paper-entry-grid">
                  <div className="paper-entry-icon">
                    {rl.image_url ? (
                      <img src={rl.image_url} alt={rl.name} loading="lazy" />
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
          ))}

          <Link to="/blog/readlists" className="paper-row paper-row--interactive">
            <div className="paper-margin-cell" />
            <div className="paper-content-cell">
              <div className="paper-entry-grid">
                <span className="paper-line-text paper-line-muted">
                  Browse all curated readlists
                </span>
                <FiArrowUpRight className="paper-entry-arrow ms-auto" />
              </div>
            </div>
          </Link>
        </>
      )}

      {/* Yellow Sticky Note (Bottom Right like Image 6) */}
      <div className="paper-sticky-wrapper">
        <div className="paper-sticky-note">
          <div className="paper-sticky-tape" aria-hidden="true" />
          <h3 className="paper-sticky-heading">Subscribe to The B Blog?</h3>
          <p className="paper-sticky-text">
            Catch new essays &amp; engineering notes on Substack or via RSS ;)
          </p>
          <a
            href="https://substack.com/@bjtolu"
            target="_blank"
            rel="noopener noreferrer"
            className="paper-sticky-cta"
          >
            <span>substack.com/@bjtolu</span>
            <span className="paper-sticky-btn-badge">
              <FiCornerDownLeft />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default BlogHomePage;
