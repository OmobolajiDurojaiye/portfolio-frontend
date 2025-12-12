import { Container, Row, Col, Nav } from "react-bootstrap";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaAddressCard,
  FaBriefcase,
  FaPenNib,
  FaStore,
  FaShoppingCart,
} from "react-icons/fa";
import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin");
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <h3 className="sidebar-title">Dashboard</h3>
        <Nav className="flex-column">
          <Nav.Link
            as={NavLink}
            to="/admin/dashboard/overview"
            className="sidebar-link"
          >
            <FaTachometerAlt /> Overview
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/admin/dashboard/about"
            className="sidebar-link"
          >
            <FaAddressCard /> About Page
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/admin/dashboard/portfolio"
            className="sidebar-link"
          >
            <FaBriefcase /> Portfolio
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/admin/dashboard/blog"
            className="sidebar-link"
          >
            <FaPenNib /> Blog
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/admin/dashboard/marketplace"
            className="sidebar-link"
          >
            <FaStore /> Marketplace
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/admin/dashboard/orders"
            className="sidebar-link"
          >
            <FaShoppingCart /> Orders
          </Nav.Link>
        </Nav>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
