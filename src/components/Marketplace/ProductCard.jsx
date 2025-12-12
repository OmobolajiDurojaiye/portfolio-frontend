import { Badge, Button } from "react-bootstrap";
import { FaStar, FaCartPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the cart button
    e.stopPropagation();
    addToCart(product);
    // Optionally, you can add visual feedback here
  };

  const handleCardClick = () => {
    navigate(`/marketplace/${product.slug}`);
  };

  return (
    <div
      className="product-card"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="product-image-container">
        <img src={product.image_url} alt={product.name} />
        {product.tags && product.tags.length > 0 && (
          <Badge className="product-tag">{product.tags[0]}</Badge>
        )}
        <Button
          variant="light"
          className="product-card-add-cart"
          onClick={handleAddToCart}
        >
          <FaCartPlus />
        </Button>
      </div>
      <div className="product-content">
        <div className="product-header">
          <h5 className="product-name">{product.name}</h5>
          {product.rating > 0 && (
            <div className="product-rating">
              <FaStar /> {product.rating.toFixed(1)}
            </div>
          )}
        </div>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <span className="product-buy-button-sm">View Details</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
