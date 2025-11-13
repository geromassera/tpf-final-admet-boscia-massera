import { useEffect, useState, useMemo } from "react";
import {
  Button,
  Table,
  Form,
  InputGroup,
  Container,
  Row,
  Col,
  Card,
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

// --- Panel 2: Gestión de Turnos y Estadísticas---
const AppointmentsPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterBranchId, setFilterBranchId] = useState("");
  const [statsMonth, setStatsMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const fetchInitalData = async () => {
    try {
      setLoading(true);
      const [appointmentsResponse, branchesResponse] = await Promise.all([
        api.get("/appointments/history"),
        api.get("/branches"),
      ]);
      setAppointments(appointmentsResponse.data);
      setBranches(branchesResponse.data);
    } catch (err) {
      errorToast(
        err.response?.data?.message ||
          "Error al obtener los turnos o sucursales."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitalData();
  }, []);

  const statistics = useMemo(() => {
    const [year, month] = statsMonth.split("-").map(Number);

    const monthlyAppointments = appointments.filter((appt) => {
      const apptDate = new Date(appt.appointmentDateTime);
      return (
        apptDate.getFullYear() === year && apptDate.getMonth() + 1 === month
      );
    });

    const completedAppointments = monthlyAppointments.filter(
      (appt) => appt.status === "Completed"
    );
    const totalEarnings = completedAppointments.reduce(
      (sum, appt) => sum + appt.price,
      0
    );
    const barberCounts = completedAppointments.reduce((acc, appt) => {
      const name = appt.barberName || "N/D";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});
    const topBarbers = Object.entries(barberCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
    const treatmentCounts = completedAppointments.reduce((acc, appt) => {
      const name = appt.treatmentName || "N/D";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});
    const topTreatments = Object.entries(treatmentCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return { totalEarnings, topBarbers, topTreatments };
  }, [appointments, statsMonth]);

  const filteredTableAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const selectedBranch = branches.find(
        (b) => b.branchId.toString() === filterBranchId
      );
      const branchMatch =
        !filterBranchId || appt.branchName === (selectedBranch?.name || "");
      const apptDate = new Date(appt.appointmentDateTime)
        .toISOString()
        .split("T")[0];
      const dateMatch = !filterDate || apptDate === filterDate;
      return branchMatch && dateMatch;
    });
  }, [appointments, filterDate, filterBranchId, branches]);

  const handleStatsMonthChange = (direction) => {
    const currentDate = new Date(statsMonth + "-02");
    currentDate.setMonth(currentDate.getMonth() + direction);
    setStatsMonth(currentDate.toISOString().slice(0, 7));
  };
  const handleClearTableFilters = () => {
    setFilterDate("");
    setFilterBranchId("");
  };

  if (loading) return <p>Cargando turnos...</p>;

  return (
    <>
      <h3 className="mb-4">Estadísticas Mensuales</h3>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Seleccionar Mes para Estadísticas</Form.Label>
            <InputGroup>
              <Button
                variant="outline-secondary"
                onClick={() => handleStatsMonthChange(-1)}
              >
                {"< Mes Ant."}
              </Button>
              <Form.Control
                type="month"
                value={statsMonth}
                onChange={(e) => setStatsMonth(e.target.value)}
              />
              <Button
                variant="outline-secondary"
                onClick={() => handleStatsMonthChange(1)}
              >
                {"Mes Sig. >"}
              </Button>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm h-100">
            <Card.Header className="fw-bold">
              Ganancias (Completados)
            </Card.Header>
            <Card.Body>
              <Card.Text className="fs-3 fw-bold">
                $ {statistics.totalEarnings.toLocaleString("es-AR")}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="text-center fw-bold">
              Top 3 Barberos (Completados)
            </Card.Header>
            <Card.Body>
              <ol style={{ paddingLeft: "20px" }}>
                {statistics.topBarbers.map((barber) => (
                  <li key={barber.name}>
                    {barber.name} ({barber.count} turnos)
                  </li>
                ))}
              </ol>
              {statistics.topBarbers.length === 0 && (
                <p className="text-muted text-center m-0">Sin datos</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="text-center fw-bold">
              Top 3 Tratamientos (Completados)
            </Card.Header>
            <Card.Body>
              <ol style={{ paddingLeft: "20px" }}>
                {statistics.topTreatments.map((treatment) => (
                  <li key={treatment.name}>
                    {treatment.name} ({treatment.count} turnos)
                  </li>
                ))}
              </ol>
              {statistics.topTreatments.length === 0 && (
                <p className="text-muted text-center m-0">Sin datos</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <hr className="my-5" />
      <h3 className="mb-4">Detalle de Turnos</h3>
      <Form as={Row} className="mb-4 g-3 bg-light p-3 border rounded">
        <Form.Group as={Col} md="4" controlId="filterAppointmentDate">
          <Form.Label>Filtrar por Fecha (Día)</Form.Label>
          <Form.Control
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="filterBranch">
          <Form.Label>Filtrar por Sucursal</Form.Label>
          <Form.Select
            value={filterBranchId}
            onChange={(e) => setFilterBranchId(e.target.value)}
          >
            <option value="">Todas las Sucursales</option>
            {branches.map((branch) => (
              <option key={branch.branchId} value={branch.branchId}>
                {branch.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Col md="4" className="d-flex align-items-end">
          <Button variant="outline-secondary" onClick={handleClearTableFilters}>
            Limpiar Filtros de Tabla
          </Button>
        </Col>
      </Form>

      {filteredTableAppointments.length === 0 ? (
        <p>
          No hay turnos registrados que coincidan con los filtros de la tabla.
        </p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
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
            {filteredTableAppointments.map((appt) => {
              const date = new Date(appt.appointmentDateTime);
              const formattedDate = date.toLocaleDateString("es-AR");
              const formattedTime = date.toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const translatedStatus = statusMap[appt.status] || appt.status;

              return (
                <tr key={appt.id}>
                  <td>{formattedDate}</td>
                  <td>{formattedTime} hs.</td>
                  <td>{translatedStatus}</td>
                  <td>{appt.clientName}</td>
                  <td>{appt.barberName}</td>
                  <td>{appt.branchName}</td>
                  <td>{appt.treatmentName}</td>
                  <td>
                    {appt.status === "Cancelled" ? "-" : `$ ${appt.price}`}
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
        api.get("/branches"),
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

// --- Panel 5: Curriculums ---
const CurriculumsPanel = () => {
  const [curriculums, setCurriculums] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  const fetchCurriculums = async () => {
    try {
      setLoading(true);
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
      const response = await api.get(
        `/admin/curriculum/${curriculumId}/download`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", originalFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      successToast("CV descargado. Marcado como visto.");

      fetchCurriculums();
    } catch (err) {
      errorToast("Error al descargar el CV.");
    }
  };
  const clearFilters = () => {
    setFilterStatus("all");
    setFilterDate("");
  };

  const filteredCurriculums = curriculums.filter((cv) => {
    const statusMatch =
      filterStatus === "all" ||
      (filterStatus === "reviewed" && cv.isReviewed) ||
      (filterStatus === "unreviewed" && !cv.isReviewed);

    const dateMatch =
      !filterDate ||
      new Date(cv.uploadDate).toISOString().startsWith(filterDate);

    return statusMatch && dateMatch;
  });

  if (loading) return <p>Cargando postulaciones...</p>;

  return (
    <>
      <h3 className="mb-4">Gestión de Curriculums</h3>

      <Form as={Row} className="mb-3 g-3 bg-light p-3 border rounded">
        <Form.Group as={Col} md="4" controlId="filterStatus">
          <Form.Label>Filtrar por Visto</Form.Label>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="reviewed">Visto</option>
            <option value="unreviewed">No Visto</option>
          </Form.Select>
        </Form.Group>

        <Form.Group as={Col} md="4" controlId="filterDate">
          <Form.Label>Filtrar por Fecha de Subida</Form.Label>
          <Form.Control
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </Form.Group>

        <Col md="4" className="d-flex align-items-end">
          <Button variant="outline-secondary" onClick={clearFilters}>
            Limpiar Filtros
          </Button>
        </Col>
      </Form>

      {filteredCurriculums.length === 0 ? (
        <p>No hay postulaciones que coincidan con los filtros seleccionados.</p>
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
            {filteredCurriculums.map((cv) => (
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
      case "curriculums":
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
              Turnos y Estadísticas
            </Button>
            <Button
              variant={
                activeView === "treatments" ? "primary" : "outline-primary"
              }
              onClick={() => setActiveView("treatments")}
            >
              Gestión de Tratamientos
            </Button>
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
