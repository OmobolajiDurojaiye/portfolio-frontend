import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaBookmark,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "./DashboardLayout.css";

function DashboardLayout() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("bolaji-theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("bolaji-theme", theme);
  }, [theme]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const navItems = [
    { name: "Home", path: "/", end: true },
    { name: "Projects", path: "/portfolio" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const socialLinks = [
    { name: "GitHub", url: "https://github.com/OmobolajiDurojaiye", icon: <FaGithub /> },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/omobolaji-durojaiye-527872294/", icon: <FaLinkedin /> },
    { name: "X", url: "https://x.com/bjtolu", icon: <FaTwitter /> },
    {
      name: "Bluesky",
      url: "https://bsky.app/profile/bolaji.tech",
      icon: (
        <svg viewBox="0 0 512 512" fill="currentColor" style={{ width: "0.95em", height: "0.95em" }}>
          <path d="M111.8 62.2C170.2 105.9 226.5 186 256 237.5c29.5-51.5 85.8-131.6 144.2-175.3C443.7 30.8 483 18.1 483 66.8c0 48.7-36.9 167.3-56.1 217.1-23.7 61.4-85.1 76.7-142.1 63.6 57 85.4 100.8 116.1 76 156.4-36.5 59.2-104.8-63-104.8-63s-68.3 122.2-104.8 63c-24.8-40.3 19-111 76-156.4-57 13.1-118.4-2.2-142.1-63.6C36.9 234.1 0 115.5 0 66.8 0 18.1 39.3 30.8 111.8 62.2z" />
        </svg>
      ),
    },
    { name: "Substack", url: "https://substack.com/@bjtolu", icon: <FaBookmark /> },
  ];

  return (
    <div className="editorial-shell">
      {/* Sticky Top Navbar */}
      <header className="editorial-navbar">
        <div className="editorial-navbar-inner">
          <Link to="/" className="editorial-brand">
            Bolaji<span className="editorial-brand-dot">.</span>
          </Link>

          <nav className="editorial-nav-desktop" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `editorial-nav-link ${isActive ? "is-active" : ""}`
                }
              >
                <span>{item.name}</span>
                <span className="editorial-active-dot" aria-hidden="true" />
              </NavLink>
            ))}

            <button
              type="button"
              className="editorial-theme-btn"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>
          </nav>

          <div className="editorial-mobile-controls">
            <button
              type="button"
              className="editorial-theme-btn"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
            >
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>
            <button
              type="button"
              className="editorial-menu-btn"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              {isMobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div className={`editorial-mobile-drawer ${isMobileOpen ? "is-open" : ""}`}>
        <nav className="editorial-mobile-links">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `editorial-mobile-link ${isActive ? "is-active" : ""}`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="editorial-mobile-socials">
          {socialLinks.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Main Content — consistent 820px width across ALL pages */}
      <main className="editorial-main">
        <div className="editorial-column">
          <Outlet />
        </div>
      </main>

      {/* Subtle Editorial Footer */}
      <footer className="editorial-footer">
        <div className="editorial-footer-inner">
          <div className="editorial-footer-left">
            <span className="editorial-footer-brand">Bolaji.</span>
            <span className="editorial-footer-copy">
              © {new Date().getFullYear()} Omobolaji Durojaiye · Abuja, Nigeria
            </span>
          </div>
          <div className="editorial-footer-socials">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                title={s.name}
                aria-label={s.name}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DashboardLayout;
