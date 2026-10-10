// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Placeholder imports (you will build these next)
import Login from "./pages/auth/Login";
const MemberDashboard = () => <div>Member Dashboard</div>;
const CenterDashboard = () => <div>Center Dashboard</div>;
const HQDashboard = () => <div>HQ Dashboard</div>;

// Redirects users to their specific dashboard based on their role
const IndexRedirect = () => {
  const { profile } = useAuth();
  if (!profile) return <Navigate to="/login" />;

  const routes = {
    member: "/member/dashboard",
    center_admin: "/center/dashboard",
    hq_admin: "/hq/dashboard",
    system_admin: "/system/dashboard",
  };
  return <Navigate to={routes[profile.role] || "/login"} replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes wrapped in the main Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<IndexRedirect />} />

            <Route
              path="/member/*"
              element={
                <ProtectedRoute allowedRoles={["member"]}>
                  <Routes>
                    <Route path="dashboard" element={<MemberDashboard />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            <Route
              path="/center/*"
              element={
                <ProtectedRoute allowedRoles={["center_admin"]}>
                  <Routes>
                    <Route path="dashboard" element={<CenterDashboard />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            <Route
              path="/hq/*"
              element={
                <ProtectedRoute allowedRoles={["hq_admin", "system_admin"]}>
                  <Routes>
                    <Route path="dashboard" element={<HQDashboard />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}