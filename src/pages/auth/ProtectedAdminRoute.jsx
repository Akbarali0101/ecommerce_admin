import { Navigate, Outlet } from "react-router-dom";

export function ProtectedAdminRoute() {
  const token = localStorage.getItem("admin_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}