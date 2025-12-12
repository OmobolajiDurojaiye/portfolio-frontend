import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Spinner, Row, Col, Card } from "react-bootstrap";

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/blog/posts`
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Container>
      <div className="text-center mb-5">
        <h2 className="section-title">My Blog</h2>
        <p className="section-subtitle">
          Thoughts, tutorials, and explorations in tech and music.
        </p>
      </div>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : posts.length > 0 ? (
        <Row>
          {posts.map((post) => (
            <Col md={6} lg={4} key={post.id} className="mb-4">
              <Card className="h-100 bg-dark text-light">
                <Card.Img
                  variant="top"
                  src={post.image_url || "https://via.placeholder.com/300x200"}
                />
                <Card.Body>
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text className="text-secondary">
                    {post.content.substring(0, 100)}...
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">
                    By {post.author} on{" "}
                    {new Date(post.date_posted).toLocaleDateString()}
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center text-secondary mt-5">
          No blog posts yet. Stay tuned!
        </p>
      )}
    </Container>
  );
}

export default BlogPage;
