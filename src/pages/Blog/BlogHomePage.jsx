import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import apiClient from "../../services/api";
import ErrorDisplay from "../../components/ErrorDisplay";
import "./Blog.css";

function BlogHomePage() {
  const [data, setData] = useState({
    featuredPost: null,
    posts: [],
    readlists: [],
    pagination: {},
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchBlogData = async (pageNum = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      
      const response = await apiClient.get(
        `/api/blog/home-data?page=${pageNum}`
      );
      
      const newData = response.data;
      
      setData(prevData => {
        if (pageNum === 1) return newData;
        return {
          ...newData,
          posts: [...prevData.posts, ...newData.posts], // Append new posts
          featuredPost: prevData.featuredPost, // Keep original featured post
          readlists: prevData.readlists // Keep readlists
        };
      });
    } catch (err) {
      setError("Failed to load blog content. Please check back later.");
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBlogData(page);
  }, [page]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) {
    return (
      <Container className="text-center py-5 vh-100 d-flex align-items-center justify-content-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return <ErrorDisplay onRetry={() => fetchBlogData(1)} />;
  }

  const { featuredPost, posts, readlists, pagination } = data;

  return (
    <Container fluid className="blog-home-container px-md-5">
      <div className="text-center my-5 py-3">
        <h1 className="blog-title display-3 mb-2">The B Blog</h1>
        <p className="text-secondary lead">Thoughts, tutorials, and insights on software engineering.</p>
      </div>

      {/* Hero Section - Featured Post */}
      {featuredPost && (
        <div className="featured-hero-section mb-5">
            <Link to={`/blog/${featuredPost.slug}`} className="main-featured-post-link">
                <div className="featured-hero-card">
                    <Row className="g-0 align-items-center h-100">
                        <Col lg={7} className="h-100">
                            <div className="featured-img-wrapper h-100">
                                <img
                                    src={featuredPost.image_url}
                                    alt={featuredPost.title}
                                    className="featured-hero-img"
                                />
                            </div>
                        </Col>
                        <Col lg={5}>
                            <div className="featured-content p-4 p-lg-5">
                                <span className="eyebrow-text text-primary mb-2 d-inline-block">Featured Article</span>
                                <h2 className="main-featured-title mb-3">{featuredPost.title}</h2>
                                <p className="main-featured-excerpt text-secondary mb-4">
                                    {featuredPost.excerpt}
                                </p>
                                {featuredPost.category && (
                                    <span
                                        className="category-tag mb-3 d-inline-block"
                                        style={{ backgroundColor: featuredPost.category?.color || 'var(--plum-accent)' }}
                                    >
                                        {featuredPost.category?.name}
                                    </span>
                                )}
                                <div className="mt-3">
                                    <span className="read-more-btn">Read Article &rarr;</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Link>
        </div>
      )}

      <Row className="g-4 g-lg-5">
        {/* Main Feed */}
        <Col lg={8}>
            <div className="section-header mb-4 d-flex align-items-center justify-content-between">
                <h3 className="section-heading fw-bold text-white mb-0">Latest Articles</h3>
            </div>

            <div className="posts-grid-unified">
                {posts.map((post) => (
                    <Link to={`/blog/${post.slug}`} key={post.id} className="modern-post-card">
                        <div className="post-card-img-container">
                            <img src={post.image_url} alt={post.title} loading="lazy" />
                            {post.category && (
                                <span 
                                    className="post-card-category"
                                    style={{ backgroundColor: post.category?.color || 'var(--plum-accent)' }}
                                >
                                    {post.category?.name}
                                </span>
                            )}
                        </div>
                        <div className="post-card-body">
                            <div className="post-meta mb-2">
                                <span className="post-date">{new Date(post.date_posted).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric'})}</span>
                            </div>
                            <h4 className="post-title">{post.title}</h4>
                            <p className="post-excerpt">{post.excerpt}</p>
                            <span className="read-more-link">Read More</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Load More Section */}
            {pagination.hasNext && (
                <div className="text-center mt-5 mb-5 pb-5">
                    <Button 
                        onClick={handleLoadMore} 
                        disabled={loadingMore}
                        className="load-more-btn"
                        size="lg"
                    >
                        {loadingMore ? <Spinner animation="border" size="sm" /> : "Load More Articles"}
                    </Button>
                </div>
            )}
            
            {!pagination.hasNext && posts.length > 0 && (
                <div className="text-center mt-5 mb-5 pb-5 text-secondary">
                    <p>You've reached the end of the list.</p>
                </div>
            )}
        </Col>

        {/* Sidebar */}
        <Col lg={4} className="sidebar-column">
          <div className="readlists-sidebar sticky-top" style={{ top: "100px", zIndex: 10 }}>
            <h4 className="column-title mb-4 fw-bold text-white">Curated Readlists</h4>
            <div className="readlist-items">
                {readlists &&
                readlists.map((readlist) => (
                    <Link
                    to={`/blog/readlists/${readlist.slug}`}
                    key={readlist.id}
                    className="readlist-mini-card"
                    >
                    <div className="readlist-mini-img">
                        <img
                            src={readlist.image_url || "https://via.placeholder.com/80x80"}
                            alt={readlist.name}
                        />
                    </div>
                    <div className="readlist-mini-info">
                        <h6 className="readlist-name">{readlist.name}</h6>
                        <p className="readlist-count">{readlist.post_count || 0} Articles</p>
                    </div>
                    </Link>
                ))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default BlogHomePage;
