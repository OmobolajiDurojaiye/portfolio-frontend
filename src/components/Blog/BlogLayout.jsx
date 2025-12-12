import { Outlet } from "react-router-dom";
import BlogFooter from "./BlogFooter";
import BlogNavbar from "./BlogNavbar";

const BlogLayout = () => {
  return (
    <div className="blog-ecosystem">
      <BlogNavbar />
      <div style={{ minHeight: "60vh" }}>
        <Outlet />
      </div>
      <BlogFooter />
    </div>
  );
};

export default BlogLayout;
