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

    const dtoToSend = {
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      phone: formData.phone,
    };

    if (formData.password) {
      dtoToSend.password = formData.password;
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
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSurname">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Nueva contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Dejar en blanco para mantener la actual"
                    value={formData.password}
                    onChange={handleChange}
                  />
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
