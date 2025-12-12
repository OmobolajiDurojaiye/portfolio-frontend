import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Button,
  Carousel,
  Alert,
} from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import apiClient from "../../services/api";
import OrderModal from "../../components/Marketplace/OrderModal";
import { useCart } from "../../hooks/useCart";
import "./Marketplace.css";

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showAddedAlert, setShowAddedAlert] = useState(false);
  const { slug } = useParams();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/marketplace/products/${slug}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    addToCart(product);
    setShowAddedAlert(true);
    setTimeout(() => setShowAddedAlert(false), 3000);
  };

  if (loading)
    return (
      <Container className="text-center py-5">
        <Spinner />
      </Container>
    );
  if (!product)
    return (
      <Container className="text-center py-5">
        <h2>Product not found.</h2>
      </Container>
    );

  return (
    <>
      <Container fluid className="product-detail-container px-md-5">
        <nav className="product-detail-nav">
          <Link to="/marketplace" className="back-link">
            &larr; Back to Marketplace
          </Link>
        </nav>
        <Row className="align-items-center">
          <Col lg={7} className="mb-5 mb-lg-0">
            <div className="product-showcase-image">
              <img src={product.image_url} alt={product.name} />
            </div>
          </Col>
          <Col lg={5}>
            <div className="product-info">
              {showAddedAlert && (
                <Alert variant="success">Added to cart!</Alert>
              )}
              {product.category && (
                <span className="product-detail-category">
                  {product.category.name}
                </span>
              )}
              <h1 className="product-detail-title">{product.name}</h1>
              <p className="product-detail-subtitle text-secondary">
                {product.subtitle}
              </p>

              <div className="product-actions">
                <span className="product-detail-price">
                  ${product.price.toFixed(2)}
                </span>
                <Button
                  onClick={handleAddToCart}
                  className="add-to-cart-button"
                >
                  Add to Cart
                </Button>
              </div>
              <p className="product-detail-description text-secondary mt-4">
                {product.description}
              </p>
              <Button
                onClick={() => setShowOrderModal(true)}
                variant="outline-secondary"
                className="mt-2"
              >
                I like this, make an inquiry
              </Button>
              <br />
              {product.demo_url && (
                <a
                  href={product.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="demo-link"
                >
                  Live Demo &rarr;
                </a>
              )}
            </div>
          </Col>
        </Row>
        {product.features && product.features.length > 0 && (
          <Row className="mt-5 pt-5 feature-section">
            <Col lg={4}>
              <h3 className="section-title">Features</h3>
            </Col>
            <Col lg={8}>
              <ul className="features-list">
                {product.features.map((feature, index) => (
                  <li key={index}>
                    <FaCheckCircle /> {feature}
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        )}
        {product.gallery_images && product.gallery_images.length > 0 && (
          <Row className="mt-5 pt-5 gallery-section">
            <Col className="text-center">
              <h3 className="section-title mb-4">Gallery</h3>
              <Carousel interval={null} className="screenshot-carousel">
                {product.gallery_images.map((img, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={img}
                      alt={`Screenshot ${index + 1}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
          </Row>
        )}
      </Container>
      {product && (
        <OrderModal
          show={showOrderModal}
          handleClose={() => setShowOrderModal(false)}
          product={product}
        />
      )}
    </>
  );
};

export default ProductDetailPage;
