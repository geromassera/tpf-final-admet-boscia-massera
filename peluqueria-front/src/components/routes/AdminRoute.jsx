import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthenticationContext } from "../services/auth.context";

const AdminRoute = ({ children }) => {
  const { user, isLoggedIn } = useContext(AuthenticationContext);

  if (!isLoggedIn || user.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
