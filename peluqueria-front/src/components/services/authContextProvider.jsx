import { useState } from "react";
import { AuthenticationContext } from "./auth.context";
import { useEffect } from "react";
export const AuthenticationContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const handleUserLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const handleUserLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  const isLoggedIn = !!user;
  return (
    <AuthenticationContext.Provider
      value={{ user, isLoggedIn, handleUserLogin, handleUserLogout, loading }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};