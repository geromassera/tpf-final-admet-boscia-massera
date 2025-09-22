import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthenticationContext } from "../services/auth.context";

const BarberRoute = ({ children }) => {
  const { user, isLoggedIn } = useContext(AuthenticationContext);

  if (!isLoggedIn || user.role !== "Barber") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default BarberRoute;
