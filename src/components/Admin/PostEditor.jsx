import { useState, useEffect, useMemo } from "react";
import { Form, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
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
      if (name === "title") {
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

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"],
        ["clean"],
      ],
    }),
    []
  );

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

  if (loading) return <Spinner animation="border" />;

  return (
    <Form onSubmit={handleSubmit}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{postId ? "Edit Post" : "Create New Post"}</h2>
        <div>
          <Button variant="outline-secondary" onClick={onSave} className="me-2">
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <Spinner size="sm" />
            ) : postId ? (
              "Update Post"
            ) : (
              "Publish Post"
            )}
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="title"
              placeholder="Post Title"
              value={post.title}
              onChange={handleChange}
              required
              className="fs-4"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <div className="mb-3 editor-wrapper">
              <Form.Label>Content</Form.Label>
              <TiptapEditor content={post.content} onChange={handleContentChange} />
            </div>
          </Form.Group>
        </Col>
        <Col md={4} className="mt-md-0 mt-5 pt-md-0 pt-3">
          <div className="post-sidebar">
            <Form.Group className="mb-3">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                type="text"
                name="slug"
                value={post.slug}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Featured Image URL</Form.Label>
              <Form.Control
                name="image_url"
                value={post.image_url || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Excerpt</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="excerpt"
                value={post.excerpt || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category_id"
                value={post.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Readlists</Form.Label>
              <Form.Select
                multiple
                name="readlist_ids"
                value={post.readlist_ids}
                onChange={handleReadlistChange}
              >
                {readlists.map((rl) => (
                  <option key={rl.id} value={rl.id}>
                    {rl.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                name="is_featured"
                label="Feature this post?"
                checked={post.is_featured}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default PostEditor;
