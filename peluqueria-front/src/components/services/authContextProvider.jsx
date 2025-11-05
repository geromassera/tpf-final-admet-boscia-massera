import { useState, useEffect } from "react";
import { AuthenticationContext } from "./auth.context";
import { jwtDecode } from "jwt-decode";

export const AuthenticationContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const decodedToken = jwtDecode(storedToken);

        const expirationTime = decodedToken.exp * 1000;
        const now = Date.now();

        if (expirationTime < now) {
          console.warn("Token expirado, cerrando sesión.");
          handleUserLogout();
        } else {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Token inválido o corrupto:", error);
        handleUserLogout();
      }
    }

    setLoading(false);
  }, []);

  const handleUserLogin = (authResult) => {
    setUser(authResult.user);
    localStorage.setItem("user", JSON.stringify(authResult.user));
    localStorage.setItem("token", authResult.token);
  };

  const handleUserUpdate = (updatedUserDto) => {
    setUser(updatedUserDto);
    localStorage.setItem("user", JSON.stringify(updatedUserDto));
  };

  const handleUserLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const isLoggedIn = !!user;

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        isLoggedIn,
        handleUserLogin,
        handleUserUpdate,
        handleUserLogout,
        loading,
        getToken,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
