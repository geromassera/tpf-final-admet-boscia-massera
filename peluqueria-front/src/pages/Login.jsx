import { useState, useContext } from "react";
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import {
  successToast,
  errorToast,
} from "../components/ui/toast/NotificationToast";
import { AuthenticationContext } from "../components/services/auth.context";
import api from "../components/services/API/Axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: null, password: null });
  const navigate = useNavigate();

  const { handleUserLogin } = useContext(AuthenticationContext);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const validateForm = () => {
    const newErrors = { email: null, password: null };
    let hasError = false;

    if (!email) {
      newErrors.email = "El email es requerido.";
      hasError = true;
    }
    if (!password) {
      newErrors.password = "La contraseña es requerida.";
      hasError = true;
    }
    setErrors(newErrors);
    return hasError;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      return;
    }
    setErrors({ email: null, password: null });

    try {
      const response = await api.post("/authentication/login", {
        email,
        password,
      });

      const authResult = response.data;

      handleUserLogin(authResult);

      successToast("Inicio de sesión exitoso.");

      const userRole = authResult.user?.role;

      if (userRole === "Admin") {
        navigate("/admin");
      } else if (userRole === "Barber") {
        navigate("/barbersView");
      } else {
        navigate("/");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Error al iniciar sesión. Verifique sus credenciales.";
      errorToast(message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-start w-100"
      style={{ paddingTop: "150px", minHeight: "100vh" }}
    >
      <Card className="p-4 shadow" style={{ minWidth: "400px" }}>
        <Card.Body>
          <Row className="mb-3">
            <h5>Iniciar sesión</h5>
          </Row>
          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <Form.Control
                type="email"
                className={errors.email && "border border-danger"}
                required
                placeholder="Ingresar email"
                onChange={handleEmailChange}
                value={email}
              />
              {errors.email && (
                <p className="text-danger mt-1">{errors.email}</p>
              )}
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Control
                type="password"
                className={errors.password && "border border-danger"}
                M
                placeholder="Ingresar contraseña"
                onChange={handlePasswordChange}
                value={password}
              />
              {errors.password && (
                <p className="text-danger mt-1">{errors.password}</p>
              )}
            </FormGroup>
            <div className="d-flex justify-content-center mb-3">
              <Button variant="primary" type="submit" className="me-2">
                Iniciar sesión
              </Button>
            </div>
            <div className="text-center">
              <p>¿Aún no tienes una cuenta?</p>
              <Button variant="secondary" onClick={() => navigate("/register")}>
                Regístrate
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
