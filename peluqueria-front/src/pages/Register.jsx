import { useState } from "react";
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import {
  errorToast,
  successToast,
} from "../components/ui/toast//NotificationToast";
import api from "../components/services/API/Axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({
    name: false,
    surname: false,
    email: false,
    password: false,
    phone: false,
  });
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

  const handleSurnameChange = (event) => {
    setSurname(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let hasError = false;
    const newErrors = {
      name: false,
      surname: false,
      email: false,
      password: false,
      phone: false,
    };

    if (!name) {
      newErrors.name = true;
      hasError = true;
    }
    if (!surname) {
      newErrors.surname = true;
      hasError = true;
    }

    if (!email) {
      newErrors.email = true;
      hasError = true;
    }
    if (!password) {
      newErrors.password = true;
      hasError = true;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) {
      newErrors.phone = true;
      hasError = true;
    } else if (!phoneRegex.test(phone.replace(/\s+/g, ""))) {
      newErrors.phone = true;
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const newUser = {
      name,
      surname,
      email,
      phone,
      password,
    };
    try {
      const res = await api.post("/authentication/register", newUser);
      successToast(
        "Usuario registrado exitosamente. Inicie sesión para continuar."
      );
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const message =
        err.response?.data?.message || "Error al registrar usuario.";
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
            <h5>Registro</h5>
          </Row>
          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <Form.Control
                type="text"
                className={errors.name && "border border-danger"}
                required
                placeholder="Ingrese su nombre"
                onChange={handleNameChange}
                value={name}
              />
              {errors.name && <p>El nombre es requerido.</p>}
            </FormGroup>

            <FormGroup className="mb-3">
              <Form.Control
                type="text"
                className={errors.surname && "border border-danger"}
                required
                placeholder="Ingrese su apellido"
                onChange={handleSurnameChange}
                value={surname}
              />
              {errors.surname && <p>El apellido es requerido.</p>}
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
                className={errors.phone && "border border-danger"}
                placeholder="Ingresar teléfono (10 dígitos)"
                onChange={handlePhoneChange}
                pattern="[0-9]{10}"
                title="El teléfono debe tener exactamente 10 dígitos, sin espacios ni letras."
                value={phone}
              />
              {errors.phone && <p>El teléfono es requerido.</p>}
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
