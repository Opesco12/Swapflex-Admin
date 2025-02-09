import { Navigate } from "react-router-dom";

import Loader from "./Loader";
import { useAuth } from "../contexts/authContext";

export const AdminProtectedRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};
