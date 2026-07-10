import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { 
  FaUser, 
  FaBriefcase, 
  FaEnvelope, 
  FaBook, 
  FaCompass,
  FaTwitter, 
  FaGithub, 
  FaLinkedin, 
  FaCloud, 
  FaBookmark,
  FaBars,
  FaTimes
} from "react-icons/fa";
import headshot from "../assets/PFP.png";
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
    { 
      name: "Bluesky", 
      url: "https://bsky.app/profile/bolaji.tech", 
      icon: (
        <svg viewBox="0 0 512 512" fill="currentColor" style={{ width: "0.95em", height: "0.95em" }}>
          <path d="M111.8 62.2C170.2 105.9 226.5 186 256 237.5c29.5-51.5 85.8-131.6 144.2-175.3C443.7 30.8 483 18.1 483 66.8c0 48.7-36.9 167.3-56.1 217.1-23.7 61.4-85.1 76.7-142.1 63.6 57 85.4 100.8 116.1 76 156.4-36.5 59.2-104.8-63-104.8-63s-68.3 122.2-104.8 63c-24.8-40.3 19-111 76-156.4-57 13.1-118.4-2.2-142.1-63.6C36.9 234.1 0 115.5 0 66.8 0 18.1 39.3 30.8 111.8 62.2z"/>
        </svg>
      )
    },
    { name: "Substack", url: "https://substack.com/@bjtolu", icon: <FaBookmark /> },
  ];

  return (
    <div className="dashboard-layout-root">
      
      {/* Mobile Top Navbar (Original design) */}
      <header className="mobile-header d-lg-none">
        <Link to="/" className="mobile-logo" style={{ textDecoration: "none" }}>
          <span>Bolaji</span><span className="logo-dot">.</span>
        </Link>
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
          <Link to="/" className="sidebar-logo" style={{ textDecoration: "none" }}>
            <span className="logo-text">Bolaji<span className="logo-dot">.</span></span>
          </Link>

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

          {/* User Profile Slot on the side of the profile image (like X) */}
          <div className="sidebar-profile-footer">
            <img src={headshot} alt="Bolaji" className="sidebar-profile-avatar" />
            <div className="sidebar-profile-info">
              <span className="sidebar-profile-name">Bolaji</span>
              <span className="sidebar-profile-handle">@bjtolu</span>
            </div>
          </div>

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
