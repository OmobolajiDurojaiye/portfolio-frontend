import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
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
  <div className="filter-sidebar">
    <h4 className="filter-title">Categories</h4>
    <div className="category-filters">
      <button
        className={activeCategory === "all" ? "active" : ""}
        onClick={() => setActiveCategory("all")}
      >
        All Products
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={activeCategory === cat.slug ? "active" : ""}
          onClick={() => setActiveCategory(cat.slug)}
        >
          {cat.name}
        </button>
      ))}
    </div>

    <h4 className="filter-title mt-4">Price Range</h4>
    {maxPrice > minPrice ? (
      <PriceRangeFilter
        min={Math.floor(minPrice)}
        max={Math.ceil(maxPrice)}
        onAfterChange={(value) => setPriceRange(value)}
      />
    ) : (
      <p className="text-secondary small">Not available.</p>
    )}
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
      <Container className="text-center py-5">
        <Spinner />
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
    <Container fluid className="marketplace-container px-md-5">
      <div className="marketplace-hero">
        <div className="marketplace-hero-content text-center">
          <h1 className="display-3 fw-bolder">The Marketplace</h1>
          <p className="lead-custom mx-auto">
            A curated collection of digital products and developer assets to
            supercharge your next project.
          </p>
        </div>
      </div>

      <Row>
        <Col lg={3}>
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
        <Col lg={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">{filteredProducts.length} Products Found</h5>
            <Form.Control
              type="search"
              placeholder="Search products..."
              className="product-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-secondary mt-5">
              No products found matching your criteria.
            </p>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default MarketplacePage;
