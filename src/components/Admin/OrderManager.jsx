import { useState, useEffect, useCallback } from "react";
import { Spinner, Alert, Card, Badge, Button, Row, Col, Container } from "react-bootstrap";
import { FaShoppingBag, FaUser, FaEnvelope, FaCalendarAlt, FaCheckCircle, FaClock, FaSync } from "react-icons/fa";
import apiClient from "../../services/api";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get("/api/marketplace/admin/orders");
      setOrders(res.data);
    } catch (err) {
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusBadge = (status) => {
      switch(status?.toLowerCase()) {
          case 'completed':
          case 'paid':
              return <Badge bg="success" className="d-flex align-items-center gap-1"><FaCheckCircle/> Completed</Badge>;
          case 'pending':
              return <Badge bg="warning" text="dark" className="d-flex align-items-center gap-1"><FaClock/> Pending</Badge>;
          default:
              return <Badge bg="secondary">{status || 'Unknown'}</Badge>;
      }
  };

  if (loading) return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="light" />
      </div>
  );

  return (
    <div className="order-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-white fw-bold m-0">Recent Orders</h3>
        <Button variant="outline-light" size="sm" onClick={fetchOrders}>
            <FaSync className={loading ? "spin" : ""} /> Refresh
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {orders.length > 0 ? (
          <div className="d-flex flex-column gap-3">
              {orders.map((order) => (
                  <Card key={order.id} className="border-0 shadow-sm" style={{ backgroundColor: "var(--background-elevated)" }}>
                      <Card.Body className="d-flex flex-column flex-md-row align-items-md-center gap-4 p-3 ps-4 border-start border-4 border-primary">
                          {/* Left: Product Icon & Info */}
                          <div className="flex-grow-1">
                              <div className="d-flex align-items-center text-secondary small mb-1 gap-2">
                                  <span className="d-flex align-items-center gap-1"><FaCalendarAlt /> {new Date(order.order_date).toLocaleString()}</span>
                                  <span>•</span>
                                  <span className="fw-bold text-primary">#{order.id.slice(0, 8)}</span>
                              </div>
                              <h5 className="text-white fw-bold m-0 d-flex align-items-center gap-2">
                                  <FaShoppingBag className="text-secondary" size={16}/> 
                                  {order.product_name}
                              </h5>
                          </div>

                          {/* Middle: Customer Info */}
                          <div className="d-flex flex-column justify-content-center" style={{ minWidth: "200px" }}>
                              <div className="d-flex align-items-center gap-2 text-white fw-bold">
                                  <div className="bg-secondary bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "30px", height: "30px" }}>
                                      <FaUser size={12} className="text-white"/>
                                  </div>
                                  {order.customer_name}
                              </div>
                              <div className="d-flex align-items-center gap-2 text-secondary small ms-1 mt-1">
                                  <FaEnvelope size={10} />
                                  <a href={`mailto:${order.customer_email}`} className="text-secondary text-decoration-none">
                                      {order.customer_email}
                                  </a>
                              </div>
                          </div>

                          {/* Right: Status */}
                          <div className="d-flex align-items-center justify-content-md-end" style={{ minWidth: "120px" }}>
                              {getStatusBadge(order.status)}
                          </div>
                      </Card.Body>
                  </Card>
              ))}
          </div>
      ) : (
          <div className="text-center py-5 rounded border border-secondary border-dashed" style={{backgroundColor: "rgba(255,255,255,0.02)"}}>
            <h5 className="text-secondary">No orders found so far.</h5>
          </div>
      )}
    </div>
  );
};

export default OrderManager;
