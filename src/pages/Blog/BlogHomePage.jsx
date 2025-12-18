import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import apiClient from "../../services/api";
import "./Blog.css";

function BlogHomePage() {
  const [data, setData] = useState({
    featuredPost: null,
    posts: [],
    readlists: [],
    pagination: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(
          `/api/blog/home-data?page=${currentPage}`
        );
        setData(response.data);
      } catch (err) {
        setError("Failed to load blog content. Please check back later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogData();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setSearchParams({ page: pageNumber });
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="text-center py-5">
        <p className="text-danger">{error}</p>
      </Container>
    );
  }

  const { featuredPost, posts, readlists, pagination } = data;

  const mainPost = featuredPost;
  const topRowPosts = posts.slice(0, 3);
  const bottomRowPosts = posts.slice(3, 7);

  return (
    <Container fluid className="blog-home-container px-md-5">
      <div className="text-center my-5">
        <h1 className="blog-title display-3">The B Blog</h1>
      </div>

      {mainPost && currentPage === 1 && (
        <Row className="mb-5 align-items-center">
          <Col lg={7}>
            <Link to={`/blog/${mainPost.slug}`} className="main-featured-post">
              <img
                src={mainPost.image_url}
                alt={mainPost.title}
                className="main-featured-img"
              />
            </Link>
          </Col>
          <Col lg={5}>
            <div className="main-featured-content">
              <span className="eyebrow-text">Best of the week</span>
              {mainPost.category && (
                <span
                  className="category-tag"
                  style={{ backgroundColor: mainPost.category?.color }}
                >
                  {mainPost.category?.name}
                </span>
              )}
              <h2 className="main-featured-title">{mainPost.title}</h2>
              <p className="main-featured-excerpt text-secondary">
                {mainPost.excerpt}
              </p>
              <Link to={`/blog/${mainPost.slug}`} className="read-article-link">
                Read Article &rarr;
              </Link>
            </div>
          </Col>
        </Row>
      )}

      <Row className="mb-5">
        {topRowPosts &&
          topRowPosts.map((post) => (
            <Col lg={4} md={6} key={post.id} className="mb-4">
              <Link to={`/blog/${post.slug}`} className="grid-post-card">
                <div className="grid-post-img-container">
                  <img src={post.image_url} alt={post.title} />
                </div>
                <div className="grid-post-content">
                  {post.category && (
                    <span
                      className="category-tag-sm"
                      style={{ backgroundColor: post.category?.color }}
                    >
                      {post.category?.name}
                    </span>
                  )}
                  <h5 className="grid-post-title">{post.title}</h5>
                  <p className="grid-post-excerpt text-secondary">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </Col>
          ))}
      </Row>

      <Row>
        <Col lg={8}>
          {bottomRowPosts &&
            bottomRowPosts.map((post) => (
              <Link
                to={`/blog/${post.slug}`}
                key={post.id}
                className="list-post-item"
              >
                <img src={post.image_url} alt={post.title} />
                <div className="list-post-content">
                  {post.category && (
                    <span
                      className="category-tag-sm"
                      style={{ backgroundColor: post.category?.color }}
                    >
                      {post.category?.name}
                    </span>
                  )}
                  <h6>{post.title}</h6>
                </div>
              </Link>
            ))}
          {pagination && pagination.totalPages > 1 && (
            <div className="pagination-container">
              <Pagination>
                {pagination.hasPrev && (
                  <Pagination.Prev
                    onClick={() => handlePageChange(pagination.page - 1)}
                  />
                )}
                {[...Array(pagination.totalPages).keys()].map((num) => (
                  <Pagination.Item
                    key={num + 1}
                    active={num + 1 === pagination.page}
                    onClick={() => handlePageChange(num + 1)}
                  >
                    {num + 1}
                  </Pagination.Item>
                ))}
                {pagination.hasNext && (
                  <Pagination.Next
                    onClick={() => handlePageChange(pagination.page + 1)}
                  />
                )}
              </Pagination>
            </div>
          )}
        </Col>
        <Col lg={4} className="sidebar-column">
          <div className="readlists-sidebar">
            <h4 className="column-title">Readlists</h4>
            {readlists &&
              readlists.map((readlist) => (
                <Link
                  to={`/blog/readlists/${readlist.slug}`}
                  key={readlist.id}
                  className="readlist-sidebar-item"
                >
                  <img
                    src={
                      readlist.image_url || "https://via.placeholder.com/80x80"
                    }
                    alt={readlist.name}
                  />
                  <div>
                    <h6>{readlist.name}</h6>
                    <p className="text-secondary small">
                      {readlist.description}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default BlogHomePage;
