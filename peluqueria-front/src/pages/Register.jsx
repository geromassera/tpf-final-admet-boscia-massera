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
    name: null,
    surname: null,
    email: null,
    password: null,
    phone: null,
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
      name: null,
      surname: null,
      email: null,
      password: null,
      phone: null,
    };

    if (!name) {
      newErrors.name = "El nombre es requerido.";
      hasError = true;
    } else if (name.length > 25) {
      newErrors.name = "El nombre debe tener menos de 25 caracteres.";
      hasError = true;
    }
    if (!surname) {
      newErrors.surname = "El apellido es requerido.";
      hasError = true;
    } else if (surname.length > 25) {
      newErrors.surname = "El apellido debe tener menos de 25 caracteres.";
      hasError = true;
    }

    if (!email) {
      newErrors.email = "El email es requerido.";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El formato de email no es válido.";
      hasError = true;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{7,}$/;
    if (!password) {
      newErrors.password = "La contraseña es requerida.";
      hasError = true;
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "La contraseña debe tener al menos 7 caracteres, una mayúscula y un número.";
      hasError = true;
    }

    const phoneRegex = /^[0-9]{10}$/;
    const cleanNumber = phone.replace(/[\s-()+\.]/g, "");
    if (!phone) {
      newErrors.phone = "El teléfono es requerido.";
      hasError = true;
    } else if (!phoneRegex.test(cleanNumber)) {
      newErrors.phone =
        "El teléfono (cód de área + número) debe tener 10 dígitos.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({
      name: null,
      surname: null,
      email: null,
      password: null,
      phone: null,
    });

    const newUser = {
      name,
      surname,
      email,
      phone: cleanNumber,
      password,
    };
    try {
      await api.post("/authentication/register", newUser);
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
                className={errors.name ? "border border-danger" : ""}
                placeholder="Ingrese su nombre"
                onChange={handleNameChange}
                value={name}
              />
              {errors.name && <p className="text-danger mt-1">{errors.name}</p>}
            </FormGroup>

            <FormGroup className="mb-3">
              <Form.Control
                type="text"
                className={errors.surname ? "border border-danger" : ""}
                placeholder="Ingrese su apellido"
                onChange={handleSurnameChange}
                value={surname}
              />
              {errors.surname && (
                <p className="text-danger mt-1">{errors.surname}</p>
              )}
            </FormGroup>

            <FormGroup className="mb-3">
              <Form.Control
                type="email"
                className={errors.email ? "border border-danger" : ""}
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
                type="tel"
                className={errors.phone ? "border border-danger" : ""}
                placeholder="Ingresar teléfono (Ej: 3411234567)"
                onChange={handlePhoneChange}
                value={phone}
              />
              {errors.phone && (
                <p className="text-danger mt-1">{errors.phone}</p>
              )}
            </FormGroup>
            <FormGroup className="mb-3">
              <Form.Control
                type="password"
                className={errors.password ? "border border-danger" : ""}
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
