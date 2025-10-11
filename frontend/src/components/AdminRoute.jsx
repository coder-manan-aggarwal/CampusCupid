import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />; // not logged in
  if (user.role !== "admin") return <Navigate to="/dashboard" />; // not admin → normal dashboard

  return children;
};

export default AdminRoute;
