import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("admin_token");

  // A more robust check would verify the token's expiry
  // For now, we'll just check for its existence.
  return token ? <Outlet /> : <Navigate to="/admin" />;
};

export default ProtectedRoute;
