import { useState, useRef, useContext } from "react";
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import {
  successToast,
  errorToast,
} from "../components/ui/toast/NotificationToast";
import { AuthenticationContext } from "../components/services/auth.context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: false, password: false });
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const { handleUserLogin } = useContext(AuthenticationContext);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!emailRef.current.value) {
      setErrors({ ...errors, email: true });
      emailRef.current.focus();
      return;
    }
    if (!passwordRef.current.value) {
      setErrors({ ...errors, password: true });
      passwordRef.current.focus();
      return;
    }
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      const userData = await res.json();
      localStorage.setItem("user_id", userData.user_id);
      handleUserLogin(userData);
      console.log(userData);
      successToast("Inicio de sesión exitoso.");
      if (userData.role === "Admin") {
        navigate("/admin");
      } else if (userData.role === "Barber") {
        navigate("/barbersView");
      } else {
        navigate("/");
      }
    } catch (err) {
      errorToast(err.message);
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
                ref={emailRef}
              />
              {errors.email && <p>El email es requerido.</p>}
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Control
                type="password"
                className={errors.password && "border border-danger"}
                placeholder="Ingresar contraseña"
                onChange={handlePasswordChange}
                value={password}
                ref={passwordRef}
              />
              {errors.password && <p>El password es requerido.</p>}
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
