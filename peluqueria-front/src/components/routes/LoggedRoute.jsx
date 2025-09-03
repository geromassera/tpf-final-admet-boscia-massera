import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthenticationContext } from "../services/auth.context";

const LoggedRoute = ({ children }) => {
  const { user, isLoggedIn } = useContext(AuthenticationContext);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default LoggedRoute;
