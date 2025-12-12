import { useState, useEffect, useCallback } from "react";
import { Table, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import apiClient from "../../services/api";
import PostEditor from "./PostEditor";
import ReadlistManager from "./ReadlistManager";
import CategoryManager from "./CategoryManager";

const MainBlogDashboard = ({ onManageReadlist }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/api/blog/admin/posts");
      setPosts(response.data);
    } catch (err) {
      setError("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!editingPostId && !isCreating) {
      fetchPosts();
    }
  }, [fetchPosts, editingPostId, isCreating]);

  const handleSave = () => {
    setEditingPostId(null);
    setIsCreating(false);
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure? This action is irreversible.")) {
      try {
        await apiClient.delete(`/api/blog/admin/posts/${postId}`);
        fetchPosts();
      } catch (err) {
        setError("Failed to delete post.");
      }
    }
  };

  if (isCreating) {
    return <PostEditor onSave={handleSave} />;
  }
  if (editingPostId) {
    return <PostEditor postId={editingPostId} onSave={handleSave} />;
  }
  if (loading) return <Spinner animation="border" />;

  return (
    <>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Manage Posts</h3>
            <Button onClick={() => setIsCreating(true)}>Write New Post</Button>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Views</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{post.category?.name || "N/A"}</td>
                  <td>{post.view_count}</td>
                  <td>{new Date(post.date_posted).toLocaleDateString()}</td>
                  <td>{post.is_featured ? "Featured" : "Published"}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => setEditingPostId(post.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col lg={7}>
          <ReadlistManager onManage={onManageReadlist} />
        </Col>
        <Col lg={5}>
          <CategoryManager />
        </Col>
      </Row>
    </>
  );
};

export default MainBlogDashboard;
