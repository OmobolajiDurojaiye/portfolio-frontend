import { Container, Nav } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

const MarketplaceHeader = () => {
  const { cartCount } = useCart();

  return (
    <header className="marketplace-main-header">
      <Container fluid className="px-md-5">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/marketplace" className="marketplace-brand">
            The Marketplace
          </Link>
          <Nav className="marketplace-actions">
            <Nav.Link as={Link} to="/marketplace/cart">
              <FaShoppingCart /> Cart{" "}
              <span className="count-badge">{cartCount}</span>
            </Nav.Link>
          </Nav>
        </div>
      </Container>
    </header>
  );
};

export default MarketplaceHeader;
