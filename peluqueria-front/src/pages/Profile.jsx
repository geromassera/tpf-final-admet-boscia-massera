import { useContext, useState, useEffect } from "react";
import { AuthenticationContext } from "../components/services/auth.context";
import { Form, Button, Container, Card } from "react-bootstrap";
import {
  successToast,
  errorToast,
} from "../components/ui/toast/NotificationToast";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";
import api from "../components/services/API/Axios";

const Profile = () => {
  const { user, handleUserUpdate, handleUserLogout } = useContext(
    AuthenticationContext
  );
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: null,
    surname: null,
    email: null,
    phone: null,
    password: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        surname: user.surname || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDelete = async () => {
    try {
      await api.delete("/user/me");
      successToast("Cuenta eliminada correctamente.");
      handleUserLogout();
      navigate("/");
    } catch (err) {
      errorToast(err.response?.data?.message || "Error al eliminar cuenta");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { name: null, surname: null, email: null, phone: null };
    const dtoToSend = {};

    if (formData.name && formData.name.length > 25) {
      newErrors.name = "El nombre debe tener menos de 25 caracteres.";
      hasError = true;
    } else if (formData.name) {
      dtoToSend.name = formData.name;
    }

    if (formData.surname && formData.surname.length > 25) {
      newErrors.surname = "El apellido debe tener menos de 25 caracteres.";
      hasError = true;
    } else if (formData.surname) {
      dtoToSend.surname = formData.surname;
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido.";
      hasError = true;
    } else if (formData.email) {
      dtoToSend.email = formData.email;
    }

    const phoneRegex = /^[0-9]{10}$/;
    const cleanNumber = formData.phone.replace(/[\s-()+\.]/g, "");

    if (formData.phone && !phoneRegex.test(cleanNumber)) {
      newErrors.phone =
        "El teléfono (cód. de área + número) debe tener 10 dígitos.";
      hasError = true;
    } else if (formData.phone) {
      dtoToSend.phone = cleanNumber;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{7,}$/;
    if (formData.password) {
      if (!passwordRegex.test(formData.password)) {
        newErrors.password =
          "La contraseña debe tener al menos 7 caracteres, una letra mayúscula y un número.";
        hasError = true;
      } else {
        dtoToSend.password = formData.password;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({
      name: null,
      surname: null,
      email: null,
      phone: null,
      password: null,
    });

    if (Object.keys(dtoToSend).length === 0) {
      errorToast("No se detectaron cambios para guardar.");
      setEditMode(false);
      return;
    }

    try {
      const response = await api.put("/user/me", dtoToSend);

      const updatedUser = response.data;
      handleUserUpdate(updatedUser);

      successToast("Perfil actualizado correctamente.");
      setEditMode(false);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      if (err.response?.status === 400 && err.response.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat();
        errorToast(validationErrors[0] || "Error de validación.");
      } else {
        // Tu lógica de antes
        const message =
          err.response?.data?.message || "Error al actualizar perfil.";
        errorToast(message);
      }
    }
  };

  return (
    <>
      <ConfirmDeleteModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={() => {
          setShowDeleteModal(false);
          handleDelete();
        }}
      />

      <Container className="my-5">
        <Card className="shadow">
          <Card.Body>
            <Card.Title>Mi Perfil</Card.Title>
            <Card.Text>
              <strong>Nombre</strong> {user.name} <br />
              <strong>Apellido:</strong> {user?.surname} <br />
              <strong>Email:</strong> {user.email} <br />
              <strong>Teléfono:</strong> {user?.phone} <br />
            </Card.Text>

            {!editMode ? (
              <>
                <Button
                  variant="outline-primary"
                  onClick={() => setEditMode(true)}
                  className="me-2"
                >
                  Editar perfil
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Eliminar cuenta
                </Button>
              </>
            ) : (
              <Form onSubmit={handleSubmit} className="mt-4">
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    className={errors.name ? "border border-danger" : ""}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Dejar en blanco para mantener el actual"
                  />
                  {errors.name && (
                    <p className="text-danger mt-1">{errors.name}</p>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSurname">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="surname"
                    className={errors.surname ? "border border-danger" : ""}
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder="Dejar en blanco para mantener el actual"
                  />
                  {errors.surname && (
                    <p className="text-danger mt-1">{errors.surname}</p>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    className={errors.email ? "border border-danger" : ""}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Dejar en blanco para mantener el actual"
                  />
                  {errors.email && (
                    <p className="text-danger mt-1">{errors.email}</p>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    className={errors.phone ? "border border-danger" : ""}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Dejar en blanco para mantener el actual"
                  />
                  {errors.phone && (
                    <p className="text-danger mt-1">{errors.phone}</p>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Nueva contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    className={errors.password ? "border border-danger" : ""}
                    placeholder="Dejar en blanco para mantener la actual"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <p className="text-danger mt-1">{errors.password}</p>
                  )}
                </Form.Group>

                <Button variant="success" type="submit" className="me-2">
                  Guardar cambios
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({ ...formData, password: "" });
                  }}
                >
                  Cancelar
                </Button>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Profile;
