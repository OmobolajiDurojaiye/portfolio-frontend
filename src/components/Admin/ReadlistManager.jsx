import { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Form,
  Modal,
  Spinner,
  Accordion,
  ListGroup,
} from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import apiClient from "../../services/api";

const ReadlistManager = ({ onManage }) => {
  const [readlists, setReadlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentReadlist, setCurrentReadlist] = useState(null);

  const fetchReadlists = useCallback(async () => {
    setLoading(true);
    const res = await apiClient.get("/api/blog/admin/readlists");
    setReadlists(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReadlists();
  }, [fetchReadlists]);

  const handleSlugify = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const handleSave = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    data.slug = handleSlugify(data.name);

    const apiCall = currentReadlist
      ? apiClient.put(`/api/blog/admin/readlists/${currentReadlist.id}`, data)
      : apiClient.post("/api/blog/admin/readlists", data);
    await apiCall;
    fetchReadlists();
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this readlist?")) {
      await apiClient.delete(`/api/blog/admin/readlists/${id}`);
      fetchReadlists();
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Manage Readlists</h3>
        <Button
          onClick={() => {
            setCurrentReadlist(null);
            setShowModal(true);
          }}
        >
          New Readlist
        </Button>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <Accordion>
          {readlists.map((rl) => (
            <Accordion.Item eventKey={rl.id} key={rl.id}>
              <Accordion.Header>{rl.name}</Accordion.Header>
              <Accordion.Body>
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => onManage(rl.id)}
                  className="me-2 mb-3"
                >
                  Manage Posts
                </Button>
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => {
                    setCurrentReadlist(rl);
                    setShowModal(true);
                  }}
                  className="me-2 mb-3"
                >
                  Edit Details
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(rl.id)}
                  className="mb-3"
                >
                  Delete Readlist
                </Button>
                <ListGroup>
                  {rl.posts.map((post, index) => (
                    <ListGroup.Item key={post.id}>
                      {index + 1}. {post.title}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentReadlist ? "Edit" : "New"} Readlist</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                defaultValue={currentReadlist?.name}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                defaultValue={currentReadlist?.description}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Cover Image URL</Form.Label>
              <Form.Control
                name="image_url"
                defaultValue={currentReadlist?.image_url}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ReadlistManager;
