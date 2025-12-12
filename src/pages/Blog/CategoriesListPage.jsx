import { useState, useEffect } from "react";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import apiClient from "../../services/api";
import "./Blog.css";

function CategoriesListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiClient.get("/api/blog/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
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
        <h1 className="section-title">Categories</h1>
        <p className="section-subtitle">Explore articles by topic.</p>
      </div>
      <Row>
        {categories.map((cat) => (
          <Col md={4} sm={6} key={cat.id} className="mb-4">
            <Link
              to={`/blog/categories/${cat.slug}`}
              className="category-card-link"
            >
              <div
                className="category-card"
                style={{ "--category-color": cat.color }}
              >
                <h3 className="category-card-title">{cat.name}</h3>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CategoriesListPage;
