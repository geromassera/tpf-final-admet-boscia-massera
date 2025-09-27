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
  const[number, setNumber] = useState("");
  const [errors, setErrors] = useState({ email: false, password: false, number: false });
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

  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let hasError = false;
    const newErrors = { email: false, password: false, number: false };

    if (!email) {
      newErrors.email = true;
      hasError = true;
    }
    if (!password) {
      newErrors.password = true;
      hasError = true;
    }

    const numberRegex = /^[0-9]{10}$/;
    if (!number) {
      newErrors.number = true;
      hasError = true;
    } else if (!numberRegex.test(number.replace(/\s+/g, ""))) {
      newErrors.number = true;
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const newUser = {
      name,
      email,
      number,
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
                type="tel"
                required
                className={errors.number && "border border-danger"}
                placeholder="Ingresar teléfono (10 dígitos)"
                onChange={handleNumberChange}
                pattern="[0-9]{10}"
                title="El teléfono debe tener exactamente 10 dígitos, sin espacios ni letras"
                value={number}
              />
              {errors.number && <p>El teléfono es requerido.</p>}
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Control
                type="password"
                className={errors.password && "border border-danger"}
                placeholder="Ingresar contraseña"
                onChange={handlePasswordChange}
                value={password}
              />
              {errors.password && <p>La contraseña es requerida.</p>}
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
