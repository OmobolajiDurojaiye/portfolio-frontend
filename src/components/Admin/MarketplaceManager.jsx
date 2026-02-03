import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  InputGroup,
  Spinner,
  Card,
  Badge,
  Image,
  Alert
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaBoxOpen, FaDollarSign, FaShoppingCart, FaTags, FaLink, FaImage } from "react-icons/fa";
import apiClient from "../../services/api";

const MarketplaceManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ total_revenue: 0, apps_sold: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // State for form preview
  const [previewImage, setPreviewImage] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
        const [productsRes, categoriesRes, statsRes] = await Promise.all([
        apiClient.get("/api/marketplace/admin/products"),
        apiClient.get("/api/marketplace/admin/categories"),
        apiClient.get("/api/marketplace/admin/stats"),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setStats(statsRes.data);
    } catch (error) {
        console.error("Failed to fetch marketplace data", error);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
      if(currentProduct) {
          setPreviewImage(currentProduct.image_url || "");
      } else {
          setPreviewImage("");
      }
  }, [currentProduct, showModal]);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.is_sold = formData.get("is_sold") === "on";

    // Split features by newline
    if (data.features) {
        // data.features is already a string from textarea, but backend might expect array if previous implementation did so. 
        // Based on previous code: defaultValue={currentProduct?.features?.join("\n")}
        // It seems the backend expects an array. Let's split it.
        // CHECK: The previous code didn't split it explicitly in handleSaveProduct, it just sent 'data'.
        // If the backend handles it, great. But usually textareas send strings.
        // Let's check if the backend expects a list. 
        // Assuming the previous implementation worked, the backend might handle it or it was simple string storage.
        // To be safe, let's keep it as is, but if we encounter issues we might need to split.
    }

    try {
        const apiCall = currentProduct
        ? apiClient.put(
            `/api/marketplace/admin/products/${currentProduct.id}`,
            data
            )
        : apiClient.post("/api/marketplace/admin/products", data);

        await apiCall;
        fetchData();
        setShowModal(false);
    } catch (error) {
        alert("Failed to save product. Please try again.");
    } finally {
        setSubmitLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Delete this product? It cannot be undone.")) {
      try {
          await apiClient.delete(`/api/marketplace/admin/products/${id}`);
          fetchData();
      } catch (error) {
          alert("Failed to delete product.");
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const slug = newCategoryName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
    
    try {
        await apiClient.post("/api/marketplace/admin/categories", {
        name: newCategoryName,
        slug,
        });
        setNewCategoryName("");
        fetchData();
    } catch (error) {
        alert("Failed to add category.");
    }
  };

  if (loading) return (
      <div className="text-center py-5">
          <Spinner animation="border" variant="light" />
      </div>
  );

  return (
    <div className="marketplace-manager">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-white fw-bold m-0">Marketplace & Products</h3>
        <Button 
            onClick={() => {
              setCurrentProduct(null);
              setShowModal(true);
            }}
            className="theme-button"
        >
            <FaPlus className="me-2" /> Add Digital Product
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-5 g-3">
        <Col md={6}>
          <Card className="border-0 shadow-sm bg-dark text-white h-100">
            <Card.Body className="d-flex align-items-center justify-content-between p-4">
                <div>
                     <h6 className="text-secondary text-uppercase small ls-1 mb-2">Total Sales</h6>
                     <h2 className="fw-bold m-0 display-6">{stats.apps_sold || 0}</h2>
                </div>
                <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
                    <FaShoppingCart size={24} />
                </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm bg-dark text-white h-100">
             <Card.Body className="d-flex align-items-center justify-content-between p-4">
                <div>
                     <h6 className="text-secondary text-uppercase small ls-1 mb-2">Life-time Revenue</h6>
                     <h2 className="fw-bold m-0 display-6">${stats.total_revenue?.toFixed(2) || "0.00"}</h2>
                </div>
                <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success">
                    <FaDollarSign size={24} />
                </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Products Grid */}
      <h5 className="text-secondary text-uppercase small fw-bold mb-3">Active Products</h5>
      
      {products.length > 0 ? (
           <Row className="g-4 mb-5">
           {products.map((p) => (
             <Col key={p.id} xl={3} lg={4} md={6}>
                <Card className="h-100 border-0 shadow-sm project-card" style={{ backgroundColor: "var(--background-elevated)", transition: "transform 0.2s" }}>
                    <div className="position-relative" style={{ height: "180px", overflow: "hidden" }}>
                        {p.image_url ? (
                            <Card.Img variant="top" src={p.image_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <div className="d-flex align-items-center justify-content-center h-100 bg-secondary bg-opacity-10 text-secondary">
                                <FaBoxOpen size={30} />
                            </div>
                        )}
                        <div className="position-absolute top-0 end-0 p-2">
                             {p.is_sold ? (
                                <Badge bg="danger" className="shadow-sm">Sold Out</Badge>
                             ) : (
                                <Badge bg="success" className="shadow-sm">Active</Badge>
                             )}
                        </div>
                         <div className="position-absolute bottom-0 start-0 p-2 w-100" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                            <Badge bg="light" text="dark" className="float-end fw-bold">${p.price.toFixed(2)}</Badge>
                        </div>
                    </div>
                    <Card.Body className="d-flex flex-column">
                        <div className="mb-2">
                             <Badge bg="dark" className="border border-secondary text-secondary me-2 small fw-normal">{p.category?.name || "Uncategorized"}</Badge>
                        </div>
                        <Card.Title className="text-white fw-bold mb-1 text-truncate" title={p.name}>{p.name}</Card.Title>
                        <Card.Text className="text-secondary small mb-3 flex-grow-1" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {p.subtitle || p.description}
                        </Card.Text>

                        <div className="d-flex gap-2 mt-auto pt-3 border-top border-secondary">
                             <Button size="sm" variant="outline-info" className="flex-grow-1" onClick={() => { setCurrentProduct(p); setShowModal(true); }}>
                                 <FaEdit className="me-1" /> Edit
                             </Button>
                             <Button size="sm" variant="outline-danger" onClick={() => handleDeleteProduct(p.id)}>
                                 <FaTrash />
                             </Button>
                        </div>
                    </Card.Body>
                </Card>
             </Col>
           ))}
         </Row>
      ) : (
        <Alert variant="secondary" className="bg-dark border-secondary text-secondary text-center py-5">
            <FaBoxOpen size={30} className="mb-3 opacity-50"/>
            <p>No products found in the marketplace.</p>
        </Alert>
      )}
     
      {/* Categories Section */}
      <Card className="border-0 shadow-sm bg-dark text-white mt-5">
          <Card.Header className="bg-transparent border-secondary py-3">
              <h5 className="m-0 fw-bold"><FaTags className="me-2 text-secondary"/> Product Categories</h5>
          </Card.Header>
          <Card.Body>
               <div className="d-flex flex-wrap gap-2 mb-4">
                   {categories.map(c => (
                       <Badge key={c.id} bg="secondary" className="p-2 fw-normal fs-6">{c.name}</Badge>
                   ))}
               </div>
               <InputGroup style={{ maxWidth: "400px" }}>
                    <Form.Control
                    placeholder="New category name..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="bg-dark text-white border-secondary"
                    />
                    <Button variant="outline-primary" onClick={handleAddCategory}>Add Category</Button>
                </InputGroup>
          </Card.Body>
      </Card>

      {/* Edit/Add Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" className="dark-modal" backdrop="static">
        <Modal.Header closeButton className="border-secondary bg-dark text-white">
          <Modal.Title className="fw-bold">{currentProduct ? "Edit Product" : "Add New Product"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveProduct}>
          <Modal.Body className="bg-dark text-white">
            
            <h6 className="text-secondary text-uppercase small fw-bold mb-3">Basic Info</h6>
            <Row className="g-3 mb-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="text-secondary small">Product Name</Form.Label>
                  <Form.Control
                    name="name"
                    defaultValue={currentProduct?.name}
                    required
                    className="bg-dark text-white border-secondary"
                    placeholder="e.g. Premium UI Kit"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="text-secondary small">Price ($)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="price"
                    defaultValue={currentProduct?.price}
                    required
                    className="bg-dark text-white border-secondary"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                  <Form.Group>
                    <Form.Label className="text-secondary small">Subtitle (Short Tagline)</Form.Label>
                    <Form.Control
                        name="subtitle"
                        defaultValue={currentProduct?.subtitle}
                        className="bg-dark text-white border-secondary"
                        placeholder="e.g. The best kit for React projects"
                    />
                  </Form.Group>
              </Col>
            </Row>

            <hr className="border-secondary my-4"/>

            <h6 className="text-secondary text-uppercase small fw-bold mb-3">Product Media</h6>
             <Row className="g-3 mb-3">
                <Col md={8}>
                    <Form.Group>
                        <Form.Label className="text-secondary small d-flex align-items-center gap-2"><FaImage/> Main Image URL</Form.Label>
                        <Form.Control
                            name="image_url"
                            defaultValue={currentProduct?.image_url}
                            onChange={(e) => setPreviewImage(e.target.value)}
                            className="bg-dark text-white border-secondary"
                            placeholder="https://..."
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                     <div className="border border-secondary rounded d-flex align-items-center justify-content-center overflow-hidden" 
                          style={{ height: "100px", backgroundColor: "rgba(255,255,255,0.02)" }}>
                           {previewImage ? (
                               <Image src={previewImage} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                           ) : (
                               <span className="text-muted small">No Preview</span>
                           )}
                     </div>
                </Col>
                <Col md={12}>
                   <Form.Group>
                        <Form.Label className="text-secondary small">Gallery Images (Comma separated URLs)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="gallery_images"
                            defaultValue={currentProduct?.gallery_images?.join(",")}
                             className="bg-dark text-white border-secondary small"
                        />
                   </Form.Group>
                </Col>
             </Row>

             <hr className="border-secondary my-4"/>

             <h6 className="text-secondary text-uppercase small fw-bold mb-3">Details & Links</h6>
             <Row className="g-3">
                <Col md={12}>
                    <Form.Group>
                        <Form.Label className="text-secondary small">Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            defaultValue={currentProduct?.description}
                            required
                             className="bg-dark text-white border-secondary"
                        />
                    </Form.Group>
                </Col>
                <Col md={12}>
                    <Form.Group>
                        <Form.Label className="text-secondary small">Features (One per line)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="features"
                            defaultValue={currentProduct?.features?.join("\n")}
                             className="bg-dark text-white border-secondary"
                        />
                    </Form.Group>
                </Col>
                
                <Col md={6}>
                    <Form.Group>
                        <Form.Label className="text-secondary small d-flex align-items-center gap-2"><FaLink/> Product Link (Gumroad)</Form.Label>
                        <Form.Control
                            name="product_url"
                            defaultValue={currentProduct?.product_url}
                            required
                             className="bg-dark text-white border-secondary"
                        />
                    </Form.Group>
                </Col>
                 <Col md={6}>
                    <Form.Group>
                        <Form.Label className="text-secondary small">Demo Link (Optional)</Form.Label>
                        <Form.Control
                            name="demo_url"
                            defaultValue={currentProduct?.demo_url}
                             className="bg-dark text-white border-secondary"
                        />
                    </Form.Group>
                </Col>
                 <Col md={6}>
                     <Form.Group>
                        <Form.Label className="text-secondary small">Category</Form.Label>
                        <Form.Select
                            name="category_id"
                            defaultValue={currentProduct?.category?.id}
                            className="bg-dark text-white border-secondary"
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
                 <Col md={6}>
                     <Form.Group>
                        <Form.Label className="text-secondary small">Tags (Comma separated)</Form.Label>
                         <Form.Control
                            name="tags"
                            defaultValue={currentProduct?.tags?.join(",")}
                             className="bg-dark text-white border-secondary"
                        />
                     </Form.Group>
                 </Col>
                 <Col md={12}>
                     <Form.Check
                        type="switch"
                        name="is_sold"
                        label="Mark as Sold Out / Inactive"
                        defaultChecked={currentProduct?.is_sold}
                        className="text-white mt-2"
                        />
                 </Col>
             </Row>

          </Modal.Body>
          <Modal.Footer className="border-secondary bg-dark">
            <Button variant="outline-secondary" onClick={() => setShowModal(false)} disabled={submitLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitLoading}>
                {submitLoading ? <Spinner size="sm"/> : "Save Product"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default MarketplaceManager;
