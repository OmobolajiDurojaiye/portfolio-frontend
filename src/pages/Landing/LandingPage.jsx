import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { 
  FaCheckCircle, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaCalendarCheck,
  FaArrowRight,
  FaBookOpen,
  FaUser
} from "react-icons/fa";
import headshot from "../../assets/PFP.png";
import apiClient from "../../services/api";
import DynamicIcon from "../../utils/iconMap";
import "./LandingPage.css";

const PROFILE_BIO = `I'm Omobolaji Durojaiye; you can call me Bolaji. I'm a software engineer and startup founder building easy-to-use software for businesses, reducing admin burden and streamlining workflows.

Some of what I've built: Kasi AI (social commerce AI & booking agent: https://usekasi.com) and ProofDeck (digital credentialing platform: https://proofdeck.app), plus client work through my agency — BE Tech Agency (https://techbe.online).

I'm inquisitive by nature and see every project through to the end. If you work with me, expect commitment till it's done.

Want to talk? Drop a message, book a call, or find me on socials below.`;

const HARDCODED_SKILLS = [
  { id: 1, name: "React", icon_name: "FaReact" },
  { id: 2, name: "Flask", icon_name: "SiFlask" },
  { id: 3, name: "FastAPI", icon_name: "SiFastapi" },
  { id: 4, name: "Python", icon_name: "FaPython" },
  { id: 5, name: "JavaScript", icon_name: "SiJavascript" },
  { id: 6, name: "MySQL", icon_name: "SiMysql" },
  { id: 7, name: "Postman", icon_name: "SiPostman" },
  { id: 8, name: "System Design", icon_name: "FaSitemap" },
  { id: 9, name: "CLI / Terminal", icon_name: "FaTerminal" },
  { id: 10, name: "VS Code", icon_name: "SiVisualstudiocode" },
  { id: 11, name: "Git", icon_name: "FaGitAlt" },
  { id: 12, name: "GitHub", icon_name: "FaGithub" },
  { id: 13, name: "Google Docs", icon_name: "SiGoogledocs" },
  { id: 14, name: "AI Research", icon_name: "FaRobot" }
];

const HARDCODED_PROJECTS = [
  {
    id: 1,
    title: "ProofDeck",
    live_url: "https://www.proofdeck.app/",
    image_url: "https://res.cloudinary.com/dgmpklnor/image/upload/v1768927154/feature-bulk_lo3mcj.png"
  },
  {
    id: 2,
    title: "BE Tech Agency",
    live_url: "https://techbe.online/",
    image_url: "https://res.cloudinary.com/dgmpklnor/image/upload/v1783669140/b75d6a7b-bf0b-4b3b-bff9-9f22a3f874a9.png"
  },
  {
    id: 3,
    title: "Kasi AI",
    live_url: "https://usekasi.com/",
    image_url: "https://www.usekasi.com/kasi.png"
  },
  {
    id: 4,
    title: "TeachJS",
    live_url: "https://teachjs.proofdeck.app/",
    image_url: "https://res.cloudinary.com/dgmpklnor/image/upload/q_auto/f_auto/v1775927803/cfc82239-4115-4dd4-95fe-c1aa16b5032b.png"
  },
  {
    id: 5,
    title: "PAF Engineering",
    live_url: "https://pafelng.com/",
    image_url: "https://res.cloudinary.com/dgmpklnor/image/upload/v1765632895/Screenshot_2025-12-13_143435_y8fxvd.png"
  }
];

const serviceItems = [
  {
    title: "AI Agents & AI-Powered Apps",
    description: "Developing smart, LLM-driven agents and integrations to automate complex business workflows."
  },
  {
    title: "Web & Mobile Applications",
    description: "Engineering high-performance React, React Native, and Django applications crafted for scale."
  },
  {
    title: "Business Websites & Platforms",
    description: "Creating clean, modern, high-converting digital storefronts and bespoke corporate platforms."
  }
];

const formatBioText = (bio) => {
  if (!bio) return "";
  let formatted = bio;
  
  // 1. Convert HTTP/HTTPS links into markdown links with clean hostname anchors
  const urlRegex = /(https?:\/\/(?:www\.)?([a-zA-Z0-9.-]+)(?:\/[^\s\)]*)?)/g;
  formatted = formatted.replace(urlRegex, (match, fullUrl, domain) => {
    let cleanUrl = fullUrl;
    if (cleanUrl.endsWith('.') || cleanUrl.endsWith(',') || cleanUrl.endsWith(')')) {
      // Avoid capturing trailing punctuation
      if (cleanUrl.endsWith(')')) {
        cleanUrl = cleanUrl.slice(0, -1);
      } else {
        cleanUrl = cleanUrl.slice(0, -1);
      }
    }
    return `[${domain}](${cleanUrl})`;
  });

  // 2. Automatically split into spaced paragraphs (every 2 sentences) to prevent walls of text
  const paragraphs = formatted.split(/\n+/);
  const reformattedParagraphs = paragraphs.map(p => {
    const sentences = p.split(/(?<=[.!?])\s+/);
    const chunks = [];
    for (let i = 0; i < sentences.length; i += 2) {
      const chunk = sentences.slice(i, i + 2).join(" ");
      if (chunk.trim()) {
        chunks.push(chunk.trim());
      }
    }
    return chunks.join("\n\n");
  });

  return reformattedParagraphs.join("\n\n");
};

function LandingPage() {
  const [techArticles, setTechArticles] = useState([]);
  const [githubContributions, setGithubContributions] = useState(null);

  useEffect(() => {
    // Only blog posts are fetched dynamically — everything else is hardcoded
    apiClient.get("/api/blog/home-data")
      .then((res) => {
        const posts = res.data.posts || [];
        const tech = posts.filter(p => p.category?.slug === "tech" || p.category?.name === "Tech").slice(0, 5);
        setTechArticles(tech);
      })
      .catch((err) => {
        console.error("Failed to fetch blog data.", err);
      });

    // Fetch live GitHub contributions count
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
          setGithubContributions(total);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch GitHub contributions", err);
      });
  }, []);

  return (
    <div className="profile-redesign-wrapper">
      <Helmet>
        <title>Omobolaji Durojaiye — Software Engineer & B2B SaaS Architect in Abuja, Nigeria</title>
        <meta name="description" content="Omobolaji Durojaiye (Bolaji) is a full-stack software engineer and B2B SaaS architect based in Abuja, Nigeria. Technical founder of Kasi AI and ProofDeck. Best web developer in Nigeria." />
        <meta property="og:title" content="Omobolaji Durojaiye — Software Engineer & SaaS Architect in Abuja" />
        <meta property="og:description" content="Omobolaji Durojaiye is a full-stack software engineer and B2B SaaS architect based in Abuja, Nigeria. Technical founder of Kasi AI and ProofDeck." />
        <meta property="og:image" content="https://bolaji.tech/favicon.png" />
        <meta name="twitter:title" content="Omobolaji Durojaiye — Software Engineer & SaaS Architect in Abuja" />
        <meta name="twitter:description" content="Omobolaji Durojaiye is a full-stack software engineer and B2B SaaS architect based in Abuja, Nigeria. Technical founder of Kasi AI and ProofDeck." />
        <meta name="twitter:image" content="https://bolaji.tech/favicon.png" />
      </Helmet>

      {/* Header Profile Section */}
      <section className="profile-header-card">
        {/* Banner: Solid minimal dark block - no gradients */}
        <div className="profile-banner"></div>

        {/* User Info Bar */}
        <div className="profile-info-bar">
          <div className="profile-avatar-wrapper">
            <img src={headshot} alt="Bolaji" className="profile-avatar-img" />
            <div className="avatar-status-dot"></div>
          </div>

          <div className="profile-identity">
            <div className="profile-name-row">
              <h2 className="profile-name">Bolaji</h2>
              <FaCheckCircle className="verification-check" title="Verified Developer" />
            </div>
            
            <div className="profile-rate">Software Engineer & Digital Architect</div>

            <div className="profile-meta-row">
              <span className="meta-item"><FaMapMarkerAlt /> Abuja, Nigeria</span>
            </div>
          </div>

          <div className="profile-action-buttons">
            <a href="mailto:omobolajidurojaiye57@gmail.com" className="icon-action-btn" title="Contact Me">
              <FaEnvelope />
            </a>
            <Link to="/about" className="book-session-btn secondary-action-btn">
              <FaUser className="btn-icon" />
              <span>About Me</span>
            </Link>
            <Link to="/contact" className="book-session-btn">
              <FaCalendarCheck className="btn-icon" />
              <span>Book a Call</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Bio / Details Grid */}
      <section className="profile-details-grid">
        <div className="details-main-pane">
          
          {/* Hero Copy / Bio Card */}
          <div className="details-card bio-card">
            <h3 className="details-card-title">I create softwares to simplify life and business workflow.</h3>
            <div className="bio-paragraph-container">
              <ReactMarkdown
                components={{
                  a: ({ href, children }) => {
                    let absoluteHref = href;
                    if (href && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('mailto:')) {
                      absoluteHref = `https://${href}`;
                    }
                    return (
                      <a href={absoluteHref} target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    );
                  }
                }}
              >
                {formatBioText(PROFILE_BIO)}
              </ReactMarkdown>
            </div>
          </div>

          {/* Featured Projects Card */}
          <div className="details-card featured-projects-card">
            <h4 className="details-card-sub-title">Featured Projects</h4>
            <div className="featured-projects-list">
              {HARDCODED_PROJECTS.map((project) => (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="featured-project-item"
                  key={project.id}
                >
                  <div className="project-preview-icon">
                    {project.image_url ? (
                      <img src={project.image_url} alt={project.title} className="project-thumbnail-img" />
                    ) : (
                      <span className="project-icon-placeholder">{project.title[0]}</span>
                    )}
                  </div>
                  <div className="project-info">
                    <h5 className="project-title">{project.title}</h5>
                    <span className="project-view-tag">View Project <FaArrowRight className="arrow-icon" /></span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Combined Stack, Tools & Principles Section */}
          <div className="details-card stack-card">
            <h4 className="details-card-sub-title">Stack, Tools & Principles</h4>
            <div className="stack-tags-grid">
              {HARDCODED_SKILLS.map((item) => (
                <div className="stack-tag-item" key={item.id}>
                  <DynamicIcon name={item.icon_name} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Activity Card */}
          <div className="details-card github-card-redesign">
            <h4 className="details-card-sub-title">GitHub Contributions</h4>
            <div className="github-chart-container">
              <a href="https://github.com/OmobolajiDurojaiye" target="_blank" rel="noopener noreferrer">
                <img 
                  src="https://ghchart.rshah.org/a162f7/OmobolajiDurojaiye" 
                  alt="Omobolaji Durojaiye's GitHub contributions" 
                  className="github-chart-img" 
                />
              </a>
            </div>
            <div className="github-activity-footer">
              <span className="github-handle">@OmobolajiDurojaiye</span>
              <span className="github-streak-text">
                {githubContributions !== null ? `${githubContributions.toLocaleString()} contributions` : "Loading contributions..."} in the last year
              </span>
            </div>
          </div>

          {/* Writing Section (Tech Articles Only, Up to 5) */}
          {techArticles.length > 0 && (
            <div className="details-card writing-card">
              <h4 className="details-card-sub-title">Writing</h4>
              <div className="featured-projects-list">
                {techArticles.map((post) => (
                  <Link to={`/blog/${post.slug}`} className="featured-project-item" key={post.id}>
                    <div className="project-preview-icon">
                      {post.image_url || post.image ? (
                        <img src={post.image_url || post.image} alt={post.title} className="project-thumbnail-img" />
                      ) : (
                        <span className="project-icon-placeholder">{post.title[0]}</span>
                      )}
                    </div>
                    <div className="project-info">
                      <h5 className="project-title">{post.title}</h5>
                      <span className="project-view-tag">Read Article <FaArrowRight className="arrow-icon" /></span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Services Section */}
          <div className="details-card services-card">
            <h4 className="details-card-sub-title">What I Do</h4>
            <div className="services-list-grid">
              {serviceItems.map((s, i) => (
                <div className="service-feature-item" key={i}>
                  <h5 className="service-feature-title">{s.title}</h5>
                  <p className="service-feature-desc">{s.description}</p>
                </div>
              ))}
            </div>
            
            <div className="services-cta-bar border-top-subtle mt-4 pt-3">
              <Link to="/contact" className="services-cta-btn">
                <span>Let's Collaborate</span>
                <FaArrowRight className="cta-arrow-icon" />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default LandingPage;
