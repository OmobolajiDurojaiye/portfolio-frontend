import { useState, useEffect, useCallback } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
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

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Product Orders</h3>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Date</th>
            <th>Product</th>
            <th>Customer Name</th>
            <th>Customer Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{new Date(order.order_date).toLocaleString()}</td>
              <td>{order.product_name}</td>
              <td>{order.customer_name}</td>
              <td>
                <a href={`mailto:${order.customer_email}`}>
                  {order.customer_email}
                </a>
              </td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderManager;
