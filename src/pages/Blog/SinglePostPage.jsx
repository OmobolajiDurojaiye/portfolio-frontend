import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiArrowUpRight } from "react-icons/fi";
import apiClient from "../../services/api";
import "./Blog.css";

function SinglePostPage() {
  const [post, setPost] = useState(null);
  const [relatedContent, setRelatedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPostData = async () => {
      try {
        setLoading(true);
        setError(null);
        const postRes = await apiClient.get(`/api/blog/posts/${slug}`);
        setPost(postRes.data);

        setTimeout(() => {
          const tables = document.querySelectorAll(".paper-article-body table");
          tables.forEach((table) => {
            if (!table.parentElement.classList.contains("table-responsive")) {
              const wrapper = document.createElement("div");
              wrapper.className = "table-responsive";
              table.parentNode.insertBefore(wrapper, table);
              wrapper.appendChild(table);
            }
          });
        }, 100);

        const relatedRes = await apiClient.get(`/api/blog/posts/${slug}/related`);
        setRelatedContent(relatedRes.data);

        apiClient.post(`/api/blog/posts/${slug}/view`).catch(console.error);
      } catch (err) {
        setError("Post not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [slug]);

  if (loading) {
    return (
      <div className="paper-loading-box">
        <Spinner animation="border" size="sm" className="me-2" />
        Opening entry...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="paper-row">
        <div className="paper-margin-cell">
          <span className="paper-margin-label">404</span>
        </div>
        <div className="paper-content-cell">
          <p className="paper-line-text">{error || "Post not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${post.title} | Blog by Omobolaji Durojaiye`}</title>
        <meta
          name="description"
          content={
            post.excerpt ||
            `Read '${post.title}' by Omobolaji Durojaiye, software engineer in Abuja, Nigeria.`
          }
        />
        <meta property="og:title" content={`${post.title} | Blog by Omobolaji Durojaiye`} />
        <meta
          property="og:description"
          content={post.excerpt || `Read '${post.title}' by Omobolaji Durojaiye.`}
        />
        <meta property="og:image" content={post.image_url || "https://bolaji.tech/favicon.png"} />
        <meta property="og:type" content="article" />
      </Helmet>

      <article>
        {/* Title & Meta Header */}
        <div className="paper-row" style={{ alignItems: "start" }}>
          <div className="paper-margin-cell" style={{ paddingTop: "1.6rem" }}>
            <span className="paper-margin-label">Entry</span>
          </div>
          <div className="paper-article-header">
            <nav className="paper-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/blog">Blog</Link>
              {post.category && (
                <>
                  <span>/</span>
                  <Link to={`/blog/categories/${post.category.slug}`}>
                    {post.category.name}
                  </Link>
                </>
              )}
            </nav>

            <h1 className="paper-article-title">{post.title}</h1>

            <div className="paper-article-meta">
              {post.author && <span>By {post.author}</span>}
              {post.date_posted && (
                <span>
                  {new Date(post.date_posted).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              {post.category && (
                <Link
                  to={`/blog/categories/${post.category.slug}`}
                  className="paper-tag-stamp"
                  style={{ textDecoration: "none" }}
                >
                  {post.category.name}
                </Link>
              )}
            </div>

            {post.image_url && (
              <div className="paper-article-cover">
                <img src={post.image_url} alt={post.title} />
              </div>
            )}
          </div>
        </div>

        {/* Main Body */}
        <div className="paper-row" style={{ alignItems: "start" }}>
          <div className="paper-margin-cell" style={{ paddingTop: "1.4rem" }}>
            <span className="paper-margin-label">Notes</span>
          </div>
          <div
            className="paper-article-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Related Content: In This Series */}
        {relatedContent?.inThisSeries?.length > 0 && (
          <>
            <div className="paper-row paper-row--spacer">
              <div className="paper-margin-cell" />
              <div className="paper-content-cell" />
            </div>
            {relatedContent.inThisSeries.map((p, idx) => (
              <Link
                key={p.id}
                to={`/blog/${p.slug}`}
                className="paper-row paper-row--interactive"
              >
                <div className="paper-margin-cell">
                  {idx === 0 ? (
                    <span className="paper-margin-label">In Series</span>
                  ) : (
                    <span className="paper-margin-num">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>
                <div className="paper-content-cell">
                  <div className="paper-entry-grid">
                    <div className="paper-entry-icon">
                      {p.image_url ? <img src={p.image_url} alt={p.title} /> : <span>§</span>}
                    </div>
                    <div className="paper-entry-main">
                      <span className="paper-entry-title">{p.title}</span>
                    </div>
                    <FiArrowUpRight className="paper-entry-arrow" />
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}

        {/* Related Content: More in Category */}
        {relatedContent?.moreInCategory?.length > 0 && (
          <>
            <div className="paper-row paper-row--spacer">
              <div className="paper-margin-cell" />
              <div className="paper-content-cell" />
            </div>
            {relatedContent.moreInCategory.map((p, idx) => (
              <Link
                key={p.id}
                to={`/blog/${p.slug}`}
                className="paper-row paper-row--interactive"
              >
                <div className="paper-margin-cell">
                  {idx === 0 ? (
                    <span className="paper-margin-label">More</span>
                  ) : (
                    <span className="paper-margin-num">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>
                <div className="paper-content-cell">
                  <div className="paper-entry-grid">
                    <div className="paper-entry-icon">
                      {p.image_url ? <img src={p.image_url} alt={p.title} /> : <span>•</span>}
                    </div>
                    <div className="paper-entry-main">
                      <span className="paper-entry-title">{p.title}</span>
                    </div>
                    <FiArrowUpRight className="paper-entry-arrow" />
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}

        {/* Previous / Next Navigation */}
        {(relatedContent?.previousPost || relatedContent?.nextPost) && (
          <div className="paper-row">
            <div className="paper-margin-cell">
              <span className="paper-margin-label">Pages</span>
            </div>
            <div className="paper-content-cell" style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
              <div className="paper-prev-next">
                {relatedContent.previousPost ? (
                  <Link
                    to={`/blog/${relatedContent.previousPost.slug}`}
                    className="paper-pn-link"
                  >
                    <span className="paper-pn-dir">← Previous</span>
                    <span className="paper-pn-title">{relatedContent.previousPost.title}</span>
                  </Link>
                ) : (
                  <div />
                )}
                {relatedContent.nextPost ? (
                  <Link
                    to={`/blog/${relatedContent.nextPost.slug}`}
                    className="paper-pn-link paper-pn-link--next"
                  >
                    <span className="paper-pn-dir">Next →</span>
                    <span className="paper-pn-title">{relatedContent.nextPost.title}</span>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        )}
      </article>
    </>
  );
}

export default SinglePostPage;
