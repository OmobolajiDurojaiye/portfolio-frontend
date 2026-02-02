import { useState, useEffect } from "react";
import { Container, Spinner, Card } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
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
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error || !readlist) {
    return (
      <Container className="text-center py-5">
        <h2 className="section-title">404 - Not Found</h2>
        <p className="section-subtitle">{error}</p>
      </Container>
    );
  }

  return (
    <Container className="readlist-page-container py-5 px-md-5">
      <div className="text-center mb-5 readlist-header">
        {readlist.image_url && (
          <img
            src={readlist.image_url}
            alt={readlist.name}
            className="readlist-cover-img"
          />
        )}
        <h1 className="section-title mt-4">{readlist.name}</h1>
        <p className="section-subtitle">{readlist.description}</p>
      </div>
      <div className="posts-column">
        {readlist.posts &&
          readlist.posts.map((post, index) => (
            <Link
              to={`/blog/${post.slug}`}
              key={post.id}
              className="readlist-magazine-item"
            >
              <div className="readlist-magazine-number">
                <span>{(index + 1).toString().padStart(2, "0")}</span>
              </div>
              <div className="readlist-magazine-img-container">
                <img
                  src={post.image_url || "https://via.placeholder.com/600x400"}
                  alt={post.title}
                />
              </div>
              <div className="readlist-magazine-content">
                <h4 className="magazine-title">{post.title}</h4>
                <p className="magazine-excerpt">{post.excerpt}</p>
                <div className="magazine-meta">
                  Read Article &rarr;
                </div>
              </div>
            </Link>
          ))}
      </div>
    </Container>
  );
}

export default ReadlistPage;
