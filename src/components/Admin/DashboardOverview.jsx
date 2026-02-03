import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { FaCalendarAlt, FaPenNib, FaShoppingCart, FaEnvelope } from "react-icons/fa";
import apiClient from "../../services/api";
import "../../pages/Admin/Admin.css";

const StatCard = ({ title, count, icon, color, loading }) => (
  <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: "var(--background-elevated)", color: "var(--text-primary)" }}>
    <Card.Body className="d-flex align-items-center">
      <div className="rounded-circle p-3 me-3" style={{ backgroundColor: `${color}20`, color: color }}>
        {icon}
      </div>
      <div>
        <h6 className="text-secondary mb-1">{title}</h6>
        <h3 className="mb-0 fw-bold">{loading ? <Spinner size="sm" /> : count}</h3>
      </div>
    </Card.Body>
  </Card>
);

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    bookings: 0,
    posts: 0,
    orders: 0,
    messages: 0 // Messages might need a new endpoint or check 'contact' table if exists
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsRes, postsRes, ordersRes] = await Promise.all([
          apiClient.get("/api/booking/admin/bookings"),
          apiClient.get("/api/blog/posts"), // Assuming public or admin endpoint returns all
          apiClient.get("/api/marketplace/orders")
        ]);

        setStats({
          bookings: bookingsRes.data.length,
          posts: postsRes.data.posts ? postsRes.data.posts.length : postsRes.data.length || 0,
          orders: ordersRes.data.length,
          messages: 0 // Placeholder
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container fluid>
      <h2 className="mb-4 fw-bold">Dashboard Overview</h2>
      <Row className="g-4 mb-5">
        <Col md={6} xl={3}>
          <StatCard 
            title="Total Bookings" 
            count={stats.bookings} 
            icon={<FaCalendarAlt size={24} />} 
            color="#a162f7" 
            loading={loading} 
          />
        </Col>
        <Col md={6} xl={3}>
          <StatCard 
            title="Blog Posts" 
            count={stats.posts} 
            icon={<FaPenNib size={24} />} 
            color="#00f5c4" 
            loading={loading} 
          />
        </Col>
        <Col md={6} xl={3}>
          <StatCard 
            title="Total Orders" 
            count={stats.orders} 
            icon={<FaShoppingCart size={24} />} 
            color="#ffc107" 
            loading={loading} 
          />
        </Col>
         {/* Placeholder for future Messages stat */}
        {/* <Col md={6} xl={3}>
          <StatCard title="New Messages" count={stats.messages} icon={<FaEnvelope size={24} />} color="#dc3545" loading={loading} />
        </Col> */}
      </Row>

      <Row>
        <Col md={12}>
           <Card className="border-0 shadow-sm" style={{ backgroundColor: "var(--background-elevated)", color: "var(--text-primary)" }}>
             <Card.Body>
               <h5 className="mb-4">Recent Actvity</h5>
               <p className="text-secondary">No recent activity to show.</p>
             </Card.Body>
           </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardOverview;
