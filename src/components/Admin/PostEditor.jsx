import { useState, useEffect, useMemo } from "react";
import {
  Form,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  ProgressBar,
} from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const readlistsRes = await apiClient.get("/api/blog/admin/readlists");
        const categoriesRes = await apiClient.get("/api/blog/admin/categories");
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

  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await handleImageUpload(file, setUploadProgress);
    if (url) {
      setPost((prev) => ({ ...prev, image_url: url }));
    }
    setTimeout(() => setUploadProgress(0), 1000);
  };

  const handleImageUpload = async (file, progressCallback) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      progressCallback?.(0);
      const res = await apiClient.post("/api/blog/upload-image", formData, {
        onUploadProgress: (e) =>
          progressCallback?.(Math.round((e.loaded * 100) / e.total)),
      });
      return res.data.url;
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Please try again.");
      return null;
    }
  };

  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: function () {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();
            input.onchange = async () => {
              const file = input.files[0];
              if (file) {
                const url = await handleImageUpload(file);
                if (url) {
                  const range = this.quill.getSelection(true);
                  this.quill.insertEmbed(range.index, "image", url);
                }
              }
            };
          },
        },
      },
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
            <ReactQuill
              theme="snow"
              value={post.content}
              onChange={handleContentChange}
              modules={quillModules}
              style={{ height: "400px" }}
            />
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
              <Form.Label>Featured Image</Form.Label>
              <Form.Control
                type="file"
                name="image_url"
                onChange={handleFeaturedImageUpload}
                accept="image/*"
              />
              {uploadProgress > 0 && (
                <ProgressBar
                  now={uploadProgress}
                  label={`${uploadProgress}%`}
                  className="mt-2"
                />
              )}
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Featured"
                  className="img-fluid rounded mt-2"
                />
              )}
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
