import { useState, useEffect, useCallback } from "react";
import { Button, Spinner, Alert, Row, Col, Card, Badge, ToggleButton } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaEye, FaCalendarAlt, FaStar, FaNewspaper } from "react-icons/fa";
import apiClient from "../../services/api";
import PostEditor from "./PostEditor";
import ReadlistManager from "./ReadlistManager";
import CategoryManager from "./CategoryManager";
import "../../pages/Admin/Admin.css";

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
  if (loading) return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="light" />
      </div>
  );

  return (
    <div className="main-blog-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-white fw-bold m-0">Blog Management</h3>
        <Button onClick={() => setIsCreating(true)} className="theme-button">
           <FaPlus className="me-2" /> Write New Post
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Quick Stats Row could go here if we had backend support for aggregated stats */}
      <Row className="mb-4">
          <Col md={3}>
              <Card className="border-0 shadow-sm bg-dark text-white text-center py-3">
                  <h6 className="text-secondary text-uppercase small ls-1">Total Posts</h6>
                  <h2 className="fw-bold m-0">{posts.length}</h2>
              </Card>
          </Col>
           <Col md={3}>
              <Card className="border-0 shadow-sm bg-dark text-white text-center py-3">
                  <h6 className="text-secondary text-uppercase small ls-1">Total Views</h6>
                  <h2 className="fw-bold m-0">{posts.reduce((acc, curr) => acc + (curr.view_count || 0), 0)}</h2>
              </Card>
          </Col>
      </Row>

      <div className="mb-5">
         <h5 className="text-secondary text-uppercase small fw-bold mb-3">All Articles</h5>
         {posts.length > 0 ? (
             <div className="d-flex flex-column gap-3">
                 {posts.map((post) => (
                    <Card key={post.id} className="border-0 shadow-sm" style={{ backgroundColor: "var(--background-elevated)" }}>
                        <Card.Body className="d-flex flex-column flex-md-row align-items-md-center gap-3 p-3">
                            {/* Thumbnail */}
                             <div 
                                style={{ 
                                    width: "80px", 
                                    height: "60px", 
                                    borderRadius: "8px", 
                                    overflow: "hidden", 
                                    flexShrink: 0,
                                    backgroundColor: "rgba(255,255,255,0.05)"
                                }}
                             >
                                 {post.image_url ? (
                                     <img src={post.image_url} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                 ) : (
                                     <div className="d-flex align-items-center justify-content-center h-100 text-secondary">
                                        <FaNewspaper />
                                     </div>
                                 )}
                             </div>

                             {/* Content Info */}
                             <div className="flex-grow-1">
                                 <div className="d-flex align-items-center gap-2 mb-1">
                                     {post.is_featured && <Badge bg="warning" text="dark" className="d-flex align-items-center gap-1"><FaStar size={10}/> Featured</Badge>}
                                     <Badge bg="secondary" className="fw-normal">{post.category?.name || "Uncategorized"}</Badge>
                                 </div>
                                 <h5 className="text-white fw-bold m-0 mb-1">{post.title}</h5>
                                 <div className="d-flex align-items-center gap-3 text-secondary small">
                                     <span className="d-flex align-items-center gap-1"><FaCalendarAlt /> {new Date(post.date_posted).toLocaleDateString()}</span>
                                     <span className="d-flex align-items-center gap-1"><FaEye /> {post.view_count || 0} views</span>
                                 </div>
                             </div>

                             {/* Actions */}
                             <div className="d-flex gap-2">
                                <Button variant="outline-info" size="sm" onClick={() => setEditingPostId(post.id)}>
                                    <FaEdit className="me-1" /> Edit
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(post.id)}>
                                    <FaTrash />
                                </Button>
                             </div>
                        </Card.Body>
                    </Card>
                 ))}
             </div>
         ) : (
             <div className="text-center py-5 rounded border border-secondary border-dashed" style={{backgroundColor: "rgba(255,255,255,0.02)"}}>
                <h5 className="text-secondary">No posts found.</h5>
                <Button variant="outline-primary" className="mt-2" onClick={() => setIsCreating(true)}>Write Your First Post</Button>
             </div>
         )}
      </div>

      <Row className="g-4">
        <Col lg={7}>
          <ReadlistManager onManage={onManageReadlist} />
        </Col>
        <Col lg={5}>
          <CategoryManager />
        </Col>
      </Row>
    </div>
  );
};

export default MainBlogDashboard;
