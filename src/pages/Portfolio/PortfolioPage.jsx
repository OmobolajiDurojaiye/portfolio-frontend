import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Spinner } from "react-bootstrap";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaFileAlt,
  FaUsers,
  FaDollarSign,
  FaChevronLeft,
  FaChevronRight,
  FaUserTie,
} from "react-icons/fa";
import "./PortfolioPage.css";

function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/portfolio/projects`
        );
        setProjects(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Track active slide index on scroll
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || projects.length === 0) return;
    const cards = track.querySelectorAll(".hproject-slide");
    if (!cards.length) return;

    let closestIdx = 0;
    let closestDist = Infinity;
    const trackLeft = track.getBoundingClientRect().left;

    cards.forEach((card, idx) => {
      const dist = Math.abs(card.getBoundingClientRect().left - trackLeft - 24);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });
    setActiveIndex(closestIdx);
  }, [projects.length]);

  const scrollToProject = (idx) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll(".hproject-slide");
    if (cards[idx]) {
      cards[idx].scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
      setActiveIndex(idx);
    }
  };

  const scrollByStep = (dir) => {
    const nextIdx = Math.max(0, Math.min(projects.length - 1, activeIndex + dir));
    scrollToProject(nextIdx);
  };

  // Convert vertical mouse wheel to horizontal scroll over the project gallery
  // Attached natively with { passive: false } so preventDefault() never warns
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const atStart = track.scrollLeft <= 2 && e.deltaY < 0;
        const atEnd =
          track.scrollLeft + track.clientWidth >= track.scrollWidth - 2 && e.deltaY > 0;
        if (!atStart && !atEnd) {
          e.preventDefault();
          track.scrollLeft += e.deltaY * 1.4;
        }
      }
    };

    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, [loading, projects.length]);

  // Mouse drag-to-scroll support
  const handleMouseDown = (e) => {
    if (e.target.closest("a, button")) return;
    const track = trackRef.current;
    if (!track) return;
    isDraggingRef.current = true;
    track.classList.add("is-dragging");
    startXRef.current = e.pageX - track.offsetLeft;
    scrollLeftRef.current = track.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    trackRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const stopDragging = () => {
    isDraggingRef.current = false;
    if (trackRef.current) {
      trackRef.current.classList.remove("is-dragging");
    }
  };

  // Keyboard arrow support
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") scrollByStep(1);
      if (e.key === "ArrowLeft") scrollByStep(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="hportfolio-page">
      <Helmet>
        <title>Projects | Omobolaji Durojaiye, Software Engineer</title>
        <meta
          name="description"
          content="Explore software engineering projects, B2B SaaS platforms, and AI products built by Omobolaji Durojaiye."
        />
      </Helmet>

      {/* Header Section */}
      <section className="hportfolio-header">
        <div className="hportfolio-header-top">
          <div>
            <span className="mono-label">SELECTED WORK · HORIZONTAL ARCHIVE</span>
            <h1 className="hportfolio-title">My Projects</h1>
            <p className="hportfolio-subtitle">
              A collection of products and client platforms where complex workflows become clean,
              dependable software. Scroll, drag, or use arrows to browse every project in detail.
            </p>
          </div>

          {!loading && projects.length > 0 && (
            <div className="hportfolio-controls">
              <span className="hportfolio-counter">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(projects.length).padStart(2, "0")}
              </span>
              <div className="hportfolio-arrows">
                <button
                  type="button"
                  className="hportfolio-arrow-btn"
                  onClick={() => scrollByStep(-1)}
                  disabled={activeIndex === 0}
                  aria-label="Previous project"
                >
                  <FaChevronLeft />
                </button>
                <button
                  type="button"
                  className="hportfolio-arrow-btn"
                  onClick={() => scrollByStep(1)}
                  disabled={activeIndex === projects.length - 1}
                  aria-label="Next project"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick-Jump Project Index Pills */}
        {!loading && projects.length > 0 && (
          <div className="hportfolio-index-bar" role="tablist" aria-label="Jump to project">
            {projects.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                className={`hportfolio-index-pill ${activeIndex === idx ? "is-active" : ""}`}
                onClick={() => scrollToProject(idx)}
              >
                <span className="pill-num">{String(idx + 1).padStart(2, "0")}</span>
                <span>{p.title}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Horizontal Scroll Showcase */}
      <section className="hportfolio-stage">
        {loading ? (
          <div className="hportfolio-loading">
            <Spinner animation="border" size="sm" />
            <span className="mono-label">Loading projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="hportfolio-loading">
            <span className="mono-label">No projects available right now.</span>
          </div>
        ) : (
          <div
            className="hportfolio-track"
            ref={trackRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
          >
            {projects.map((project, index) => (
              <article className="hproject-slide" key={project.id}>
                <div className="hproject-card">
                  {/* Left: Visual Preview */}
                  <div className="hproject-media-col">
                    <div className="hproject-media-topbar">
                      <span className="hproject-num">
                        PROJECT {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="hproject-badges">
                        {project.duration && (
                          <span className="hproject-duration-pill">{project.duration}</span>
                        )}
                        {project.live_url && (
                          <span className="hproject-live-pill">
                            <span className="live-dot" /> Live
                          </span>
                        )}
                      </div>
                    </div>

                    <a
                      href={project.live_url || project.github_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hproject-image-frame"
                    >
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="hproject-img"
                        draggable="false"
                      />
                    </a>
                  </div>

                  {/* Right: Full Project Details */}
                  <div className="hproject-details-col">
                    <h2 className="hproject-title">{project.title}</h2>
                    <p className="hproject-description">{project.description}</p>

                    {/* Structured Meta Grid: Role, Collaborators, Budget */}
                    <div className="hproject-meta-grid">
                      {project.role && (
                        <div className="hproject-meta-box">
                          <span className="hproject-meta-label">
                            <FaUserTie /> Role
                          </span>
                          <span className="hproject-meta-val">{project.role}</span>
                        </div>
                      )}
                      {project.collaborators && (
                        <div className="hproject-meta-box">
                          <span className="hproject-meta-label">
                            <FaUsers /> Collaborators
                          </span>
                          <span className="hproject-meta-val">{project.collaborators}</span>
                        </div>
                      )}
                      {project.cost && (
                        <div className="hproject-meta-box">
                          <span className="hproject-meta-label">
                            <FaDollarSign /> Budget
                          </span>
                          <span className="hproject-meta-val">
                            ${Number(project.cost).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tech Stack & Tools */}
                    {((project.tech_stack && project.tech_stack.length > 0) ||
                      (project.tools && project.tools.length > 0)) && (
                      <div className="hproject-stack-block">
                        <span className="hproject-meta-label">Tech Stack &amp; Tools</span>
                        <div className="hproject-tags">
                          {(project.tech_stack || []).map((tech) => (
                            <span key={`tech-${tech}`} className="hproject-tag is-tech">
                              {tech}
                            </span>
                          ))}
                          {(project.tools || []).map((tool) => (
                            <span key={`tool-${tool}`} className="hproject-tag is-tool">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="hproject-actions">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hproject-btn is-primary"
                        >
                          <FaExternalLinkAlt /> Live Site
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hproject-btn"
                        >
                          <FaGithub /> GitHub
                        </a>
                      )}
                      {project.case_study_url && (
                        <a
                          href={project.case_study_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hproject-btn"
                        >
                          <FaFileAlt /> Case Study
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default PortfolioPage;
