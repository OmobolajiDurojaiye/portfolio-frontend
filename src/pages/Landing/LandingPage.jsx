import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import { 
  FaCheckCircle, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaCalendarCheck,
  FaArrowRight,
  FaBookOpen
} from "react-icons/fa";
import headshot from "../../assets/PFP.png";
import apiClient from "../../services/api";
import DynamicIcon from "../../utils/iconMap";
import "./LandingPage.css";

const fallbackProjects = [
  {
    id: 1,
    title: "ProofDeck",
    live_url: "https://proofdeck.com",
    image_url: ""
  },
  {
    id: 2,
    title: "Kasi",
    live_url: "https://kasi.com",
    image_url: ""
  },
  {
    id: 3,
    title: "TeachJS",
    live_url: "https://teachjs.com",
    image_url: ""
  },
  {
    id: 4,
    title: "Paf Engineering and Logistics",
    live_url: "https://paf.com",
    image_url: ""
  }
];

const fallbackWriting = [
  {
    id: 9,
    title: "ProofDeck API Integration Guide",
    slug: "proofdeck-api-integration-guide",
    image_url: "",
    category: { name: "Tech" }
  },
  {
    id: 2,
    title: "The Development of CertifyMe (Now ProofDeck)",
    slug: "the-development-of-certifyme-now-proofdeck",
    image_url: "",
    category: { name: "Tech" }
  },
  {
    id: 5,
    title: "Auditing What We Have",
    slug: "auditing-what-we-have",
    image_url: "",
    category: { name: "Tech" }
  },
  {
    id: 8,
    title: "Hello, ProofDeck. Goodbye, CertifyMe.",
    slug: "hello-proofdeck-goodbye-certifyme",
    image_url: "",
    category: { name: "Tech" }
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

  // Replace raw "techbe.online" with its link version if not already in markdown format
  formatted = formatted.replace(/(?<!\[)techbe\.online(?!\])/g, "[techbe.online](https://techbe.online/)");

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
  const [aboutData, setAboutData] = useState(null);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [techArticles, setTechArticles] = useState([]);

  useEffect(() => {
    // 1. Fetch profile bio details
    apiClient.get("/api/about/")
      .then((res) => {
        setAboutData(res.data);
      })
      .catch((err) => {
        console.log("Backend failed, using offline fallback bio.");
        setAboutData({
          name: "Bolaji",
          role: "Software Engineer & Digital Architect",
          location: "Abuja, Nigeria",
          bio: "I’m Omobolaji Durojaiye; you can call me Bolaji. I’m a software engineer and startup founder building easy-to-use software for businesses, reducing admin burden and streamlining workflows.\n\nSome of what I've built: Kasi AI (AI-powered WhatsApp sales & booking agent), ProofDeck (digital credentialing platform), TeachJS, and Student Progress Tracker, plus client work through my agency - BE Tech Agency (https://techbe.online/).\n\nI'm inquisitive by nature and see every project through to the end. If you work with me, expect commitment till it's done.\n\nWant to talk? Drop a message, book a call, or find me on socials below.",
          skills: [
            { id: 1, name: "React", icon_name: "FaReact" },
            { id: 2, name: "Node.js", icon_name: "FaNodeJs" },
            { id: 3, name: "Python", icon_name: "FaPython" },
            { id: 4, name: "UI Design", icon_name: "FaPalette" }
          ],
          tools: [
            { id: 1, name: "VS Code", icon_name: "FaCode" },
            { id: 2, name: "Figma", icon_name: "FaFigma" },
            { id: 3, name: "Git", icon_name: "FaGithub" }
          ]
        });
      });

    // 2. Fetch real featured projects from API
    apiClient.get("/api/portfolio/projects/featured")
      .then((res) => {
        setFeaturedProjects(res.data.slice(0, 4));
      })
      .catch((err) => {
        console.log("Backend failed, using local fallback projects.");
        setFeaturedProjects(fallbackProjects);
      });

    // 3. Fetch blog posts and filter only Tech articles (up to 5)
    apiClient.get("/api/blog/home-data")
      .then((res) => {
        const posts = res.data.posts || [];
        const tech = posts.filter(p => p.category?.slug === "tech" || p.category?.name === "Tech").slice(0, 5);
        
        setTechArticles(tech.length > 0 ? tech : fallbackWriting.slice(0, 5));
      })
      .catch((err) => {
        console.log("Blog data endpoint failed, using local writing fallbacks.");
        setTechArticles(fallbackWriting.slice(0, 5));
      });
  }, []);

  if (!aboutData) {
    return (
      <div className="profile-loading-container">
        <div className="profile-loading-spinner"></div>
      </div>
    );
  }

  // Combine Skills and Tools/Principles
  const allStackItems = [...(aboutData.skills || []), ...(aboutData.tools || [])];

  return (
    <div className="profile-redesign-wrapper">
      <Helmet>
        <title>Bolaji — Software Engineer & Digital Architect</title>
        <meta name="description" content="Portfolio of Bolaji — a software engineer crafting high-performance backend systems, intuitive frontend interfaces, and polished digital experiences." />
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
            <a href="/contact" className="book-session-btn">
              <FaCalendarCheck className="btn-icon" />
              <span>Book a Call</span>
            </a>
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
              <ReactMarkdown>{formatBioText(aboutData.bio)}</ReactMarkdown>
            </div>
          </div>

          {/* Featured Projects Card */}
          <div className="details-card featured-projects-card">
            <h4 className="details-card-sub-title">Featured Projects</h4>
            <div className="featured-projects-list">
              {featuredProjects.map((project) => (
                <a
                  href={project.case_study_url || project.live_url || project.github_url || "#"}
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
          {allStackItems.length > 0 && (
            <div className="details-card stack-card">
              <h4 className="details-card-sub-title">Stack, Tools & Principles</h4>
              <div className="stack-tags-grid">
                {allStackItems.map((item, index) => (
                  <div className="stack-tag-item" key={item.id || index}>
                    <DynamicIcon name={item.icon_name} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Writing Section (Tech Articles Only, Up to 5) */}
          {techArticles.length > 0 && (
            <div className="details-card writing-card">
              <h4 className="details-card-sub-title">Writing</h4>
              <div className="featured-projects-list">
                {techArticles.map((post) => (
                  <a href={`/blog/${post.slug}`} className="featured-project-item" key={post.id}>
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
                  </a>
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
              <a href="/contact" className="services-cta-btn">
                <span>Let's Collaborate</span>
                <FaArrowRight className="cta-arrow-icon" />
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default LandingPage;
