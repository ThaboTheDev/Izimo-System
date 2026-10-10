// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile } = useAuth();

  // 1. Not logged in -> Send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in, but wrong role -> Send to unauthorized/dashboard fallback
  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    return <Navigate to="/" replace />;
  }

  // 3. Authorized -> Render the page
  return children;
}