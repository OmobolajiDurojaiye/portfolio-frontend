import { Link } from "react-router-dom";

const RelatedPostCard = ({ post }) => {
  if (!post) return null;

  return (
    <Link to={`/blog/${post.slug}`} className="related-post-card">
      <div className="related-post-img-container">
        <img src={post.image_url} alt={post.title} />
      </div>
      <div className="related-post-content">
        {post.category && (
          <span
            className="category-tag-sm"
            style={{ backgroundColor: post.category.color }}
          >
            {post.category.name}
          </span>
        )}
        <h5 className="related-post-title">{post.title}</h5>
      </div>
    </Link>
  );
};

export default RelatedPostCard;
