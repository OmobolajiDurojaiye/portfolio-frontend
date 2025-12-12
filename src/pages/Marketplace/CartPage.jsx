import { useState } from "react";
import { Container, Row, Col, Button, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
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
    <>
      <Container className="cart-page-container py-5">
        <div className="text-center mb-5">
          <h1 className="section-title">Your Cart</h1>
        </div>
        {cartItems.length === 0 ? (
          <Alert variant="secondary" className="text-center">
            Your cart is empty. <Link to="/marketplace">Continue Shopping</Link>
          </Alert>
        ) : (
          <Row>
            <Col lg={8}>
              {cartItems.map((item) => (
                <Card key={item.id} className="cart-item-card mb-3">
                  <Card.Body as={Row} className="align-items-center">
                    <Col md={2} sm={3}>
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="img-fluid rounded"
                      />
                    </Col>
                    <Col md={7} sm={9}>
                      <h5 className="mb-1">{item.name}</h5>
                      <p className="text-secondary mb-0">
                        {item.category?.name || "Digital Product"}
                      </p>
                    </Col>
                    <Col md={3} className="text-md-end mt-3 mt-md-0">
                      <span className="cart-item-price d-block mb-2">
                        ${item.price.toFixed(2)}
                      </span>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <FaTrash /> Remove
                      </Button>
                    </Col>
                  </Card.Body>
                </Card>
              ))}
            </Col>
            <Col lg={4}>
              <Card className="cart-summary-card">
                <Card.Body>
                  <Card.Title as="h4" className="mb-4">
                    Order Summary
                  </Card.Title>
                  <div className="d-flex justify-content-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold h5">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-100 mt-4 buy-now-button"
                    onClick={() => setShowOrderModal(true)}
                  >
                    Place Order Inquiry
                  </Button>
                  <Button
                    variant="outline-secondary"
                    className="w-100 mt-2"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
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
    </>
  );
};

export default CartPage;
