import { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  InputGroup,
  Spinner,
  Card,
  Badge,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import apiClient from "../../services/api";

const MarketplaceManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ total_revenue: 0, apps_sold: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [productsRes, categoriesRes, statsRes] = await Promise.all([
      apiClient.get("/api/marketplace/admin/products"),
      apiClient.get("/api/marketplace/admin/categories"),
      apiClient.get("/api/marketplace/admin/stats"),
    ]);
    setProducts(productsRes.data);
    setCategories(categoriesRes.data);
    setStats(statsRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.is_sold = formData.get("is_sold") === "on";

    const apiCall = currentProduct
      ? apiClient.put(
          `/api/marketplace/admin/products/${currentProduct.id}`,
          data
        )
      : apiClient.post("/api/marketplace/admin/products", data);

    await apiCall;
    fetchData();
    setShowModal(false);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      await apiClient.delete(`/api/marketplace/admin/products/${id}`);
      fetchData();
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const slug = newCategoryName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
    await apiClient.post("/api/marketplace/admin/categories", {
      name: newCategoryName,
      slug,
    });
    setNewCategoryName("");
    fetchData();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h3>Marketplace Overview</h3>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <Card body className="text-center">
            <h4>Apps Sold</h4>
            <p className="display-4 fw-bold">{stats.apps_sold}</p>
          </Card>
        </Col>
        <Col md={6}>
          <Card body className="text-center">
            <h4>Total Revenue</h4>
            <p className="display-4 fw-bold">
              ${stats.total_revenue.toFixed(2)}
            </p>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4 mt-5 align-items-center">
        <Col md={8}>
          <h3>Manage Products</h3>
        </Col>
        <Col md={4} className="text-md-end">
          <Button
            onClick={() => {
              setCurrentProduct(null);
              setShowModal(true);
            }}
          >
            <FaPlus /> Add New Product
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.category?.name || "N/A"}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>
                {p.is_sold ? (
                  <Badge bg="danger">Sold</Badge>
                ) : (
                  <Badge bg="success">Available</Badge>
                )}
              </td>
              <td>
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => {
                    setCurrentProduct(p);
                    setShowModal(true);
                  }}
                  className="me-2"
                >
                  <FaEdit />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDeleteProduct(p.id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h3 className="mt-5">Product Categories</h3>
      <Row>
        <Col md={6}>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button onClick={handleAddCategory}>Add</Button>
          </InputGroup>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentProduct ? "Edit" : "Add"} Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveProduct}>
          <Modal.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    name="name"
                    defaultValue={currentProduct?.name}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="price"
                    defaultValue={currentProduct?.price}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Subtitle</Form.Label>
              <Form.Control
                name="subtitle"
                defaultValue={currentProduct?.subtitle}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                defaultValue={currentProduct?.description}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Features (one per line)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="features"
                defaultValue={currentProduct?.features?.join("\n")}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Main Product Image URL</Form.Label>
                  <Form.Control
                    name="image_url"
                    defaultValue={currentProduct?.image_url}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category_id"
                    defaultValue={currentProduct?.category?.id}
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Gallery Images (comma-separated URLs)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="gallery_images"
                defaultValue={currentProduct?.gallery_images?.join(",")}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Link (Gumroad, etc.)</Form.Label>
                  <Form.Control
                    name="product_url"
                    defaultValue={currentProduct?.product_url}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Live Demo Link (Optional)</Form.Label>
                  <Form.Control
                    name="demo_url"
                    defaultValue={currentProduct?.demo_url}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>
                Tags (comma-separated, e.g., Top Item, New)
              </Form.Label>
              <Form.Control
                name="tags"
                defaultValue={currentProduct?.tags?.join(",")}
              />
            </Form.Group>
            <Form.Check
              type="switch"
              name="is_sold"
              label="Mark as Sold Out"
              defaultChecked={currentProduct?.is_sold}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Product</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default MarketplaceManager;
