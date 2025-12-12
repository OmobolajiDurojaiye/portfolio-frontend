import { useState, useEffect } from "react";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import { useSearchParams, Link } from "react-router-dom";
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
        .get(`/api/blog/search?q=${query}`)
        .then((res) => setResults(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [query]);

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="section-title">Search Results</h1>
        <p className="section-subtitle">Showing results for: "{query}"</p>
      </div>
      {loading ? (
        <div className="text-center">
          <Spinner />
        </div>
      ) : (
        <Row>
          {results.length > 0 ? (
            results.map((post) => (
              <Col lg={4} md={6} key={post.id} className="mb-4">
                <Link to={`/blog/${post.slug}`} className="grid-post-card">
                  <div className="grid-post-img-container">
                    <img src={post.image_url} alt={post.title} />
                  </div>
                  <div className="grid-post-content">
                    {post.category && (
                      <span
                        className="category-tag-sm"
                        style={{ backgroundColor: post.category.color }}
                      >
                        {post.category.name}
                      </span>
                    )}
                    <h5 className="grid-post-title">{post.title}</h5>
                    <p className="grid-post-excerpt text-secondary">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </Col>
            ))
          ) : (
            <p className="text-center text-secondary">
              No articles found matching your search.
            </p>
          )}
        </Row>
      )}
    </Container>
  );
};

export default BlogSearchResults;
