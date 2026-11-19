import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaBookmark,
  FaCalendarCheck,
  FaGlobe,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
} from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import headshot from "../../assets/PFP.png";
import heroBanner from "../../assets/hero-banner.jpg";
import apiClient from "../../services/api";
import DynamicIcon from "../../utils/iconMap";
import "./LandingPage.css";

const TECH_STACK = [
  { id: 1, name: "React", icon_name: "FaReact", category: "Frontend" },
  { id: 2, name: "JavaScript", icon_name: "SiJavascript", category: "Frontend" },
  { id: 3, name: "Python", icon_name: "FaPython", category: "Backend" },
  { id: 4, name: "FastAPI", icon_name: "SiFastapi", category: "Backend" },
  { id: 5, name: "Flask", icon_name: "SiFlask", category: "Backend" },
  { id: 6, name: "MySQL", icon_name: "SiMysql", category: "Backend" },
  { id: 7, name: "System Design", icon_name: "FaSitemap", category: "Backend" },
  { id: 8, name: "AI Research", icon_name: "FaRobot", category: "AI & Data" },
  { id: 9, name: "Postman", icon_name: "SiPostman", category: "Tools" },
  { id: 10, name: "CLI / Terminal", icon_name: "FaTerminal", category: "Tools" },
  { id: 11, name: "VS Code", icon_name: "SiVisualstudiocode", category: "Tools" },
  { id: 12, name: "Git", icon_name: "FaGitAlt", category: "Tools" },
  { id: 13, name: "GitHub", icon_name: "FaGithub", category: "Tools" },
  { id: 14, name: "Google Docs", icon_name: "SiGoogledocs", category: "Tools" },
];

const STACK_CATEGORIES = ["All", "Frontend", "Backend", "AI & Data", "Tools"];

const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: "ProofDeck",
    duration: "3 Months",
    role: "Full-Stack Engineer | Founder",
    description:
      "Create branded certificate templates, upload a CSV of recipients, auto-generate secure verifiable PDFs, and deliver them in bulk.",
    tech_stack: ["React", "Python", "Flask", "MySQL"],
    live_url: "https://www.proofdeck.app/",
    image_url:
      "https://res.cloudinary.com/dgmpklnor/image/upload/v1768927154/feature-bulk_lo3mcj.png",
  },
  {
    id: 2,
    title: "Kasi AI",
    duration: "Ongoing",
    role: "CTO | Co-Founder",
    description:
      "AI-powered sales & booking agent for African social commerce on WhatsApp and Instagram, automating orders and customer conversations.",
    tech_stack: ["Python", "FastAPI", "React", "AI Agents"],
    live_url: "https://usekasi.com/",
    image_url: "https://www.usekasi.com/kasi.png",
  },
  {
    id: 3,
    title: "BE Tech Agency",
    duration: "Ongoing",
    role: "Lead Software Engineer",
    description:
      "Software engineering studio crafting scalable SaaS platforms, AI automations, and high-converting business websites for ambitious teams.",
    tech_stack: ["React", "Python", "FastAPI", "System Design"],
    live_url: "https://techbe.online/",
    image_url:
      "https://res.cloudinary.com/dgmpklnor/image/upload/v1783669140/b75d6a7b-bf0b-4b3b-bff9-9f22a3f874a9.png",
  },
  {
    id: 4,
    title: "TeachJS",
    duration: "2 Months",
    role: "Creator & Engineer",
    description:
      "Interactive JavaScript training and educational toolkit designed to help developers master core concepts through hands-on lessons.",
    tech_stack: ["React", "JavaScript"],
    live_url: "https://teachjs.proofdeck.app/",
    image_url:
      "https://res.cloudinary.com/dgmpklnor/image/upload/q_auto/f_auto/v1775927803/cfc82239-4115-4dd4-95fe-c1aa16b5032b.png",
  },
  {
    id: 5,
    title: "PAF Engineering",
    duration: "1 Month",
    role: "Full-Stack Developer",
    description:
      "Corporate digital presence and engineering showcase platform built for speed, clarity, and effortless client inquiries.",
    tech_stack: ["React", "JavaScript"],
    live_url: "https://pafelng.com/",
    image_url:
      "https://res.cloudinary.com/dgmpklnor/image/upload/v1765632895/Screenshot_2025-12-13_143435_y8fxvd.png",
  },
];

const WORK_JOURNEY = [
  {
    role: "CTO & Co-Founder",
    company: "Kasi AI",
    duration: "Feb 2026 — Present",
  },
  {
    role: "Lead Software Engineer",
    company: "BE Tech Agency",
    duration: "Apr 2023 — Present",
  },
  {
    role: "Software Engineer",
    company: "Freelance",
    duration: "Mar 2022 — Present",
  },
];

const WORK_PROCESS = [
  {
    num: "01",
    title: "Discovery Call",
    description:
      "We discuss your goals, business workflows, and project requirements so our vision is aligned from day one.",
  },
  {
    num: "02",
    title: "Project Proposal",
    description:
      "I send a clear project roadmap, timeline, and quote. Once agreed, we lock in the first milestone.",
  },
  {
    num: "03",
    title: "Design & Development",
    description:
      "I architect and build your product with steady milestone demos so you can see real progress every step.",
  },
  {
    num: "04",
    title: "Review & Revisions",
    description:
      "We test every flow together and polish the details until the product matches your expectations.",
  },
  {
    num: "05",
    title: "Launch & Handover",
    description:
      "We deploy to production and hand over clean documentation and assets for a seamless transition.",
  },
];

const SERVICE_ITEMS = [
  {
    num: "01",
    title: "AI Agents & AI-Powered Apps",
    description:
      "Developing smart, LLM-driven agents and workflow integrations that automate sales, bookings, and repetitive business operations.",
  },
  {
    num: "02",
    title: "Web & Mobile Applications",
    description:
      "Engineering high-performance React, React Native, FastAPI, and Flask applications crafted for reliability and scale.",
  },
  {
    num: "03",
    title: "Business Platforms & SaaS",
    description:
      "Designing clean, modern digital storefronts and bespoke B2B software that cut admin burden and streamline daily workflows.",
  },
];

const CONTACT_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/OmobolajiDurojaiye",
    icon: <FaGithub />,
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/omobolaji-durojaiye-527872294/",
    icon: <FaLinkedin />,
    external: true,
  },
  {
    label: "Twitter",
    href: "https://x.com/bjtolu",
    icon: <FaTwitter />,
    external: true,
  },
  {
    label: "Mail",
    href: "mailto:omobolajidurojaiye57@gmail.com",
    icon: <FaEnvelope />,
    external: true,
  },
  {
    label: "Substack",
    href: "https://substack.com/@bjtolu",
    icon: <FaBookmark />,
    external: true,
  },
  {
    label: "Book a Call",
    to: "/contact",
    icon: <FaCalendarCheck />,
    external: false,
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildHeatmapWeeks(contributions) {
  if (!contributions || contributions.length === 0) return { weeks: [], monthLabels: [] };

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setDate(today.getDate() - 364);

  const filtered = contributions
    .filter((d) => {
      const dt = new Date(d.date);
      return dt >= oneYearAgo && dt <= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (filtered.length === 0) return { weeks: [], monthLabels: [] };

  const weeks = [];
  let currentWeek = [];
  const firstDayOfWeek = new Date(filtered[0].date).getDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }

  filtered.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, idx) => {
    const firstValid = week.find(Boolean);
    if (firstValid) {
      const m = new Date(firstValid.date).getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ index: idx, label: MONTHS[m] });
        lastMonth = m;
      }
    }
  });

  return { weeks, monthLabels };
}

function LandingPage() {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [techArticles, setTechArticles] = useState([]);
  const [activeStackTab, setActiveStackTab] = useState("All");
  const [activeStep, setActiveStep] = useState(0);
  const [githubTotal, setGithubTotal] = useState(null);
  const [githubWeeks, setGithubWeeks] = useState([]);
  const [monthLabels, setMonthLabels] = useState([]);
  const [hoveredPost, setHoveredPost] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const projectsRailRef = useRef(null);

  useEffect(() => {
    apiClient
      .get("/api/portfolio/projects")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProjects(res.data);
        }
      })
      .catch((err) => console.error("Failed to fetch projects:", err));

    apiClient
      .get("/api/blog/home-data")
      .then((res) => {
        const posts = res.data.posts || [];
        const tech = posts
          .filter((p) => p.category?.slug === "tech" || p.category?.name === "Tech")
          .slice(0, 5);
        setTechArticles(tech.length > 0 ? tech : posts.slice(0, 5));
      })
      .catch((err) => console.error("Failed to fetch blog data:", err));

    fetch("https://github-contributions-api.jogruber.de/v4/OmobolajiDurojaiye")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.contributions) {
          const today = new Date();
          const oneYearAgo = new Date();
          oneYearAgo.setDate(today.getDate() - 365);

          const total = data.contributions.reduce((sum, day) => {
            const dayDate = new Date(day.date);
            if (dayDate >= oneYearAgo && dayDate <= today) {
              return sum + day.count;
            }
            return sum;
          }, 0);
          setGithubTotal(total);

          const { weeks, monthLabels: labels } = buildHeatmapWeeks(data.contributions);
          setGithubWeeks(weeks);
          setMonthLabels(labels);
        }
      })
      .catch((err) => console.error("Failed to fetch GitHub contributions:", err));
  }, []);

  const filteredStack =
    activeStackTab === "All"
      ? TECH_STACK
      : TECH_STACK.filter((item) => item.category === activeStackTab);

  const scrollProjects = (direction) => {
    if (!projectsRailRef.current) return;
    const cardWidth = 356;
    projectsRailRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  const handleWritingMouseMove = (e, post) => {
    setHoveredPost(post);
    setHoverPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="home-editorial">
      <Helmet>
        <title>Omobolaji Durojaiye — Software Engineer & B2B SaaS Architect in Abuja, Nigeria</title>
        <meta
          name="description"
          content="Omobolaji Durojaiye (Bolaji) is a full-stack software engineer and B2B SaaS architect based in Abuja, Nigeria. Technical founder of Kasi AI and ProofDeck."
        />
      </Helmet>

      {/* 1. Hero Banner Section */}
      <section className="grid-section hero-banner-section">
        <div className="hero-banner-frame">
          <img
            src={heroBanner}
            alt="Twilight pixel-art waterfall and rocky monolith landscape"
            className="hero-banner-img"
          />
          <div className="hero-banner-vignette" />
        </div>
      </section>

      {/* 2. Identity Bar */}
      <section className="grid-section identity-section">
        <div className="identity-row">
          <div className="identity-left">
            <div className="identity-avatar-box">
              <img src={headshot} alt="Omobolaji Durojaiye" className="identity-avatar" />
              <span className="identity-online-dot" title="Available for projects" />
            </div>

            <div className="identity-text">
              <div className="identity-name-line">
                <h1 className="identity-name">Omobolaji Durojaiye</h1>
                <FaCheckCircle className="identity-verified" title="Verified Engineer" />
              </div>
              <p className="identity-role">Software Engineer &amp; B2B SaaS Architect</p>
              <p className="identity-location">Abuja, Nigeria · @bjtolu</p>
            </div>
          </div>

          <div className="identity-right">
            <Link to="/contact" className="identity-cta-btn">
              <span className="cta-pulse-dot" />
              <span>Book a Call</span>
              <FiArrowUpRight />
            </Link>
          </div>
        </div>
      </section>

      <div className="grid-spacer-band" aria-hidden="true" />

      {/* 3. About Section */}
      <section className="grid-section about-section">
        <div className="section-head-row">
          <h2 className="editorial-heading">About</h2>
        </div>

        <ul className="about-bullet-list">
          <li>
            I'm Omobolaji Durojaiye (you can call me <strong>Bolaji</strong>) — a{" "}
            <span className="about-emphasis">Software Engineer &amp; Startup Founder</span>{" "}
            building easy-to-use software that reduces admin burden and streamlines business workflows.
          </li>
          <li>
            I architect and ship full-stack products with{" "}
            <span className="about-emphasis">React, Python, FastAPI &amp; Flask</span>, focusing on
            clean systems, reliability, and practical AI automation.
          </li>
          <li>
            Founder &amp; builder behind{" "}
            <a href="https://usekasi.com" target="_blank" rel="noopener noreferrer" className="about-link">
              Kasi AI
            </a>{" "}
            (social commerce AI &amp; booking agent),{" "}
            <a href="https://proofdeck.app" target="_blank" rel="noopener noreferrer" className="about-link">
              ProofDeck
            </a>{" "}
            (digital credentialing platform), and client software through{" "}
            <a href="https://techbe.online" target="_blank" rel="noopener noreferrer" className="about-link">
              BE Tech Agency
            </a>
            .
          </li>
          <li>
            Inquisitive by nature and committed till it's done — if we work together, expect
            craftsmanship and ownership from discovery to launch.
          </li>
        </ul>
      </section>

      <div className="grid-spacer-band" aria-hidden="true" />

      {/* 4. Contact Links Row */}
      <section className="grid-section contact-strip-section">
        <div className="section-head-row">
          <h2 className="editorial-heading">Contact</h2>
        </div>

        <div className="contact-pills-grid">
          {CONTACT_LINKS.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-tile-link"
              >
                <span className="contact-tile-icon">{item.icon}</span>
                <span className="contact-tile-label">{item.label}</span>
                <FiArrowUpRight className="contact-tile-arrow" />
              </a>
            ) : (
              <Link key={item.label} to={item.to} className="contact-tile-link">
                <span className="contact-tile-icon">{item.icon}</span>
                <span className="contact-tile-label">{item.label}</span>
                <FiArrowUpRight className="contact-tile-arrow" />
              </Link>
            )
          )}
        </div>
      </section>

      <div className="grid-spacer-band" aria-hidden="true" />

      {/* 5. Projects Horizontal Scroll Preview */}
      <section className="grid-section projects-preview-section">
        <div className="section-head-row">
          <h2 className="editorial-heading">Projects</h2>
          <div className="projects-head-actions">
            <div className="rail-nav-buttons">
              <button
                type="button"
                className="rail-nav-btn"
                onClick={() => scrollProjects("left")}
                aria-label="Scroll projects left"
              >
                <FaChevronLeft />
              </button>
              <button
                type="button"
                className="rail-nav-btn"
                onClick={() => scrollProjects("right")}
                aria-label="Scroll projects right"
              >
                <FaChevronRight />
              </button>
            </div>
            <Link to="/portfolio" className="section-view-all">
              View all <FiArrowUpRight />
            </Link>
          </div>
        </div>

        <div className="home-projects-rail" ref={projectsRailRef}>
          {projects.map((project) => (
            <article key={project.id} className="home-project-card">
              <a
                href={project.live_url || project.github_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="home-project-thumb-wrap"
              >
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="home-project-thumb"
                  loading="lazy"
                />
                {project.duration && (
                  <span className="home-project-duration">{project.duration}</span>
                )}
              </a>

              <div className="home-project-body">
                <div className="home-project-title-row">
                  <h3 className="home-project-title">{project.title}</h3>
                  {project.live_url && (
                    <span className="live-status-badge">
                      <span className="live-dot" /> Live
                    </span>
                  )}
                </div>

                {project.role && <p className="home-project-role">{project.role}</p>}

                <p className="home-project-desc">{project.description}</p>

                <div className="home-project-footer">
                  <div className="home-project-tags">
                    {(project.tech_stack || []).slice(0, 3).map((tech) => (
                      <span key={tech} className="mini-tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="home-project-icons">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Live site"
                        aria-label={`${project.title} live site`}
                      >
                        <FaGlobe />
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="GitHub repository"
                        aria-label={`${project.title} GitHub`}
                      >
                        <FaGithub />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="grid-spacer-band" aria-hidden="true" />

      {/* 6. Tech Stack with Category Filter Tabs */}
      <section className="grid-section stack-section">
        <div className="section-head-row stack-head-row">
          <h2 className="editorial-heading">Tech Stack</h2>

          <div className="stack-filter-tabs" role="tablist" aria-label="Filter tech stack">
            {STACK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeStackTab === cat}
                className={`stack-tab-btn ${activeStackTab === cat ? "is-active" : ""}`}
                onClick={() => setActiveStackTab(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="stack-pills-wrap">
          {filteredStack.map((item) => (
            <div className="stack-pill" key={item.id}>
              <span className="stack-pill-icon">
                <DynamicIcon name={item.icon_name} />
              </span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid-spacer-band" aria-hidden="true" />

      {/* 7. GitHub Activity Heatmap (Full-Fit, Zero Horizontal Scroll) */}
      <section className="grid-section github-section">
        <div className="section-head-row">
          <h2 className="editorial-heading">GitHub Activity</h2>
          <a
            href="https://github.com/OmobolajiDurojaiye"
            target="_blank"
            rel="noopener noreferrer"
            className="section-view-all"
          >
            @OmobolajiDurojaiye <FiArrowUpRight />
          </a>
        </div>

        <div className="heatmap-wrapper">
          {githubWeeks.length > 0 ? (
            <>
              <div
                className="heatmap-months"
                style={{ gridTemplateColumns: `repeat(${githubWeeks.length}, minmax(0, 1fr))` }}
              >
                {monthLabels.map((m) => (
                  <span
                    key={`${m.label}-${m.index}`}
                    className="heatmap-month-label"
                    style={{ gridColumnStart: m.index + 1 }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>
              <div
                className="heatmap-grid"
                style={{ gridTemplateColumns: `repeat(${githubWeeks.length}, minmax(0, 1fr))` }}
              >
                {githubWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="heatmap-col">
                    {week.map((day, dIdx) => {
                      if (!day) {
                        return <span key={dIdx} className="heatmap-cell is-empty" />;
                      }
                      const level = Math.min(
                        4,
                        day.level ??
                          (day.count === 0
                            ? 0
                            : day.count < 3
                            ? 1
                            : day.count < 6
                            ? 2
                            : day.count < 10
                            ? 3
                            : 4)
                      );
                      return (
                        <span
                          key={day.date}
                          className={`heatmap-cell level-${level}`}
                          title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="heatmap-footer">
                <span className="heatmap-count">
                  {githubTotal !== null
                    ? `${githubTotal.toLocaleString()} contributions in the last year`
                    : "GitHub contributions"}
                </span>
                <div className="heatmap-legend">
                  <span>Less</span>
                  <span className="heatmap-legend-cell level-0" />
                  <span className="heatmap-legend-cell level-1" />
                  <span className="heatmap-legend-cell level-2" />
                  <span className="heatmap-legend-cell level-3" />
                  <span className="heatmap-legend-cell level-4" />
                  <span>More</span>
                </div>
              </div>
            </>
          ) : (
            <div className="heatmap-fallback">
              <a
                href="https://github.com/OmobolajiDurojaiye"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://ghchart.rshah.org/a162f7/OmobolajiDurojaiye"
                  alt="Omobolaji Durojaiye's GitHub contributions"
                  className="heatmap-fallback-img"
                />
              </a>
            </div>
          )}
        </div>
      </section>

      <div className="grid-spacer-band" aria-hidden="true" />

      {/* 8. Work Journey (Moved from About) */}
      <section className="grid-section journey-section">
        <div className="section-head-row">
          <h2 className="editorial-heading">Work Journey</h2>
        </div>

        <div className="home-timeline-list">
          {WORK_JOURNEY.map((job, index) => (
            <div className="home-timeline-item" key={index}>
              <span className="home-timeline-dot" />
              {index < WORK_JOURNEY.length - 1 && <span className="home-timeline-line" />}
              <div className="home-timeline-body">
                <div className="home-timeline-top">
                  <h3 className="home-timeline-role">{job.role}</h3>
                  <span className="home-timeline-duration">{job.duration}</span>
                </div>
                <p className="home-timeline-company">{job.company}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid-spacer-band" aria-hidden="true" />

      {/* 9. How I Work (Moved from About) */}
      <section className="grid-section process-section">
        <div className="section-head-row">
          <h2 className="editorial-heading">How I Work</h2>
        </div>

        <div className="home-process-box">
          <div className="home-process-header">
            <span className="home-process-num">{WORK_PROCESS[activeStep].num}</span>
            <h3 className="home-process-title">{WORK_PROCESS[activeStep].title}</h3>
          </div>
          <p className="home-process-desc">{WORK_PROCESS[activeStep].description}</p>
        </div>

        <div className="home-process-tabs">
          {WORK_PROCESS.map((step, index) => (
            <button
              key={step.num}
              type="button"
              className={`home-process-btn ${activeStep === index ? "is-active" : ""}`}
              onClick={() => setActiveStep(index)}
            >
              {step.num} · {step.title}
            </button>
          ))}
        </div>
      </section>

      <div className="grid-spacer-band" aria-hidden="true" />

      {/* 10. What I Do */}
      <section className="grid-section services-section">
        <div className="section-head-row">
          <h2 className="editorial-heading">What I Do</h2>
          <Link to="/contact" className="section-view-all">
            Book a session <FiArrowUpRight />
          </Link>
        </div>

        <div className="services-cards-grid">
          {SERVICE_ITEMS.map((service) => (
            <div className="service-tile" key={service.num}>
              <span className="service-num">{service.num}</span>
              <h3 className="service-tile-title">{service.title}</h3>
              <p className="service-tile-desc">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. From The Notebook (With Floating Cover Image Hover Preview!) */}
      {techArticles.length > 0 && (
        <>
          <div className="grid-spacer-band" aria-hidden="true" />
          <section className="grid-section writing-section">
            <div className="section-head-row">
              <h2 className="editorial-heading">From The Notebook</h2>
              <Link to="/blog" className="section-view-all">
                Open notebook <FiArrowUpRight />
              </Link>
            </div>

            <div className="writing-rows">
              {techArticles.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="writing-row-item"
                  onMouseEnter={(e) => handleWritingMouseMove(e, post)}
                  onMouseMove={(e) => handleWritingMouseMove(e, post)}
                  onMouseLeave={() => setHoveredPost(null)}
                >
                  <div className="writing-row-left">
                    <span className="writing-row-title">{post.title}</span>
                    {post.excerpt && (
                      <span className="writing-row-excerpt">{post.excerpt}</span>
                    )}
                    <div className="writing-row-meta">
                      {post.category && (
                        <span className="writing-row-cat">{post.category.name}</span>
                      )}
                      {post.date_posted && (
                        <span className="writing-row-date">
                          {new Date(post.date_posted).toLocaleDateString(undefined, {
                            month: "long",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="writing-row-readmore">
                    Read more <FaArrowRight />
                  </span>
                </Link>
              ))}
            </div>

            {/* Floating Cover Image Preview Card (Inspired by Image 3) */}
            {hoveredPost && (hoveredPost.image_url || hoveredPost.image) && (
              <div
                className="writing-hover-preview"
                style={{
                  left: `${Math.min(Math.max(hoverPos.x, 160), window.innerWidth - 180)}px`,
                  top: `${Math.max(hoverPos.y - 120, 90)}px`,
                }}
                aria-hidden="true"
              >
                <div className="writing-hover-img-wrap">
                  <img
                    src={hoveredPost.image_url || hoveredPost.image}
                    alt={hoveredPost.title}
                  />
                </div>
                <div className="writing-hover-caption">
                  <span className="writing-hover-title">{hoveredPost.title}</span>
                  {hoveredPost.date_posted && (
                    <span className="writing-hover-year">
                      {new Date(hoveredPost.date_posted).getFullYear()}
                    </span>
                  )}
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default LandingPage;
