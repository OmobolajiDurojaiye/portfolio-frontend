import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Spinner } from "react-bootstrap";
import ProjectItem from "../../components/ProjectItem"; // Changed back to ProjectItem

function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/portfolio/projects`
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <Container>
      <div className="text-center mb-5">
        <h2 className="section-title">My Portfolio</h2>
        <p className="section-subtitle">
          A selection of projects where I've turned complex problems into
          elegant digital solutions.
        </p>
      </div>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : projects.length > 0 ? (
        projects.map((project, index) => (
          <ProjectItem key={project.id} project={project} index={index} />
        ))
      ) : (
        <p className="text-center text-secondary">
          No projects available at the moment. Please check back later.
        </p>
      )}
    </Container>
  );
}

export default PortfolioPage;
