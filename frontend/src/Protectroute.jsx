import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requireAdmin }) {
  const token = localStorage.getItem("access_token");
  const username = localStorage.getItem("username") || "";
  const isAdmin = localStorage.getItem("is_admin") === "true" || username.toLowerCase() === "admin";

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default ProtectedRoute;
