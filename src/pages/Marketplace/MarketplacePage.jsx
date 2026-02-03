import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Spinner, Button, InputGroup } from "react-bootstrap";
import { FaSearch, FaFilter, FaShoppingBag } from "react-icons/fa";
import { useApi } from "../../hooks/useApi";
import ErrorDisplay from "../../components/ErrorDisplay";
import ProductCard from "../../components/Marketplace/ProductCard";
import PriceRangeFilter from "../../components/Marketplace/PriceRangeFilter";
import "./Marketplace.css";

const FilterSidebar = ({
  categories,
  activeCategory,
  setActiveCategory,
  priceRange,
  setPriceRange,
  minPrice,
  maxPrice,
}) => (
  <div className="filter-sidebar sticky-top" style={{ top: "100px" }}>
    <div className="filter-group mb-5">
        <h6 className="filter-title text-uppercase">Categories</h6>
        <div className="category-filters d-flex flex-column gap-1">
        <button
            className={`filter-btn ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => setActiveCategory("all")}
        >
            All Products
        </button>
        {categories.map((cat) => (
            <button
            key={cat.id}
            className={`filter-btn ${activeCategory === cat.slug ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.slug)}
            >
            {cat.name}
            </button>
        ))}
        </div>
    </div>

    <div className="filter-group">
        <h6 className="filter-title text-uppercase">Price Range</h6>
        {maxPrice > minPrice ? (
        <PriceRangeFilter
            min={Math.floor(minPrice)}
            max={Math.ceil(maxPrice)}
            onAfterChange={(value) => setPriceRange(value)}
        />
        ) : (
        <p className="text-secondary small">Single Price</p>
        )}
    </div>
  </div>
);

function MarketplacePage() {
  const { data, loading, error, retry } = useApi("/api/marketplace/products");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 99999]);
  const [initialPriceRange, setInitialPriceRange] = useState([0, 99999]);

  useEffect(() => {
    if (data?.products && data.products.length > 0) {
      const prices = data.products.map((p) => p.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setPriceRange([min, max]);
      setInitialPriceRange([min, max]);
    }
  }, [data]);

  if (loading)
    return (
      <Container className="text-center py-5 vh-100 d-flex flex-column justify-content-center">
        <Spinner animation="grow" variant="primary" />
        <p className="mt-3 text-secondary">Loading Marketplace...</p>
      </Container>
    );
  if (error) return <ErrorDisplay onRetry={retry} />;

  const products = data?.products || [];
  const categories = data?.categories || [];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === "all" || p.category?.slug === activeCategory;
    const matchesSearch =
      searchTerm === "" ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="marketplace-page-wrapper">
        {/* Simplified Hero Section */}
      <section className="marketplace-hero text-center">
        <Container>
            <h1 className="display-4 fw-bold text-white mb-3">
                The Marketplace
            </h1>
            <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: "600px" }}>
                A curated collection of digital products and developer assets to supercharge your next project.
            </p>
            <div className="search-bar-wrapper mx-auto" style={{ maxWidth: "500px" }}>
                <InputGroup size="lg" className="hero-search-input">
                    <InputGroup.Text className="bg-dark border-secondary text-secondary">
                        <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                        placeholder="Search products..."
                        className="bg-dark text-white border-secondary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>
            </div>
        </Container>
      </section>

      <Container fluid className="px-lg-5 pb-5">
        <Row>
          <Col lg={2} className="mb-4 mb-lg-0">
            <FilterSidebar
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              minPrice={initialPriceRange[0]}
              maxPrice={initialPriceRange[1]}
            />
          </Col>
          <Col lg={10}>
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary">
              <h5 className="mb-0 fw-bold text-white">
                  {filteredProducts.length} Products
              </h5>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-5 border border-dashed border-secondary rounded-3">
                <FaShoppingBag size={40} className="text-secondary opacity-50 mb-3" />
                <h4 className="text-white">No products found</h4>
                <p className="text-secondary">Try adjusting your filters or search term.</p>
                <Button variant="outline-primary" onClick={() => { setActiveCategory("all"); setSearchTerm(""); }}>
                    Clear Filters
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MarketplacePage;
