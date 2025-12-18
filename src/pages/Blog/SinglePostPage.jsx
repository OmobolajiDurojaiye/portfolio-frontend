import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Nav } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import apiClient from "../../services/api";
import RelatedPostCard from "../../components/Blog/RelatedPostCard";
import "./Blog.css";

function SinglePostPage() {
  const [post, setPost] = useState(null);
  const [relatedContent, setRelatedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPostData = async () => {
      try {
        setLoading(true);
        setError(null);
        const postRes = await apiClient.get(`/api/blog/posts/${slug}`);
        setPost(postRes.data);

        const relatedRes = await apiClient.get(
          `/api/blog/posts/${slug}/related`
        );
        setRelatedContent(relatedRes.data);

        apiClient.post(`/api/blog/posts/${slug}/view`).catch(console.error);
      } catch (err) {
        setError("Post not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [slug]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }
  if (error || !post) {
    return (
      <Container className="text-center py-5">
        <h2 className="section-title">404 - Not Found</h2>
        <p className="section-subtitle">{error}</p>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${post.title} - The B Blog`}</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} - The B Blog`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image_url} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://bolaji.tech/blog/${post.slug}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} - The B Blog`} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.image_url} />
      </Helmet>

      <div className="single-post-container">
        {post.image_url && (
          <header
            className="post-header"
            style={{ backgroundImage: `url(${post.image_url})` }}
          >
            <div className="post-header-overlay">
              <Container className="h-100 d-flex flex-column justify-content-center text-center">
                {post.category && (
                  <Link to={`/blog/categories/${post.category.slug}`}>
                    <span
                      className="category-tag mx-auto mb-3"
                      style={{ backgroundColor: post.category.color }}
                    >
                      {post.category.name}
                    </span>
                  </Link>
                )}
                <h1 className="post-title display-4">{post.title}</h1>
                <div className="post-meta mt-2">
                  By {post.author} on{" "}
                  {new Date(post.date_posted).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </Container>
            </div>
          </header>
        )}
        <Container className="post-content-container">
          <Row>
            <Col lg={{ span: 8, offset: 2 }}>
              <Nav className="breadcrumb-nav">
                <Nav.Item>
                  <Link to="/">Home</Link>
                </Nav.Item>
                <Nav.Item>/</Nav.Item>
                <Nav.Item>
                  <Link to="/blog">Blog</Link>
                </Nav.Item>
                {post.category && (
                  <>
                    <Nav.Item>/</Nav.Item>
                    <Nav.Item
                      as={Link}
                      to={`/blog/categories/${post.category.slug}`}
                    >
                      {post.category.name}
                    </Nav.Item>
                  </>
                )}
              </Nav>
              <div className="ql-snow">
                <div
                  className="post-body ql-editor"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </Col>
          </Row>
        </Container>
        {relatedContent && (
          <Container className="see-more-section">
            <Row>
              {relatedContent.inThisSeries &&
                relatedContent.inThisSeries.length > 0 && (
                  <Col lg={6} className="mb-5">
                    <h3 className="related-section-title">In This Series</h3>
                    <div className="related-posts-grid">
                      {relatedContent.inThisSeries.map((p) => (
                        <RelatedPostCard key={p.id} post={p} />
                      ))}
                    </div>
                  </Col>
                )}
              {relatedContent.moreInCategory &&
                relatedContent.moreInCategory.length > 0 && (
                  <Col lg={6} className="mb-5">
                    <h3 className="related-section-title">
                      More in {post.category?.name}
                    </h3>
                    <div className="related-posts-grid">
                      {relatedContent.moreInCategory.map((p) => (
                        <RelatedPostCard key={p.id} post={p} />
                      ))}
                    </div>
                  </Col>
                )}
            </Row>
            {(relatedContent.previousPost || relatedContent.nextPost) && (
              <Row className="mt-4">
                <Col>
                  <div className="prev-next-nav">
                    {relatedContent.previousPost ? (
                      <Link
                        to={`/blog/${relatedContent.previousPost.slug}`}
                        className="prev-next-link prev-link"
                      >
                        <span>&larr; Previous Article</span>
                        <h5>{relatedContent.previousPost.title}</h5>
                      </Link>
                    ) : (
                      <div></div>
                    )}
                    {relatedContent.nextPost ? (
                      <Link
                        to={`/blog/${relatedContent.nextPost.slug}`}
                        className="prev-next-link next-link"
                      >
                        <span>Next Article &rarr;</span>
                        <h5>{relatedContent.nextPost.title}</h5>
                      </Link>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </Col>
              </Row>
            )}
          </Container>
        )}
      </div>
    </>
  );
}

export default SinglePostPage;
