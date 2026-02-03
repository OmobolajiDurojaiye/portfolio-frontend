import { useState } from "react";
import { Container, Row, Col, Button, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTrash, FaShoppingBag, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { useCart } from "../../hooks/useCart";
import OrderModal from "../../components/Marketplace/OrderModal";
import "./Marketplace.css";

const CartPage = () => {
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Create a mock product representing the entire cart for the order modal
  const cartAsProduct = {
    id: "cart",
    name: `Cart Inquiry (${cartItems.length} items)`,
    price: cartTotal,
  };

  return (
    <div className="marketplace-page-wrapper">
      <Container className="cart-page-container py-5">
        <div className="d-flex align-items-center mb-4">
             <Link to="/marketplace" className="text-secondary text-decoration-none me-auto">
                 <FaArrowLeft /> Keep Shopping
             </Link>
        </div>

        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-white">Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-5 border border-dashed border-secondary rounded-4 bg-dark bg-opacity-50">
            <FaShoppingBag size={64} className="text-secondary opacity-25 mb-4" />
            <h3 className="text-white mb-3">Your cart is empty</h3>
            <p className="text-secondary mb-4">Looks like you haven't found anything yet.</p>
            <Link to="/marketplace">
                <Button variant="primary" size="lg" className="px-4">Browse Marketplace</Button>
            </Link>
          </div>
        ) : (
          <Row className="gy-4">
            <Col lg={8}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="text-white m-0">Items ({cartItems.length})</h5>
                  <Button variant="link" className="text-danger text-decoration-none p-0" onClick={clearCart}>
                      Clear Cart
                  </Button>
              </div>

              {cartItems.map((item) => (
                <Card key={item.id} className="cart-item-card mb-3 border-secondary bg-darker">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col xs={3} sm={2}>
                        <div className="rounded overflow-hidden border border-secondary" style={{ aspectRatio: "1/1" }}>
                            <img
                            src={item.image_url}
                            alt={item.name}
                            className="img-fluid w-100 h-100 object-fit-cover"
                            />
                        </div>
                      </Col>
                      <Col xs={9} sm={6}>
                        <h5 className="mb-1 text-white fw-bold">{item.name}</h5>
                        <p className="text-secondary mb-0 small">
                          {item.category?.name || "Digital Product"}
                        </p>
                      </Col>
                      <Col xs={6} sm={4} className="text-end d-flex flex-column align-items-end justify-content-center mt-3 mt-sm-0">
                        <span className="cart-item-price d-block mb-2 text-white h5">
                          ${item.price.toFixed(2)}
                        </span>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="d-flex align-items-center gap-1 border-0"
                        >
                          <FaTrash size={14} /> <span className="d-none d-md-inline">Remove</span>
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </Col>

            <Col lg={4}>
              <Card className="cart-summary-card border-secondary text-white">
                <Card.Body className="p-4">
                  <Card.Title as="h4" className="mb-4 fw-bold">
                    Order Summary
                  </Card.Title>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Subtotal</span>
                    <span className="fw-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-4">
                    <span className="text-secondary">Taxes</span>
                    <span className="text-secondary fst-italic">Calculated at checkout</span>
                  </div>
                  
                  <hr className="border-secondary my-4" />
                  
                  <div className="d-flex justify-content-between fw-bold h4 mb-4">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <Button
                    className="w-100 py-3 fw-bold fs-5 btn-primary mb-3"
                    onClick={() => setShowOrderModal(true)}
                    style={{ background: "var(--plum-accent)", border: "none" }}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <div className="text-center">
                      <small className="text-secondary d-flex align-items-center justify-content-center gap-2">
                          <FaShieldAlt /> Secure Checkout
                      </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
      {cartItems.length > 0 && (
        <OrderModal
          show={showOrderModal}
          handleClose={() => setShowOrderModal(false)}
          product={cartAsProduct}
        />
      )}
    </div>
  );
};

export default CartPage;
