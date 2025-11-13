import { useEffect, useState } from "react";
import {
  Button,
  Table,
  Form,
  InputGroup,
  Container,
  Row,
  Col,
  ButtonGroup,
} from "react-bootstrap";
import {
  successToast,
  errorToast,
  infoToast,
} from "../components/ui/toast/NotificationToast";
import ConfirmAdminModal from "../components/ConfirmAdminModal";
import api from "../components/services/API/Axios";
import AssignBranchModal from "../components/AssignBranchModal";

const statusMap = {
  Completed: "Completado",
  Confirmed: "Confirmado",
  Cancelled: "Cancelado",
};

// --- Panel 1: Gestión de Usuarios ---
const UsersPanel = ({ onUserMadeBarber }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [filterText, setFilterText] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (err) {
      errorToast(
        err.response?.data?.message || "Error al obtener los usuarios."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangeRole = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { newRole });

      if (newRole === "Barber") {
        successToast(`Rol ${newRole} asignado correctamente.`);
        infoToast(
          "Recuerde asignarlo a una sucursal para que pueda empezar a recibir turnos."
        );
        onUserMadeBarber();
      } else {
        successToast(`Rol ${newRole} asignado correctamente.`);
        fetchUsers();
      }
    } catch (err) {
      console.log("Error al cambiar el rol:", err);
      errorToast(err.response?.data?.message || "Hubo un problema.");
    }
  };

  const handleConfirmAdmin = () => {
    if (selectedUserId) {
      handleChangeRole(selectedUserId, "Admin");
    }
    setShowAdminModal(false);
    setSelectedUserId(null);
  };

  if (loading) return <p>Cargando usuarios...</p>;

  const filteredUsers = users.filter((user) =>
    (user.surname || "").toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <>
      <h3>Gestión de Usuarios</h3>

      <Form.Group className="mb-3" controlId="userSearch">
        <Form.Label>Buscar por apellido:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingrese un apellido para filtrar..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </Form.Group>

      {filteredUsers.length === 0 ? (
        <p>No se encontraron usuarios con ese apellido.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.role === "Admin" ? (
                    <span className="text-muted fst-italic">
                      No se puede modificar
                    </span>
                  ) : (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleChangeRole(user.userId, "Barber")}
                        disabled={user.role === "Barber"}
                      >
                        Hacer Barbero
                      </Button>

                      <Button
                        variant="info"
                        size="sm"
                        className="ms-2"
                        onClick={() => handleChangeRole(user.userId, "Client")}
                        disabled={user.role === "Client"}
                      >
                        Hacer Cliente
                      </Button>

                      <Button
                        variant="warning"
                        size="sm"
                        className="ms-2"
                        onClick={() => {
                          setSelectedUserId(user.userId);
                          setShowAdminModal(true);
                        }}
                      >
                        Hacer Admin
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ConfirmAdminModal
        show={showAdminModal}
        handleClose={() => setShowAdminModal(false)}
        handleConfirm={handleConfirmAdmin}
      />
    </>
  );
};

// --- Panel 2: Gestión de Turnos ---
const AppointmentsPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/appointments/history");
      setAppointments(response.data);
    } catch (err) {
      errorToast(err.response?.data?.message || "Error al obtener los turnos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) return <p>Cargando turnos...</p>;

  return (
    <>
      <h3>Historial de Todos los Turnos</h3>
      {appointments.length === 0 ? (
        <p>No hay turnos registrados.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Cliente</th>
              <th>Barbero</th>
              <th>Sucursal</th>
              <th>Tratamiento</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => {
              const date = new Date(appt.appointmentDateTime);
              const formattedDate = date.toLocaleDateString("es-AR");
              const formattedTime = date.toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const translatedStatus = statusMap[appt.status] || appt.status;
              return (
                <tr key={appt.id}>
                  <td>{appt.id}</td>
                  <td>{formattedDate}</td>
                  <td>{formattedTime} hs.</td>
                  <td>{translatedStatus}</td>
                  <td>{appt.clientName}</td>
                  <td>{appt.barberName}</td>
                  <td>{appt.branchName}</td>
                  <td>{appt.treatmentName}</td>
                  <td>
                    {appt.status === "Cancelled" ? "-" : appt.treatmentPrice}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </>
  );
};

// --- Panel 3: Gestión de Tratamientos ---
const TreatmentsPanel = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newPrice, setNewPrice] = useState("");

  const fetchTreatments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/treatment");
      setTreatments(response.data);
    } catch (err) {
      errorToast(
        err.response?.data?.message || "Error al obtener tratamientos."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const handleEditClick = (treatment) => {
    setEditingId(treatment.treatmentId);
    setNewPrice(treatment.price);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewPrice("");
  };

  const handleSavePrice = async (treatmentId) => {
    const priceAsNumber = parseFloat(newPrice);

    if (isNaN(priceAsNumber) || priceAsNumber <= 0) {
      errorToast("Por favor, ingrese un precio válido.");
      return;
    }

    try {
      const bodyPayLoad = { newPrice: priceAsNumber };

      await api.patch(`/treatment/${treatmentId}`, bodyPayLoad);

      successToast("Precio actualizado.");
      fetchTreatments();
      handleCancelEdit();
    } catch (err) {
      console.error("Error al actualizar precio:", err);
      if (err.response?.status === 400 && err.response.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat();
        errorToast(validationErrors[0] || "Error de validación.");
      } else {
        const message =
          err.response?.data?.message || "Error al actualizar precio.";
        errorToast(message);
      }
    }
  };

  if (loading) return <p>Cargando tratamientos...</p>;

  return (
    <>
      <h3>Gestión de Tratamientos</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {treatments.map((t) => (
            <tr key={t.treatmentId}>
              <td>{t.treatmentId}</td>
              <td>{t.name}</td>
              <td>
                {editingId === t.treatmentId ? (
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                    />
                  </InputGroup>
                ) : (
                  `$ ${t.price}`
                )}
              </td>
              <td>
                {editingId === t.treatmentId ? (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleSavePrice(t.treatmentId)}
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="ms-2"
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEditClick(t)}
                  >
                    Editar Precio
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>{" "}
    </>
  );
};

// --- Panel 4: Asignación de Barberos ---
const BarberAssignmentsPanel = () => {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersResponse, branchesResponse] = await Promise.all([
        api.get("/admin/users"),
        api.get("/branch"), 
      ]);
      setUsers(usersResponse.data);
      setBranches(branchesResponse.data);
    } catch (err) {
      errorToast(err.response?.data?.message || "Error al obtener datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (barber) => {
    setSelectedBarber(barber);
    setShowModal(true);
  };

  const handleSaveSuccess = () => {
    successToast("Barbero asignado correctamente.");
    fetchData();
  };

  if (loading) return <p>Cargando datos...</p>;

  const barbers = users.filter((user) => user.role === "Barber");

  return (
    <>
      <h3>Asignación de Barberos</h3>
      <p>Asigne o cambie la sucursal de trabajo de cada barbero.</p>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Barbero</th>
            <th>Sucursal Actual</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {barbers.length === 0 ? (
            <tr>
              <td colSpan="3">No hay usuarios con el rol "Barber".</td>
            </tr>
          ) : (
            barbers.map((barber) => {
              const assignedBranch = branches.find(
                (b) => b.branchId == barber.branchId
              );
              const branchName = assignedBranch?.name || (
                <span className="text-danger fst-bold">
                  Sin Asignar (¡No podrá ser seleccionado para turnos!)
                </span>
              );

              return (
                <tr key={barber.userId}>
                  <td>
                    {barber.name} {barber.surname}
                  </td>
                  <td>{branchName}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleOpenModal(barber)}
                    >
                      {barber.branchId ? "Cambiar" : "Asignar"}
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      {selectedBarber && (
        <AssignBranchModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          barber={selectedBarber}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </>
  );
};

const CurriculumsPanel = () => {
  const [curriculums, setCurriculums] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCurriculums = async () => {
    try {
      setLoading(true);
      // Endpoint para obtener la lista de postulaciones
      const response = await api.get("/admin/curriculums"); 
      setCurriculums(response.data);
    } catch (err) {
      errorToast(
        err.response?.data?.message || "Error al obtener los currículums."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculums();
  }, []);

  const handleDownload = async (curriculumId, originalFileName) => {
    try {
      // Endpoint seguro para descargar y marcar como visto
      const response = await api.get(
        `/admin/curriculum/${curriculumId}/download`,
        {
          responseType: "blob", // Importante para manejar archivos binarios
        }
      );

      // Crea un objeto URL para el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      // Utiliza el nombre original del archivo
      link.setAttribute("download", originalFileName); 
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      successToast("CV descargado. Marcado como visto.");
      
      // Actualiza la lista para reflejar el estado "Visto"
      fetchCurriculums(); 
    } catch (err) {
      errorToast("Error al descargar el CV.");
    }
  };

  if (loading) return <p>Cargando postulaciones...</p>;

  return (
    <>
      <h3>Gestión de Curriculums</h3>
      {curriculums.length === 0 ? (
        <p>No hay postulaciones de CV registradas.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Fecha</th>
              <th>Archivo</th>
              <th>Visto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {curriculums.map((cv) => (
              <tr key={cv.id}>
                <td>{cv.id}</td>
                <td>
                  {cv.name} {cv.surname}
                </td>
                <td>{cv.email}</td>
                <td>{new Date(cv.uploadDate).toLocaleDateString()}</td>
                <td>{cv.fileName}</td>
                <td>
                  <span
                    className={`badge ${
                      cv.isReviewed ? "bg-success" : "bg-warning text-dark"
                    }`}
                  >
                    {cv.isReviewed ? "Sí" : "No"}
                  </span>
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleDownload(cv.id, cv.fileName)}
                  >
                    Descargar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

// --- COMPONENTE PRINCIPAL (Panel de Admin) ---
const AdminPanel = () => {
  const [activeView, setActiveView] = useState("users");

  const renderView = () => {
    switch (activeView) {
      case "users":
        return (
          <UsersPanel onUserMadeBarber={() => setActiveView("assignments")} />
        );
      case "appointments":
        return <AppointmentsPanel />;
      case "treatments":
        return <TreatmentsPanel />;
      case "assignments":
        return <BarberAssignmentsPanel />;
      case "curriculums": // <-- NUEVO CASE
        return <CurriculumsPanel />;
      default:
        return (
          <UsersPanel onUserMadeBarber={() => setActiveView("assignments")} />
        );
    }
  };

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h2>Panel de Administración</h2>{" "}
          <ButtonGroup className="mb-4">
            <Button
              variant={activeView === "users" ? "primary" : "outline-primary"}
              onClick={() => setActiveView("users")}
            >
              Gestión de Usuarios
            </Button>
            <Button
              variant={
                activeView === "assignments" ? "primary" : "outline-primary"
              }
              onClick={() => setActiveView("assignments")}
            >
              Asignar Barberos
            </Button>
            <Button
              variant={
                activeView === "appointments" ? "primary" : "outline-primary"
              }
              onClick={() => setActiveView("appointments")}
            >
              Ver Todos los Turnos
            </Button>
            <Button
              variant={
                activeView === "treatments" ? "primary" : "outline-primary"
              }
              onClick={() => setActiveView("treatments")}
            >
              Gestión de Tratamientos
            </Button>
            {/* <-- NUEVO BOTÓN --> */}
            <Button
              variant={
                activeView === "curriculums" ? "primary" : "outline-primary"
              }
              onClick={() => setActiveView("curriculums")}
            >
              Gestión de Curriculums
            </Button>
          </ButtonGroup>
          {renderView()}
        </Col>
      </Row>
    </Container>
  );
};
export default AdminPanel;