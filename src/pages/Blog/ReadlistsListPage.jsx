import { useState, useEffect } from "react";
import { Container, Spinner, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import apiClient from "../../services/api";
import "./Blog.css";

function ReadlistsListPage() {
  const [readlists, setReadlists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadlists = async () => {
      try {
        const res = await apiClient.get("/api/blog/readlists");
        setReadlists(res.data);
      } catch (error) {
        console.error("Failed to fetch readlists", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReadlists();
  }, []);

  if (loading)
    return (
      <Container className="text-center py-5">
        <Spinner />
      </Container>
    );

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="section-title">All Readlists</h1>
        <p className="section-subtitle">
          Curated series of articles on specific topics.
        </p>
      </div>
      <Row>
        {readlists.map((rl) => (
          <Col md={6} lg={4} key={rl.id} className="mb-4">
            <Link
              to={`/blog/readlists/${rl.slug}`}
              className="readlist-card-link"
            >
              <div className="readlist-card">
                <img
                  src={rl.image_url || "https://via.placeholder.com/400x500"}
                  className="readlist-card-img"
                />
                <div className="readlist-card-overlay">
                  <div className="readlist-card-content">
                    <h4>{rl.name}</h4>
                    <p>{rl.description}</p>
                  </div>
                  <span className="readlist-card-footer">
                    {rl.posts?.length || 0} Articles
                  </span>
                </div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ReadlistsListPage;
