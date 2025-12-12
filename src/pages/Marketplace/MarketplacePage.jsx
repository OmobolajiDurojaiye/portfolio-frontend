import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import apiClient from "../../services/api";
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
        All Categories
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
    {maxPrice > minPrice && (
      <PriceRangeFilter
        min={Math.floor(minPrice)}
        max={Math.ceil(maxPrice)}
        onAfterChange={(value) => setPriceRange(value)}
      />
    )}
  </div>
);

function MarketplacePage() {
  const [data, setData] = useState({ products: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]); // Default wide range

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get("/api/marketplace/products");
        const prices = res.data.products.map((p) => p.price);
        setData(res.data);
        if (prices.length > 0) {
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
      } catch (error) {
        console.error("Failed to fetch marketplace data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const minPrice =
    data.products.length > 0
      ? Math.min(...data.products.map((p) => p.price))
      : 0;
  const maxPrice =
    data.products.length > 0
      ? Math.max(...data.products.map((p) => p.price))
      : 10000;

  const filteredProducts = data.products.filter((p) => {
    const matchesCategory =
      activeCategory === "all" || p.category?.slug === activeCategory;
    const matchesSearch =
      searchTerm === "" ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchesCategory && matchesSearch && matchesPrice;
  });

  if (loading)
    return (
      <Container className="text-center py-5">
        <Spinner />
      </Container>
    );

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
            categories={data.categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
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
