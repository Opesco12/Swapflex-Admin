import { Navigate } from "react-router-dom";

import Loader from "./Loader";
import { useAuth } from "../contexts/authContext";

export const ProtectedRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <Loader />;
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/user/login" />;
  }

  return children;
};
