import { useState, useEffect, useCallback } from "react";
import { Button, Spinner, Form, ListGroup } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaArrowLeft } from "react-icons/fa";
import apiClient from "../../services/api";

const ManageReadlistPage = ({ readlistId, onBack }) => {
  const [readlist, setReadlist] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [readlistRes, postsRes] = await Promise.all([
      apiClient.get(`/api/blog/admin/readlists/${readlistId}`),
      apiClient.get("/api/blog/admin/posts"),
    ]);
    setReadlist(readlistRes.data);
    setAllPosts(postsRes.data);
    setLoading(false);
  }, [readlistId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(readlist.posts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setReadlist((prev) => ({ ...prev, posts: items }));
    await apiClient.put(`/api/blog/admin/readlists/${readlistId}`, {
      posts: items,
    });
  };

  const handleAddPost = async (post) => {
    const updatedPosts = [...readlist.posts, post];
    setReadlist((prev) => ({ ...prev, posts: updatedPosts }));
    await apiClient.put(`/api/blog/admin/readlists/${readlistId}`, {
      posts: updatedPosts,
    });
  };

  const handleRemovePost = async (postId) => {
    const updatedPosts = readlist.posts.filter((p) => p.id !== postId);
    setReadlist((prev) => ({ ...prev, posts: updatedPosts }));
    await apiClient.put(`/api/blog/admin/readlists/${readlistId}`, {
      posts: updatedPosts,
    });
  };

  const availablePosts = allPosts.filter(
    (p) =>
      !readlist.posts.some((rp) => rp.id === p.id) &&
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div>
      <Button variant="outline-secondary" onClick={onBack} className="mb-4">
        <FaArrowLeft /> Back to Blog Manager
      </Button>
      <h2>Managing: {readlist.name}</h2>
      <p className="text-secondary">
        Drag and drop posts in the readlist to reorder them.
      </p>
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Posts in this Readlist</h4>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="readlist-posts">
              {(provided) => (
                <ListGroup {...provided.droppableProps} ref={provided.innerRef}>
                  {readlist.posts.map((post, index) => (
                    <Draggable
                      key={post.id}
                      draggableId={String(post.id)}
                      index={index}
                    >
                      {(provided) => (
                        <ListGroup.Item
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="d-flex justify-content-between align-items-center"
                        >
                          {post.title}
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemovePost(post.id)}
                          >
                            Remove
                          </Button>
                        </ListGroup.Item>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ListGroup>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <div className="col-md-6">
          <h4>Available Posts</h4>
          <Form.Control
            type="search"
            placeholder="Search posts to add..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />
          <ListGroup style={{ maxHeight: "400px", overflowY: "auto" }}>
            {availablePosts.map((post) => (
              <ListGroup.Item
                key={post.id}
                className="d-flex justify-content-between align-items-center"
              >
                {post.title}
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => handleAddPost(post)}
                >
                  Add
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    </div>
  );
};

export default ManageReadlistPage;
