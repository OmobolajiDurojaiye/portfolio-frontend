import { Outlet } from "react-router-dom";
import BlogNavbar from "./BlogNavbar";

const BlogLayout = () => {
  return (
    <div className="blog-ecosystem">
      <BlogNavbar />
      <div style={{ minHeight: "60vh" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default BlogLayout;
