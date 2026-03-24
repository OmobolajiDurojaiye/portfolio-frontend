import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FaRobot, 
  FaWhatsapp, 
  FaComments, 
  FaCalendarCheck, 
  FaBullhorn, 
  FaGoogle, 
  FaMapMarkerAlt, 
  FaSearch, 
  FaStar, 
  FaCheckCircle, 
  FaLaptopCode, 
  FaMobileAlt, 
  FaCode, 
  FaGlobe 
} from "react-icons/fa";
import "./ServicesPage.css";

const ServicesPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="services-page">
      {/* Intro Hero Section */}
      <section className="services-hero">
        <Container>
          <motion.span 
            className="intro-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Solutions for Growth
          </motion.span>
          <motion.h1 
            className="main-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Here's how I can help your <br />
            <span className="accent-text">business grow</span>
          </motion.h1>
        </Container>
      </section>

      {/* Section 1: AI Business Chatbots */}
      <section className="service-section" id="ai-chatbots">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <motion.div {...fadeInUp}>
                <span className="section-label">AI Business Chatbots</span>
                <h2 className="service-heading">I Build Bots That Work <br /><span className="highlight-text">While You Sleep</span></h2>
                <h3 className="service-subheading">
                  AI-powered chatbots for real estate, travel & service businesses — built to capture leads, answer questions, and close deals 24/7.
                </h3>
                <p className="service-intro">
                  Most businesses in Nigeria lose customers simply because no one replied fast enough. 
                  I build smart chatbots that respond instantly on WhatsApp and your website — 
                  qualifying leads, booking appointments, and answering FAQs — so your team wakes 
                  up to warm prospects, not missed opportunities.
                </p>
                <div className="who-it-is-for">
                  <h4 className="who-title">Who It's For:</h4>
                  <ul className="who-list">
                    <li className="who-item">Real estate agents</li>
                    <li className="who-item">Travel & tour companies</li>
                    <li className="who-item">Consultants</li>
                    <li className="who-item">Schools</li>
                    <li className="who-item">Service Businesses</li>
                  </ul>
                </div>
                <div className="mt-5">
                  <Button 
                    as={Link} 
                    to="/contact?message=I'm interested in building an AI Chatbot for my business." 
                    className="cta-button"
                  >
                    Get a Free Demo →
                  </Button>
                </div>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div 
                className="features-grid"
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
              >
                {[
                  {
                    icon: <FaWhatsapp />,
                    title: "WhatsApp & Website Integration",
                    desc: "Your bot lives where your customers already are."
                  },
                  {
                    icon: <FaComments />,
                    title: "Lead Capture Flow",
                    desc: "Collects name, number, and interest automatically."
                  },
                  {
                    icon: <FaRobot />,
                    title: "Custom Q&A",
                    desc: "Trained on your business, your services, your prices."
                  },
                  {
                    icon: <FaCalendarCheck />,
                    title: "Appointment Booking",
                    desc: "Customers book slots without calling anyone."
                  },
                  {
                    icon: <FaBullhorn />,
                    title: "Follow-up Sequences",
                    desc: "Automated messages to nurture cold leads."
                  }
                ].map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="feature-card"
                    variants={fadeInUp}
                  >
                    <span className="feature-icon">{feature.icon}</span>
                    <h4 className="feature-title">{feature.title}</h4>
                    <p className="feature-desc">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Section 2: GMB Setup Section */}
      <section className="service-section" id="gmb-setup">
        <Container>
          <Row className="flex-lg-row-reverse align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <motion.div {...fadeInUp}>
                <span className="section-label">Google Business Profile (GMB)</span>
                <h2 className="service-heading">Get Found on Google — <br /><span className="highlight-text">Before Your Competitor Does</span></h2>
                <h3 className="service-subheading">
                  I set up and optimise your Google Business Profile so customers in your city find you first — on Maps, Search, and beyond.
                </h3>
                <p className="service-intro">
                  When someone searches "real estate agent in Lagos" or "travel agency near me," 
                  Google Business Profile determines who shows up. Most businesses in Nigeria 
                  either don't have one, or have one that's incomplete and ignored. I fix that 
                  — fully setting it up, writing your description, adding your services, 
                  and optimising it so Google trusts and ranks your business.
                </p>
                <div className="who-it-is-for">
                  <h4 className="who-title">Why It Matters:</h4>
                  <p className="service-intro mb-0">
                    Businesses with a complete, optimised GMB profile get up to 7x more clicks 
                    than those without one. It's free visibility on the world's biggest search engine.
                  </p>
                </div>
                <div className="mt-5">
                  <Button 
                    as={Link} 
                    to="/contact?message=I'd like to set up and optimize my Google Business Profile (GMB)." 
                    className="cta-button"
                  >
                    Set Up My Profile →
                  </Button>
                </div>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div 
                className="features-grid"
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
              >
                {[
                  {
                    icon: <FaCheckCircle />,
                    title: "Full Profile Setup",
                    desc: "Name, category, address, phone, website, hours."
                  },
                  {
                    icon: <FaSearch />,
                    title: "SEO-Optimised Description",
                    desc: "Written to rank and convert visitors into customers."
                  },
                  {
                    icon: <FaMapMarkerAlt />,
                    title: "Service & Product Listings",
                    desc: "So customers know exactly what you offer."
                  },
                  {
                    icon: <FaGoogle />,
                    title: "Verification Support",
                    desc: "I walk you through the process end-to-end."
                  },
                  {
                    icon: <FaStar />,
                    title: "Review Strategy",
                    desc: "How to get your first 10 five-star reviews fast."
                  }
                ].map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="feature-card"
                    variants={fadeInUp}
                  >
                    <span className="feature-icon" style={{ color: 'var(--teal-accent)' }}>{feature.icon}</span>
                    <h4 className="feature-title">{feature.title}</h4>
                    <p className="feature-desc">{feature.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Other Services Section */}
      <section className="other-services-section">
        <Container>
          <motion.div {...fadeInUp}>
            <h2 className="service-heading">Core Development Services</h2>
            <p className="service-intro mx-auto">
              Beyond specialized business growth tools, I build high-performance 
              software solutions tailored to your specific needs.
            </p>
          </motion.div>
          <Row className="other-services-grid justify-content-center">
            {[
              { icon: <FaLaptopCode />, name: "Web Applications" },
              { icon: <FaGlobe />, name: "Business Websites" },
              { icon: <FaRobot />, name: "AI Applications" },
              { icon: <FaMobileAlt />, name: "Mobile Apps" }
            ].map((service, index) => (
              <Col key={index} xs={6} md={3}>
                <motion.div 
                  className="other-service-item"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="other-service-icon">{service.icon}</div>
                  <div className="other-service-name">{service.name}</div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Closing CTA Banner */}
      <section className="container mb-5">
        <motion.div 
          className="closing-cta-banner"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="closing-cta-content">
            <h2 className="closing-title">Not sure which one you need? <br /><span className="accent-text">Let's talk.</span></h2>
            <Button 
              as={Link} 
              to="/contact?message=I'm interested in your services and would like to discuss a project." 
              className="cta-button"
            >
              Get in Touch →
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ServicesPage;
