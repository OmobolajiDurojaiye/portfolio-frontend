import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Button,
  Badge,
} from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import apiClient from "../../services/api";
import OrderModal from "../../components/Marketplace/OrderModal";
import { useCart } from "../../hooks/useCart";
import "./Marketplace.css";

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
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
        if (res.data.image_url) {
            setActiveImage(res.data.image_url);
        }
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

  const handleImageClick = (img) => {
      setActiveImage(img);
  };

  if (loading)
    return (
      <div className="marketplace-page-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="grow" variant="primary" />
      </div>
    );
  if (!product)
    return (
      <Container className="text-center py-5">
        <h2>Product not found.</h2>
        <Link to="/marketplace">Return to Marketplace</Link>
      </Container>
    );

  // Combine main image and gallery for the thumbnails list
  const allImages = [product.image_url, ...(product.gallery_images || [])].filter(Boolean);
  // Remove duplicates if any
  const uniqueImages = [...new Set(allImages)];

  return (
    <div className="marketplace-page-wrapper">
      <Container className="product-detail-container px-lg-0 pt-5">
        <div className="mb-4">
          <Link to="/marketplace" className="back-link d-inline-flex align-items-center gap-2 text-decoration-none text-secondary hover-white transition-all">
            <FaArrowLeft /> Back to Marketplace
          </Link>
        </div>

        <Row className="gx-lg-5 mb-5">
          {/* Left Column: Interactive Gallery */}
          <Col lg={7} className="mb-5 mb-lg-0">
            <div className="product-showcase-image mb-3 position-relative border border-secondary rounded-3 overflow-hidden bg-darker">
               {product.is_sold && (
                   <Badge bg="danger" className="position-absolute top-0 end-0 m-3 fs-6 z-2">Sold Out</Badge>
               )}
              <img src={activeImage || product.image_url} alt={product.name} className="img-fluid w-100 object-fit-cover" style={{ minHeight: "400px", maxHeight: "500px" }} />
            </div>

            {/* Gallery Thumbnails */}
            {uniqueImages.length > 1 && (
                <div className="gallery-thumbnails">
                    <Row className="g-2">
                         {uniqueImages.map((img, idx) => (
                             <Col xs={3} sm={2} key={idx}>
                                 <div 
                                    className={`thumbnail-wrapper rounded overflow-hidden border ${activeImage === img ? 'border-primary' : 'border-secondary'}`} 
                                    style={{ cursor: "pointer", height: "80px", opacity: activeImage === img ? 1 : 0.7 }}
                                    onClick={() => handleImageClick(img)}
                                 >
                                     <img src={img} alt={`Thumbnail ${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                 </div>
                             </Col>
                         ))}
                    </Row>
                </div>
            )}
          </Col>

          {/* Right Column: Key Info & Actions */}
          <Col lg={5}>
            <div className="product-info ps-lg-4">
                <div className="mb-2">
                    {product.category && (
                        <span className="text-secondary text-uppercase small fw-bold ls-1">
                        {product.category.name}
                        </span>
                    )}
                </div>

                <h1 className="display-4 fw-bold text-white mb-3">{product.name}</h1>
                <p className="text-secondary fs-5 mb-4" style={{ lineHeight: "1.6" }}>{product.subtitle}</p>

                <div className="mb-4 pb-4 border-bottom border-secondary">
                  <h2 className="display-5 fw-bold text-white mb-0">${product.price.toFixed(2)}</h2>
                </div>
                
                <div className="d-grid gap-3 mb-5">
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="add-to-cart-button fw-bold py-3"
                    disabled={product.is_sold}
                    style={{ background: "#5b21b6", border: "none", fontSize: "1.1rem" }} // Deep purple from reference
                  >
                    {showAddedAlert ? "Added to Cart!" : (product.is_sold ? "Sold Out" : "Add to Cart")}
                  </Button>
                  <Button
                    onClick={() => setShowOrderModal(true)}
                    variant="outline-secondary"
                    className="text-white py-3 fw-bold"
                  >
                    Make an Inquiry
                  </Button>
                </div>

                <div className="mb-5">
                    <h5 className="text-white mb-3 fw-bold">Description</h5>
                    <p className="text-secondary" style={{ whiteSpace: "pre-line", lineHeight: "1.7" }}>
                        {product.description}
                    </p>
                </div>
            </div>
          </Col>
        </Row>

        {/* Features Section - Full Width Grid */}
        {product.features && product.features.length > 0 && (
            <div className="mb-5 pb-5">
                <h2 className="text-white fw-bold mb-4">Features</h2>
                <Row className="g-3">
                    {product.features.map((feature, index) => (
                    <Col md={6} key={index}>
                        <div className="feature-card p-3 border border-secondary rounded-3 d-flex align-items-center gap-3 bg-darker">
                            <div className="feature-icon-wrapper text-success">
                                <FaCheckCircle size={20} />
                            </div>
                            <span className="text-white fw-medium">{feature}</span>
                        </div>
                    </Col>
                    ))}
                </Row>
            </div>
        )}

      </Container>
      
      {product && (
        <OrderModal
          show={showOrderModal}
          handleClose={() => setShowOrderModal(false)}
          product={product}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
