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
} from "react-bootstrap";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import apiClient from "../../services/api";

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
      resetter({ name: "", icon_name: "" }); // Generic reset
      fetchData(); // Refresh list
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

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-5 p-4 border rounded">
        <Col>
          <h4>Main Content</h4>
          <Form.Group className="mb-3">
            <Form.Label>About Me Bio</Form.Label>
            <Form.Text className="d-block mb-2 text-muted">
              You can use Markdown for formatting (e.g., `# Heading`, `*bold*`,
              `- list item`).
            </Form.Text>
            <Form.Control
              as="textarea"
              rows={8}
              value={data.bio}
              onChange={(e) => setData({ ...data, bio: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Spotify Profile URL</Form.Label>
            <Form.Control
              type="text"
              value={data.spotify_url || ""}
              onChange={(e) =>
                setData({ ...data, spotify_url: e.target.value })
              }
            />
          </Form.Group>
          <Button onClick={handleMainSave} disabled={saving}>
            {saving ? <Spinner size="sm" /> : "Save Main Content"}
          </Button>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={6} className="p-4 border rounded">
          <h4>Toolkit / Skills</h4>
          <ListGroup className="mb-3">
            {data.skills.map((skill) => (
              <ListGroup.Item
                key={skill.id}
                className="d-flex justify-content-between align-items-center"
              >
                {skill.name} ({skill.icon_name})
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteItem("skills", skill.id)}
                >
                  <FaTrash />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <InputGroup>
            <Form.Control
              placeholder="Skill Name (e.g., React)"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
            />
            <Form.Control
              placeholder="Icon Name (e.g., FaReact)"
              value={newSkill.icon_name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, icon_name: e.target.value })
              }
            />
            <Button
              onClick={() => handleAddItem("skills", newSkill, setNewSkill)}
            >
              <FaPlus />
            </Button>
          </InputGroup>
        </Col>
        <Col md={6} className="p-4 border rounded">
          <h4>Work Tools</h4>
          <ListGroup className="mb-3">
            {data.tools.map((tool) => (
              <ListGroup.Item
                key={tool.id}
                className="d-flex justify-content-between align-items-center"
              >
                {tool.name} ({tool.icon_name})
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteItem("tools", tool.id)}
                >
                  <FaTrash />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <InputGroup>
            <Form.Control
              placeholder="Tool Name (e.g., VS Code)"
              value={newTool.name}
              onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
            />
            <Form.Control
              placeholder="Icon Name (e.g., SiVisualstudiocode)"
              value={newTool.icon_name}
              onChange={(e) =>
                setNewTool({ ...newTool, icon_name: e.target.value })
              }
            />
            <Button onClick={() => handleAddItem("tools", newTool, setNewTool)}>
              <FaPlus />
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Row className="mb-5 p-4 border rounded">
        <h4>Work Journey</h4>
        <Accordion className="mb-3">
          {data.work_experiences.map((exp) => (
            <Accordion.Item eventKey={exp.id} key={exp.id}>
              <Accordion.Header>
                {exp.role} @ {exp.company}
              </Accordion.Header>
              <Accordion.Body>
                <p>
                  <strong>Duration:</strong> {exp.duration}
                </p>
                <p>
                  <strong>Description:</strong> {exp.description || "N/A"}
                </p>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="float-end"
                  onClick={() => handleDeleteItem("work-experiences", exp.id)}
                >
                  <FaTrash /> Delete
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
        <Form.Group className="mb-2">
          <Form.Label>Add New Experience</Form.Label>
          <InputGroup>
            <Form.Control
              placeholder="Role"
              value={newExperience.role}
              onChange={(e) =>
                setNewExperience({ ...newExperience, role: e.target.value })
              }
            />
            <Form.Control
              placeholder="Company"
              value={newExperience.company}
              onChange={(e) =>
                setNewExperience({ ...newExperience, company: e.target.value })
              }
            />
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control
            placeholder="Duration (e.g., Jan 2023 - Present)"
            value={newExperience.duration}
            onChange={(e) =>
              setNewExperience({ ...newExperience, duration: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Description (Optional, supports Markdown)"
            value={newExperience.description}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                description: e.target.value,
              })
            }
          />
        </Form.Group>
        <Button
          onClick={() =>
            handleAddItem("work-experiences", newExperience, () =>
              setNewExperience({
                role: "",
                company: "",
                duration: "",
                description: "",
              })
            )
          }
        >
          <FaPlus /> Add Experience
        </Button>
      </Row>
    </div>
  );
};

export default AboutManager;
