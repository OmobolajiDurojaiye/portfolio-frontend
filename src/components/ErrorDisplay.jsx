import { Button, Container } from "react-bootstrap";
import "./ErrorDisplay.css";

const ErrorDisplay = ({ onRetry }) => {
  return (
    <Container className="error-display-container text-center">
      <div className="error-content">
        <h3 className="error-title">Oops! A Connection Hiccup.</h3>
        <p className="text-secondary">
          It seems we're having trouble reaching the server right now. <br />A
          quick refresh usually does the trick.
        </p>
        <Button onClick={onRetry} className="cta-button mt-3">
          Try Again
        </Button>
      </div>
    </Container>
  );
};

export default ErrorDisplay;
