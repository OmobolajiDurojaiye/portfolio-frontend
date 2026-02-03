import { useState, useEffect, useCallback } from "react";
import {
  Form,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  ListGroup,
  InputGroup,
  Accordion,
  Card,
  Badge,
} from "react-bootstrap";
import { FaTrash, FaPlus, FaSave, FaBriefcase, FaTools } from "react-icons/fa";
import apiClient from "../../services/api";
import "../../pages/Admin/Admin.css"; // Ensure styles are applied

const AboutManager = () => {
  const [data, setData] = useState({
    bio: "",
    spotify_url: "",
    skills: [],
    tools: [],
    work_experiences: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [newSkill, setNewSkill] = useState({ name: "", icon_name: "" });
  const [newTool, setNewTool] = useState({ name: "", icon_name: "" });
  const [newExperience, setNewExperience] = useState({
    role: "",
    company: "",
    duration: "",
    description: "",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/about/");
      setData(response.data);
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMainSave = async () => {
    setSaving(true);
    try {
      await apiClient.post("/api/about/", {
        bio: data.bio,
        spotify_url: data.spotify_url,
      });
      fetchData();
    } catch (err) {
      setError("Failed to save main content.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = async (endpoint, newItem, resetter) => {
    try {
      await apiClient.post(`/api/about/${endpoint}`, newItem);
      resetter(
        endpoint === "work-experiences"
          ? { role: "", company: "", duration: "", description: "" }
          : { name: "", icon_name: "" }
      );
      fetchData();
    } catch (err) {
      setError(`Failed to add new item to ${endpoint}.`);
    }
  };

  const handleDeleteItem = async (endpoint, id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await apiClient.delete(`/api/about/${endpoint}/${id}`);
        fetchData();
      } catch (err) {
        setError(`Failed to delete item from ${endpoint}.`);
      }
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="light" />
      </div>
    );

  return (
    <div className="about-manager">
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="gy-4">
        {/* Main Content Column */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: "var(--background-elevated)" }}>
            <Card.Body className="p-4">
              <h5 className="mb-4 text-white fw-bold">Main Content</h5>
              <Form.Group className="mb-4">
                <Form.Label className="text-secondary small fw-bold text-uppercase">About Bio (Markdown)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={10}
                  value={data.bio}
                  onChange={(e) => setData({ ...data, bio: e.target.value })}
                  style={{ backgroundColor: "rgba(255,255,255,0.03)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label className="text-secondary small fw-bold text-uppercase">Spotify Profile URL</Form.Label>
                <Form.Control
                  type="text"
                  value={data.spotify_url || ""}
                  onChange={(e) => setData({ ...data, spotify_url: e.target.value })}
                  style={{ backgroundColor: "rgba(255,255,255,0.03)", color: "var(--text-primary)", border: "1px solid var(--border-color)" }}
                />
              </Form.Group>
              <div className="text-end">
                <Button onClick={handleMainSave} disabled={saving} className="theme-button px-4">
                  {saving ? <Spinner size="sm" /> : <><FaSave className="me-2"/> Save Changes</>}
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm" style={{ backgroundColor: "var(--background-elevated)" }}>
            <Card.Body className="p-4">
              <h5 className="mb-4 text-white fw-bold"><FaBriefcase className="me-2 text-primary"/> Work Journey</h5>
              
              <div className="mb-4">
                {data.work_experiences.length === 0 && <p className="text-muted fst-italic">No experience added yet.</p>}
                {data.work_experiences.map((exp) => (
                    <div key={exp.id} className="p-3 mb-3 rounded border border-dark" style={{backgroundColor: "rgba(255,255,255,0.02)"}}>
                        <div className="d-flex justify-content-between align-items-start">
                             <div>
                                <h6 className="fw-bold text-white mb-1">{exp.role} <span className="text-secondary">@</span> {exp.company}</h6>
                                <Badge bg="secondary" className="mb-2">{exp.duration}</Badge>
                                <p className="small text-secondary mb-0">{exp.description}</p>
                             </div>
                             <Button variant="outline-danger" size="sm" onClick={() => handleDeleteItem("work-experiences", exp.id)}>
                                <FaTrash />
                             </Button>
                        </div>
                    </div>
                ))}
              </div>

               <hr className="border-secondary my-4"/>

              <h6 className="text-white mb-3">Add New Experience</h6>
              <Row className="g-2 mb-2">
                <Col md={6}>
                    <Form.Label className="text-secondary small">Role</Form.Label>
                    <Form.Control
                        placeholder="e.g. Senior Dev"
                        value={newExperience.role}
                        onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                        className="bg-dark text-white border-secondary"
                    />
                </Col>
                <Col md={6}>
                    <Form.Label className="text-secondary small">Company</Form.Label>
                    <Form.Control
                        placeholder="e.g. Google"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                         className="bg-dark text-white border-secondary"
                    />
                </Col>
                <Col md={12}>
                     <Form.Label className="text-secondary small">Duration</Form.Label>
                     <Form.Control
                         placeholder="e.g. Jan 2023 - Present"
                         value={newExperience.duration}
                         onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                          className="bg-dark text-white border-secondary"
                     />
                </Col>
                 <Col md={12}>
                     <Form.Label className="text-secondary small">Description</Form.Label>
                     <Form.Control
                         as="textarea"
                         rows={2}
                         placeholder="Optional description..."
                         value={newExperience.description}
                         onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                          className="bg-dark text-white border-secondary"
                     />
                </Col>
              </Row>
              <Button 
                variant="outline-primary" 
                className="w-100 mt-2"
                onClick={() => handleAddItem("work-experiences", newExperience, setNewExperience)}
              >
                  <FaPlus className="me-2"/> Add Experience
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar Column for Lists */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: "var(--background-elevated)" }}>
            <Card.Body className="p-4">
               <h5 className="mb-3 text-white fw-bold"><FaTools className="me-2 text-success"/> Skills & Tools</h5>
               
               <h6 className="text-secondary text-uppercase small fw-bold mt-4 mb-3">Skills Stack</h6>
               <ul className="list-unstyled mb-3">
                   {data.skills.map((skill) => (
                       <li key={skill.id} className="d-flex justify-content-between align-items-center mb-2 p-2 rounded hover-bg-dark">
                           <span className="text-light">{skill.name} <small className="text-muted">({skill.icon_name})</small></span>
                            <Button variant="link" className="text-danger p-0" onClick={() => handleDeleteItem("skills", skill.id)}>
                                <FaTrash />
                            </Button>
                       </li>
                   ))}
               </ul>
               <div className="mb-2">
                  <Form.Label className="text-secondary small">Skill Name</Form.Label>
                  <Form.Control 
                        placeholder="e.g. React" 
                        value={newSkill.name} 
                        onChange={(e)=>setNewSkill({...newSkill, name: e.target.value})}
                         className="bg-dark text-white border-secondary mb-2"
                  />
                  <Form.Label className="text-secondary small">Icon (React Icons)</Form.Label>
                  <InputGroup>
                    <Form.Control 
                            placeholder="e.g. FaReact" 
                            value={newSkill.icon_name} 
                            onChange={(e)=>setNewSkill({...newSkill, icon_name: e.target.value})}
                            className="bg-dark text-white border-secondary"
                    />
                    <Button variant="success" onClick={() => handleAddItem("skills", newSkill, setNewSkill)}><FaPlus/></Button>
                  </InputGroup>
               </div>

               <hr className="border-secondary my-4"/>

               <h6 className="text-secondary text-uppercase small fw-bold mb-3">Dev Tools</h6>
                <ul className="list-unstyled mb-3">
                   {data.tools.map((tool) => (
                       <li key={tool.id} className="d-flex justify-content-between align-items-center mb-2 p-2 rounded hover-bg-dark">
                           <span className="text-light">{tool.name} <small className="text-muted">({tool.icon_name})</small></span>
                            <Button variant="link" className="text-danger p-0" onClick={() => handleDeleteItem("tools", tool.id)}>
                                <FaTrash />
                            </Button>
                       </li>
                   ))}
               </ul>
                <div className="mb-2">
                  <Form.Label className="text-secondary small">Tool Name</Form.Label>
                  <Form.Control 
                        placeholder="e.g. VS Code" 
                        value={newTool.name} 
                        onChange={(e)=>setNewTool({...newTool, name: e.target.value})}
                         className="bg-dark text-white border-secondary mb-2"
                  />
                  <Form.Label className="text-secondary small">Icon (React Icons)</Form.Label>
                  <InputGroup>
                      <Form.Control 
                            placeholder="e.g. SiVisualstudiocode" 
                            value={newTool.icon_name} 
                            onChange={(e)=>setNewTool({...newTool, icon_name: e.target.value})}
                            className="bg-dark text-white border-secondary"
                      />
                   <Button variant="success" onClick={() => handleAddItem("tools", newTool, setNewTool)}><FaPlus/></Button>
                  </InputGroup>
               </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AboutManager;
