import { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Form,
  Modal,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import apiClient from "../../services/api";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#a162f7",
  });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const res = await apiClient.get("/api/blog/admin/categories");
    setCategories(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSlugify = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const handleSave = async (e) => {
    e.preventDefault();
    const data = { ...newCategory, slug: handleSlugify(newCategory.name) };
    await apiClient.post("/api/blog/admin/categories", data);
    setNewCategory({ name: "", color: "#a162f7" });
    fetchCategories();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      await apiClient.delete(`/api/blog/admin/categories/${id}`);
      fetchCategories();
    }
  };

  return (
    <div>
      <h3>Manage Categories</h3>
      <Form onSubmit={handleSave} className="mb-3">
        <InputGroup>
          <Form.Control
            placeholder="New Category Name"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            required
          />
          <Form.Control
            type="color"
            title="Choose category color"
            value={newCategory.color}
            onChange={(e) =>
              setNewCategory({ ...newCategory, color: e.target.value })
            }
          />
          <Button type="submit">Add Category</Button>
        </InputGroup>
      </Form>

      {loading ? (
        <Spinner />
      ) : (
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Color</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: cat.color,
                      borderRadius: "4px",
                    }}
                  ></div>
                </td>
                <td>{cat.name}</td>
                <td>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default CategoryManager;
