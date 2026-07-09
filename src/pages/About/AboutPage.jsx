import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FaSpotify } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import apiClient from "../../services/api";
import DynamicIcon from "../../utils/iconMap";
import "./AboutPage.css";

const workProcess = [
  {
    title: "01 Discovery Call",
    description:
      "We'll have a Discovery Call to discuss your goals, needs, and project requirements. This helps us align our vision and set the foundation for a successful collaboration."
  },
  {
    title: "02 Project Proposal",
    description:
      "After our call, I will send you a detailed project proposal including the price quote. Upon agreement, we'll secure the first milestone."
  },
  {
    title: "03 Design & Development",
    description:
      "This is where the magic happens. I will design and develop your project, providing regular updates and milestones for your review and feedback."
  },
  {
    title: "04 Review & Revisions",
    description:
      "We'll review the completed milestones together. This is the time for revisions to ensure the project perfectly matches your vision."
  },
  {
    title: "05 Launch & Handover",
    description:
      "Once everything is approved, we'll deploy the project. I'll hand over all the necessary files and provide documentation for a smooth transition."
  }
];

const HowIWork = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="how-i-work-container">
      <h4 className="details-card-sub-title">How I Work</h4>
      <div className="step-content">
        <h5 className="step-title">{workProcess[activeStep].title}</h5>
        <p className="step-description">
          {workProcess[activeStep].description}
        </p>
      </div>
      <div className="step-buttons">
        {workProcess.map((step, index) => (
          <button
            key={index}
            className={`step-button ${activeStep === index ? "active" : ""}`}
            onClick={() => setActiveStep(index)}
          >
            Step {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

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

function AboutPage() {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    apiClient.get("/api/about/")
      .then((res) => {
        setAboutData(res.data);
      })
      .catch((err) => {
        console.log("Backend failed, using local offline about fallback.");
        setAboutData({
          spotify_url: "https://open.spotify.com",
          bio: "Omobolaji Durojaiye is a full-stack software engineer and B2B SaaS architect based in Abuja, Nigeria. He specializes in building high-performance web platforms, custom database architectures using PostgreSQL, and high-throughput APIs powered by Python (FastAPI & Flask).\n\nAs the technical founder behind Kasi AI (an intelligent sales assistant for social commerce: https://usekasi.com/) and ProofDeck (a digital credentialing platform: https://proofdeck.app/), he delivers enterprise-grade software craftsmanship.\n\nFrequently cited among the best web developers in Nigeria, his work through BE Tech Agency (techbe.online) drives AI automation and scalable digital products globally.",
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
          ],
          work_experiences: [
            {
              role: "Frontend Software Developer",
              company: "Freelance",
              duration: "2020 - Present",
              description: "Building premium React applications, optimizing web performance, and writing clean, scalable frontend code."
            },
            {
              role: "Junior Web Developer",
              company: "TechAgency",
              duration: "2018 - 2020",
              description: "Collaborated on web portal assets, designed client dashboards, and maintained codebase repositories."
            }
          ]
        });
      });
  }, []);

  if (!aboutData) {
    return (
      <div className="about-loading-container">
        <div className="about-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="about-page-wrapper">
      <Helmet>
        <title>About Omobolaji Durojaiye | SaaS Developer & AI Engineer in Abuja</title>
        <meta name="description" content="Omobolaji Durojaiye is a software developer in Abuja, Nigeria, crafting high-performance B2B SaaS platforms and custom database systems. Technical founder of Kasi AI." />
        <meta property="og:title" content="About Omobolaji Durojaiye | SaaS Developer & AI Engineer" />
        <meta property="og:description" content="Omobolaji Durojaiye is a software developer in Abuja, Nigeria, crafting high-performance B2B SaaS platforms and custom database systems. Technical founder of Kasi AI." />
        <meta property="og:image" content="https://bolaji.tech/favicon.png" />
      </Helmet>
      
      {/* 1. About Bio Card */}
      <div className="details-card about-bio-card">
        <h3 className="details-card-title">About Me</h3>
        <div className="bio-paragraph">
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
            {formatBioText(aboutData.bio)}
          </ReactMarkdown>
        </div>
        {aboutData.spotify_url && (
          <a
            href={aboutData.spotify_url}
            target="_blank"
            rel="noopener noreferrer"
            className="spotify-link"
          >
            <FaSpotify />
            <span>Listen on Spotify</span>
          </a>
        )}
      </div>

      {/* 2. Toolkit & Work Tools Card */}
      <div className="details-card toolkit-card">
        <h4 className="details-card-sub-title">Technical Toolkit</h4>
        <div className="skills-grid-clean">
          {aboutData.skills.map((skill) => (
            <div className="skill-item-clean" key={skill.id}>
              <DynamicIcon name={skill.icon_name} />
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
        
        <h4 className="details-card-sub-title mt-4">Work Tools</h4>
        <div className="skills-grid-clean">
          {aboutData.tools.map((tool) => (
            <div className="skill-item-clean" key={tool.id}>
              <DynamicIcon name={tool.icon_name} />
              <span>{tool.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. How I Work Workflow */}
      <div className="details-card workflow-card">
        <HowIWork />
      </div>

      {/* 4. Work Journey Timeline */}
      <div className="details-card timeline-card">
        <h4 className="details-card-sub-title">Work Journey</h4>
        <div className="clean-timeline-list">
          {aboutData.work_experiences.map((job, index) => (
            <div className="timeline-item-clean" key={index}>
              <div className="timeline-dot"></div>
              {index < aboutData.work_experiences.length - 1 && <div className="timeline-line"></div>}
              
              <div className="timeline-info-block">
                <div className="timeline-job-header">
                  <h5 className="timeline-job-role">{job.role}</h5>
                  <span className="timeline-job-duration">{job.duration}</span>
                </div>
                <p className="timeline-job-company">{job.company}</p>
                {job.description && (
                  <div className="timeline-job-desc">
                    <ReactMarkdown>{job.description}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default AboutPage;
