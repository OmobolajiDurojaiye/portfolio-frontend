import { useState } from "react";
import { Container, Button, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ProjectManager from "../../components/Admin/ProjectManager";
import AboutManager from "../../components/Admin/AboutManager";
import BlogManager from "../../components/Admin/BlogManager";
import MarketplaceManager from "../../components/Admin/MarketplaceManager";
import "./Admin.css";

function DashboardPage() {
  const navigate = useNavigate();
  const [key, setKey] = useState("about");

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin");
  };

  return (
    <Container className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="section-title">Admin Dashboard</h1>
        <Button variant="outline-danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <p className="text-secondary mb-5">
        Welcome, Admin. Manage your portfolio, blog, and marketplace from here.
      </p>

      <Tabs
        id="admin-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 admin-tabs"
      >
        <Tab eventKey="about" title="About Page">
          <AboutManager />
        </Tab>
        <Tab eventKey="projects" title="Portfolio Projects">
          <ProjectManager />
        </Tab>
        <Tab eventKey="blog" title="Blog Posts">
          <BlogManager />
        </Tab>
        <Tab eventKey="marketplace" title="Marketplace">
          <MarketplaceManager />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default DashboardPage;
