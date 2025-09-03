import { useContext, useState } from "react";
import { AuthenticationContext } from "../components/services/auth.context";
import { Form, Button, Container, Card } from "react-bootstrap";
import {
  successToast,
  errorToast,
} from "../components/ui/toast/NotificationToast";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, handleUserLogin, handleUserLogout } = useContext(
    AuthenticationContext
  ); 
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/users/${user.user_id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar cuenta");

      successToast("Cuenta eliminada correctamente");
      handleUserLogout();
      navigate("/");
    } catch (err) {
      errorToast(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/users/${user.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al actualizar perfil");
      }

      const updatedUser = await res.json();
      handleUserLogin(updatedUser.user);
      successToast("Perfil actualizado con éxito");
      setEditMode(false);
    } catch (err) {
      errorToast(err.message);
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
              <strong>Nombre y apellido:</strong> {user.name} <br />
              <strong>Email:</strong> {user.email} <br />
              <strong>Rol:</strong> {user.role}
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
                  <Form.Label>Nombre y apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
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
