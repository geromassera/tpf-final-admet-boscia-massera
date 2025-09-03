import { useState } from "react";
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import {
  errorToast,
  successToast,
} from "../components/ui/toast//NotificationToast";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({ email: false, password: false });
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      setErrors({ ...errors, email: true });
      return;
    }
    if (!password) {
      setErrors({ ...errors, password: true });
      return;
    }
    const newUser = {
      name,
      email,
      password,
    };
    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data?.message || "Error al registrar usuario.";
        errorToast(message);
        return;
      }
      successToast(
        "Usuario registrado exitosamente. Inicie sesión para continuar."
      );
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      errorToast("Error al registrar usuario.");
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
            <h5>Registro</h5>
          </Row>
          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <Form.Control
                type="text"
                required
                placeholder="Ingrese su nombre y apellido"
                onChange={handleNameChange}
                value={name}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Control
                type="email"
                className={errors.email && "border border-danger"}
                required
                placeholder="Ingresar email"
                onChange={handleEmailChange}
                value={email}
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
              />
              {errors.password && <p>El password es requerido.</p>}
            </FormGroup>
            <div className="d-flex justify-content-center mb-3">
              <Button variant="primary" type="submit" className="me-2">
                Registrarse
              </Button>
            </div>
            <div className="text-center">
              <p>¿Ya tienes una cuenta?</p>
              <Button variant="secondary" onClick={() => navigate("/login")}>
                Iniciar sesión
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
