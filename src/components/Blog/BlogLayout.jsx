import { Outlet } from "react-router-dom";
import BlogNavbar from "./BlogNavbar";
import "../../pages/Blog/Blog.css";

const BlogLayout = () => {
  return (
    <div className="paper-notebook-sheet">
      {/* Continuous vertical red notebook margin line */}
      <div className="paper-margin-rule" aria-hidden="true" />
      <BlogNavbar />
      <div className="paper-sheet-body">
        <Outlet />
      </div>
    </div>
  );
};

export default BlogLayout;
