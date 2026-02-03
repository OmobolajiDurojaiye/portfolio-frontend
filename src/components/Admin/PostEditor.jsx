import { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert, Row, Col, Card, Image, Accordion } from "react-bootstrap";
import { FaSave, FaArrowLeft, FaCog, FaImage, FaTag } from "react-icons/fa";
import TiptapEditor from "./TiptapEditor";
import apiClient from "../../services/api";

const PostEditor = ({ postId, onSave }) => {
  const [post, setPost] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    is_featured: false,
    readlist_ids: [],
    category_id: "",
  });
  const [readlists, setReadlists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [readlistsRes, categoriesRes] = await Promise.all([
          apiClient.get("/api/blog/admin/readlists"),
          apiClient.get("/api/blog/admin/categories"),
        ]);
        setReadlists(readlistsRes.data);
        setCategories(categoriesRes.data);

        if (postId) {
          const postRes = await apiClient.get(
            `/api/blog/admin/posts/${postId}`
          );
          setPost({
            ...postRes.data,
            readlist_ids: postRes.data.readlists || [],
            category_id: postRes.data.category?.id || "",
          });
        }
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  const handleSlugify = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPost((prevPost) => {
      let newPost = {
        ...prevPost,
        [name]: type === "checkbox" ? checked : value,
      };
      if (name === "title" && !postId) { // Only auto-slugify on creation
        newPost.slug = handleSlugify(value);
      }
      return newPost;
    });
  };

  const handleContentChange = (content) => {
    setPost((prev) => ({ ...prev, content }));
  };

  const handleReadlistChange = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value)
    );
    setPost((prev) => ({ ...prev, readlist_ids: selectedIds }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    if (!post.category_id) {
      setError("Please select a category.");
      setSaving(false);
      return;
    }
    const apiCall = postId
      ? apiClient.put(`/api/blog/admin/posts/${postId}`, post)
      : apiClient.post("/api/blog/admin/posts", post);

    try {
      await apiCall;
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="light" />
      </div>
  );

  return (
    <Form onSubmit={handleSubmit} className="post-editor h-100">
      {/* Header Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary">
        <div className="d-flex align-items-center gap-3">
            <Button variant="link" onClick={onSave} className="text-secondary p-0 fs-5 text-decoration-none">
                <FaArrowLeft />
            </Button>
            <h4 className="m-0 fw-bold text-white">{postId ? "Edit Post" : "New Article"}</h4>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={onSave}>
            Discard
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? <Spinner size="sm" /> : <><FaSave className="me-2"/> {postId ? "Update" : "Publish"}</>}
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="h-100">
        {/* Main Content Area */}
        <Col lg={9} className="h-100 d-flex flex-column">
          <Form.Group className="mb-4">
            <Form.Control
              type="text"
              name="title"
              placeholder="Post Title..."
              value={post.title}
              onChange={handleChange}
              required
              className="fs-1 fw-bold bg-transparent border-0 text-white shadow-none px-0"
              style={{ caretColor: "var(--primary-color)" }}
            />
          </Form.Group>
          <div className="flex-grow-1 bg-dark rounded p-1 border border-secondary" style={{ minHeight: "500px" }}>
            <TiptapEditor content={post.content} onChange={handleContentChange} />
          </div>
        </Col>

        {/* Sidebar Settings */}
        <Col lg={3}>
           <div className="sticky-top" style={{ top: "20px" }}>
               <h6 className="text-secondary text-uppercase small fw-bold mb-3 d-flex align-items-center gap-2">
                   <FaCog /> Post Settings
               </h6>
               
               <Accordion defaultActiveKey="0" className="admin-accordion mb-3">
                   <Accordion.Item eventKey="0" className="bg-transparent border-0 mb-2">
                       <Accordion.Header className="shadow-sm rounded">General & Status</Accordion.Header>
                       <Accordion.Body className="bg-dark rounded border border-secondary mt-1 p-3">
                           <Form.Group className="mb-3">
                               <Form.Check 
                                   type="switch"
                                   id="custom-switch"
                                   label="Featured Post"
                                   name="is_featured"
                                   checked={post.is_featured}
                                   onChange={handleChange}
                                   className="text-white"
                               />
                           </Form.Group>
                           <Form.Group className="mb-3">
                               <Form.Label className="text-secondary small">Slug (URL)</Form.Label>
                               <Form.Control
                                   type="text"
                                   name="slug"
                                   value={post.slug}
                                   onChange={handleChange}
                                   required
                                   className="bg-dark text-white border-secondary small"
                               />
                           </Form.Group>
                           <Form.Group>
                               <Form.Label className="text-secondary small">Excerpt</Form.Label>
                               <Form.Control
                                   as="textarea"
                                   rows={3}
                                   name="excerpt"
                                   value={post.excerpt || ""}
                                   onChange={handleChange}
                                   className="bg-dark text-white border-secondary small"
                               />
                           </Form.Group>
                       </Accordion.Body>
                   </Accordion.Item>

                   <Accordion.Item eventKey="1" className="bg-transparent border-0 mb-2">
                       <Accordion.Header className="shadow-sm rounded">Taxonomy</Accordion.Header>
                       <Accordion.Body className="bg-dark rounded border border-secondary mt-1 p-3">
                           <Form.Group className="mb-3">
                               <Form.Label className="text-secondary small d-flex align-items-center gap-2"><FaTag/> Category</Form.Label>
                               <Form.Select
                                   name="category_id"
                                   value={post.category_id}
                                   onChange={handleChange}
                                   required
                                   className="bg-dark text-white border-secondary"
                               >
                                   <option value="">Select Category</option>
                                   {categories.map((cat) => (
                                       <option key={cat.id} value={cat.id}>{cat.name}</option>
                                   ))}
                               </Form.Select>
                           </Form.Group>
                           <Form.Group>
                               <Form.Label className="text-secondary small">Add to Readlists</Form.Label>
                               <Form.Select
                                   multiple
                                   name="readlist_ids"
                                   value={post.readlist_ids}
                                   onChange={handleReadlistChange}
                                   className="bg-dark text-white border-secondary"
                                   style={{ minHeight: "100px" }}
                               >
                                   {readlists.map((rl) => (
                                       <option key={rl.id} value={rl.id}>{rl.name}</option>
                                   ))}
                               </Form.Select>
                               <Form.Text className="text-muted small">Hold Ctrl/Cmd to select multiple</Form.Text>
                           </Form.Group>
                       </Accordion.Body>
                   </Accordion.Item>

                   <Accordion.Item eventKey="2" className="bg-transparent border-0 mb-2">
                       <Accordion.Header className="shadow-sm rounded">Featured Media</Accordion.Header>
                       <Accordion.Body className="bg-dark rounded border border-secondary mt-1 p-3">
                           <Form.Group className="mb-3">
                               <Form.Label className="text-secondary small d-flex align-items-center gap-2"><FaImage/> Image URL</Form.Label>
                               <Form.Control
                                   type="text"
                                   name="image_url"
                                   value={post.image_url || ""}
                                   onChange={handleChange}
                                   className="bg-dark text-white border-secondary small"
                                   placeholder="https://..."
                               />
                           </Form.Group>
                           <div className="border border-secondary rounded d-flex align-items-center justify-content-center overflow-hidden" 
                                style={{ height: "120px", backgroundColor: "rgba(255,255,255,0.02)" }}>
                               {post.image_url ? (
                                   <Image src={post.image_url} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                               ) : (
                                   <span className="text-muted small">No Preview</span>
                               )}
                           </div>
                       </Accordion.Body>
                   </Accordion.Item>
               </Accordion>
           </div>
        </Col>
      </Row>
    </Form>
  );
};

export default PostEditor;
