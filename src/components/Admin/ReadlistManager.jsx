import { useState, useEffect, useCallback } from "react";
import { Table, Button, Form, Modal, Spinner } from "react-bootstrap";
import apiClient from "../../services/api";

const ReadlistManager = ({ onManage }) => {
  const [readlists, setReadlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentReadlist, setCurrentReadlist] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const fetchReadlists = useCallback(async () => {
    setLoading(true);
    const res = await apiClient.get("/api/blog/admin/readlists");
    setReadlists(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReadlists();
  }, [fetchReadlists]);
  useEffect(() => {
    setImageUrl(currentReadlist?.image_url || "");
  }, [currentReadlist]);

  const handleSlugify = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post("/api/blog/upload-image", formData);
    setImageUrl(res.data.url);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    data.slug = handleSlugify(data.name);
    data.image_url = imageUrl;

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
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Name</th>
              <th>Posts</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {readlists.map((rl) => (
              <tr key={rl.id}>
                <td>{rl.name}</td>
                <td>{rl.posts?.length || 0}</td>
                <td>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => onManage(rl.id)}
                    className="me-2"
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
                    className="me-2"
                  >
                    Edit Details
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(rl.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
              <Form.Label>Cover Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="preview"
                  className="img-fluid rounded mt-2"
                />
              )}
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
