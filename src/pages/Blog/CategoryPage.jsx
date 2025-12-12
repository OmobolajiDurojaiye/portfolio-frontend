import { useState, useEffect } from "react";
import { Container, Spinner, Card, Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
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

  if (loading)
    return (
      <Container className="text-center py-5">
        <Spinner />
      </Container>
    );
  if (!data.category)
    return (
      <Container className="text-center py-5">
        <h2>Category not found.</h2>
      </Container>
    );

  return (
    <Container className="py-5">
      <div
        className="text-center mb-5 category-header"
        style={{ "--category-color": data.category.color }}
      >
        <h1 className="section-title">{data.category.name}</h1>
      </div>
      <Row>
        {data.posts.map((post) => (
          <Col lg={4} md={6} key={post.id} className="mb-4">
            <Link to={`/blog/${post.slug}`} className="grid-post-card">
              <div className="grid-post-img-container">
                <img src={post.image_url} alt={post.title} />
              </div>
              <div className="grid-post-content">
                <h5 className="grid-post-title">{post.title}</h5>
                <p className="grid-post-excerpt text-secondary">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CategoryPage;
