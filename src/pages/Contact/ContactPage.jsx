import { Helmet } from "react-helmet-async";
import BookingComponent from "../../components/Contact/BookingComponent";
import "./Contact.css";

function ContactPage() {
  return (
    <div className="contact-page-container">
      <Helmet>
        <title>Book a Session | Omobolaji Durojaiye</title>
        <meta
          name="description"
          content="Schedule a discovery call or software engineering session with Omobolaji Durojaiye."
        />
      </Helmet>

      <div className="contact-page-header">
        <span className="mono-label">SCHEDULE A CALL</span>
        <h1 className="section-title">Book a Session</h1>
        <p className="section-subtitle">
          Have a project idea, technical challenge, or collaboration in mind? Pick a date and time
          that works for you.
        </p>
      </div>

      <div className="contact-centered-box">
        <div className="contact-content-pane">
          <BookingComponent />
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
