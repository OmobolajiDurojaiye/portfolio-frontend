import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { 
  FaUser, 
  FaBriefcase, 
  FaEnvelope, 
  FaBook, 
  FaCompass,
  FaTwitter, 
  FaGithub, 
  FaLinkedin, 
  FaGlobe, 
  FaBookmark,
  FaBars,
  FaTimes
} from "react-icons/fa";
import "./DashboardLayout.css";

function DashboardLayout() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLinkClick = () => {
    setIsMobileOpen(false);
  };

  const menuItems = [
    { name: "Profile", path: "/", icon: <FaUser /> },
    { name: "Projects", path: "/portfolio", icon: <FaBriefcase /> },
    { name: "Blog", path: "/blog", icon: <FaBook /> },
    { name: "Marketplace", path: "/marketplace", icon: <FaCompass /> },
    { name: "Contact", path: "/contact", icon: <FaEnvelope /> },
  ];

  const socialLinks = [
    { name: "X", url: "https://x.com/bjtolu", icon: <FaTwitter /> },
    { name: "GitHub", url: "https://github.com/OmobolajiDurojaiye", icon: <FaGithub /> },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/omobolaji-durojaiye-527872294/", icon: <FaLinkedin /> },
    { name: "Bluesky", url: "https://bsky.app/profile/bolaji.tech", icon: <FaGlobe /> },
    { name: "Substack", url: "https://substack.com/@bjtolu", icon: <FaBookmark /> },
  ];

  return (
    <div className="dashboard-layout-root">
      
      {/* Mobile Top Navbar (Original design) */}
      <header className="mobile-header d-lg-none">
        <div className="mobile-logo">
          <span>Bolaji</span><span className="logo-dot">.</span>
        </div>
        <button className={`hamburger-menu ${isMobileOpen ? "is-active" : ""}`} onClick={toggleMobileSidebar}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>
      </header>

      {/* Mobile Fullscreen Menu overlay */}
      <div className={`fullscreen-menu ${isMobileOpen ? "is-open" : ""}`}>
        <nav className="fullscreen-nav-links">
          {menuItems.map((item) => (
            <NavLink 
              key={item.name}
              to={item.path} 
              className={({ isActive }) => 
                `fullscreen-link ${isActive || (item.path === "/" && location.pathname === "/") ? "active" : ""}`
              }
              onClick={handleLinkClick}
            >
              {item.name}
            </NavLink>
          ))}
          <div className="fullscreen-socials">
            {socialLinks.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="fullscreen-social-icon">
                {s.icon}
              </a>
            ))}
          </div>
        </nav>
      </div>

      {/* Centered Wrapper for Desktop (Similar to X page layout) */}
      <div className="dashboard-centered-wrapper">
        
        {/* Sticky Sidebar */}
        <aside className="dashboard-sidebar d-none d-lg-flex">
          {/* Logo Brand with Purple Dot */}
          <div className="sidebar-logo">
            <span className="logo-text">Bolaji<span className="logo-dot">.</span></span>
          </div>

          {/* Navigation Links */}
          <nav className="sidebar-nav">
            <ul className="nav-list">
              {menuItems.map((item) => (
                <li key={item.name} className="nav-item">
                  <NavLink 
                    to={item.path} 
                    className={({ isActive }) => 
                      `nav-link-custom ${isActive || (item.path === "/" && location.pathname === "/") ? "active-link" : ""}`
                    }
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Links on Sidebar */}
          <div className="sidebar-socials">
            {socialLinks.map((s) => (
              <a 
                key={s.name} 
                href={s.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon-link"
                title={s.name}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="dashboard-content">
          <div className="content-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
