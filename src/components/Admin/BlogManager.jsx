import { useState } from "react";
import ManageReadlistPage from "./ManageReadlistPage";
import MainBlogDashboard from "./MainBlogDashboard";

const BlogManager = () => {
  const [view, setView] = useState("main"); // 'main' or 'manageReadlist'
  const [managingReadlistId, setManagingReadlistId] = useState(null);

  const handleManageReadlist = (readlistId) => {
    setManagingReadlistId(readlistId);
    setView("manageReadlist");
  };

  const handleBackToMain = () => {
    setManagingReadlistId(null);
    setView("main");
  };

  if (view === "manageReadlist") {
    return (
      <ManageReadlistPage
        readlistId={managingReadlistId}
        onBack={handleBackToMain}
      />
    );
  }

  return <MainBlogDashboard onManageReadlist={handleManageReadlist} />;
};

export default BlogManager;
