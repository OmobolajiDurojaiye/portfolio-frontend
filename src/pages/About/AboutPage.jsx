import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Helmet } from "react-helmet-async";
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

const ABOUT_BIO = `I'm Omobolaji Durojaiye; you can call me Bolaji. I'm a software engineer and startup founder building easy-to-use software for businesses, reducing admin burden and streamlining workflows.

Some of what I've built: Kasi AI (social commerce AI & booking agent: https://usekasi.com) and ProofDeck (digital credentialing platform: https://proofdeck.app), plus client work through my agency — BE Tech Agency (https://techbe.online).

I'm inquisitive by nature and see every project through to the end. If you work with me, expect commitment till it's done.

Want to talk? Drop a message, book a call, or find me on socials below.`;

const ABOUT_SKILLS = [
  { id: 1, name: "React", icon_name: "FaReact" },
  { id: 2, name: "Flask", icon_name: "SiFlask" },
  { id: 3, name: "FastAPI", icon_name: "SiFastapi" },
  { id: 4, name: "Python", icon_name: "FaPython" },
  { id: 5, name: "JavaScript", icon_name: "SiJavascript" },
  { id: 6, name: "MySQL", icon_name: "SiMysql" },
  { id: 7, name: "Postman", icon_name: "SiPostman" },
  { id: 8, name: "System Design", icon_name: "FaSitemap" }
];

const ABOUT_TOOLS = [
  { id: 9, name: "CLI / Terminal", icon_name: "FaTerminal" },
  { id: 10, name: "VS Code", icon_name: "SiVisualstudiocode" },
  { id: 11, name: "Git", icon_name: "FaGitAlt" },
  { id: 12, name: "GitHub", icon_name: "FaGithub" },
  { id: 13, name: "Google Docs", icon_name: "SiGoogledocs" },
  { id: 14, name: "AI Research", icon_name: "FaRobot" }
];

const WORK_JOURNEY = [
  {
    role: "Software Engineer",
    company: "Freelance",
    duration: "March 2022 - Present"
  },
  {
    role: "Lead Software Engineer",
    company: "BE Tech Agency",
    duration: "April 2023 - Present"
  },
  {
    role: "CTO",
    company: "Kasi AI",
    duration: "February 2026 - Present"
  }
];

function AboutPage() {

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
            {formatBioText(ABOUT_BIO)}
          </ReactMarkdown>
        </div>

      </div>

      {/* 2. Toolkit & Work Tools Card */}
      <div className="details-card toolkit-card">
        <h4 className="details-card-sub-title">Technical Toolkit</h4>
        <div className="skills-grid-clean">
          {ABOUT_SKILLS.map((skill) => (
            <div className="skill-item-clean" key={skill.id}>
              <DynamicIcon name={skill.icon_name} />
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
        
        <h4 className="details-card-sub-title mt-4">Work Tools</h4>
        <div className="skills-grid-clean">
          {ABOUT_TOOLS.map((tool) => (
            <div className="skill-item-clean" key={tool.id}>
              <DynamicIcon name={tool.icon_name} />
              <span>{tool.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2b. Detailed Spotify & GitHub Activity Cards (About Page versions) */}
      <div className="details-card github-card-about-full">
        <h4 className="details-card-sub-title">GitHub Contributions & Activity</h4>
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
          <span className="github-handle">@OmobolajiDurojaiye on GitHub</span>
          <span className="github-streak-text">841 contributions in the last year</span>
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
          {WORK_JOURNEY.map((job, index) => (
            <div className="timeline-item-clean" key={index}>
              <div className="timeline-dot"></div>
              {index < WORK_JOURNEY.length - 1 && <div className="timeline-line"></div>}
              
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
