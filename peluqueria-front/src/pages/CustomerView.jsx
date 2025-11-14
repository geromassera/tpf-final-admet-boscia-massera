import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 
import {
  successToast,
  errorToast,
} from "../components/ui/toast/NotificationToast";
import { AuthenticationContext } from "../components/services/auth.context";
import api from "../components/services/API/Axios";

const localImg1 = "/local-placeholder.png"; 
const localImg2 = "/local-placeholder-2.png";

const CostumerView = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthenticationContext);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const navigate = useNavigate(); 
  const [availableBarbers, setAvailableBarbers] = useState([]);
  const [availableTreatments, setAvailableTreatments] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);

  const [form, setForm] = useState({
    service: "",
    appointment_date: "",
    appointment_time: "",
    barber_id: "any",
  });

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const maxDateObj = new Date(today);
  maxDateObj.setMonth(maxDateObj.getMonth() + 1);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  useEffect(() => {
    const storedBranch = localStorage.getItem("selectedBranch");
    if (storedBranch) {
      setSelectedBranch(JSON.parse(storedBranch));
    } else {
      errorToast("Por favor, selecciona una sucursal primero."); 
      navigate("/branches"); 
    }
  }, [navigate]); 

   useEffect(() => {
    // Solo ejecutar si la sucursal ha sido cargada
    if (selectedBranch) {
      const fetchResources = async () => {
        setLoadingResources(true);
        try {
          // Hacemos ambas llamadas en paralelo
          const [barbersRes, treatmentsRes] = await Promise.all([
            api.get("/user/barbers"), // Endpoint público que trae TODOS los barberos
            api.get("/treatment")     // Endpoint (autenticado) que trae los servicios
          ]);
          
          // 1. Filtrar barberos por la sucursal seleccionada
          const filteredBarbers = barbersRes.data.filter(
            (barber) => barber.branchId === selectedBranch.branchId
          );
          setAvailableBarbers(filteredBarbers);

          // 2. Cargar servicios
          setAvailableTreatments(treatmentsRes.data);
          
        } catch (err) {
          errorToast(err.response?.data?.message || "Error al cargar barberos o servicios.");
        } finally {
          setLoadingResources(false);
        }
      };
      
      fetchResources();
    }
  }, [selectedBranch]);


  const fetchTurnosCliente = async () => {
    if (!user?.userId) {
      errorToast("No se pudo identificar al cliente.");
      setLoading(false);
      return;
    }
    try {
      const response = await api.get(`/appointments/my-appointments`);
      setTurnos(response.data);
    } catch (err) {
      errorToast(err.response?.data?.message || "Error al obtener los turnos.");
    } finally {
      setLoading(false);
    }
  };

  const cancelarTurno = async (appointmentId) => {
    try {
      await api.put(`/appointments/${appointmentId}/cancel`);
      successToast("Turno cancelado correctamente.");
      fetchTurnosCliente();
    } catch (err) {
      errorToast(err.response?.data?.message || "Error al cancelar el turno.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "appointment_date") {
      const dia = new Date(value).getDay();
      if (dia === 0) {
        errorToast(
          "No podés reservar un turno un domingo. El local está cerrado."
        );
        return;
      }
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.userId) {
      errorToast("No se pudo identificar al cliente.");
      return;
    }

    if (!selectedBranch) {
      errorToast("Debe seleccionar una sucursal para reservar.");
      return;
    }

    const appointmentData = {
        treatmentId: parseInt(form.service, 10), 
        barberId: parseInt(form.barber_id, 10), 
        branchId: selectedBranch.branchId, 
        appointmentDateTime: `${form.appointment_date}T${form.appointment_time}:00`, 
    };

    try {
      await api.post("/appointments", appointmentData);

      successToast("Turno creado correctamente.");
      setForm({
        service: "",
        appointment_date: "",
        appointment_time: "",
        barber_id: "any",
      });
      fetchTurnosCliente();
    } catch (err) {
      const message = err.response?.data?.message || "Error al crear el turno.";
      errorToast(message);
    }
  };

  useEffect(() => {
    if(user){ 
        fetchTurnosCliente();
    }
  }, [user]);

  const getBranchImage = (branchId) => {
    if (branchId === 1) return localImg1; 
    return localImg2; 
  };

  if (!selectedBranch) {
    return <p className="text-center mt-5">Redirigiendo a selección de sucursal...</p>;
  }

  const generarOpcionesHora = () => {
    const opciones = [];
    for (let h = 8; h <= 19; h++) {
      const horaStr = h.toString().padStart(2, "0");
      opciones.push(`${horaStr}:00`);
      if (h < 19) opciones.push(`${horaStr}:30`);
    }
    return opciones;
  };

  if (loading && turnos.length === 0) { 
    return (
        <Container className="mt-5">
            {/* Muestra la tarjeta de sucursal aunque los turnos estén cargando */}
            <Card className="mb-4 shadow-sm">
                {/* ... (Tarjeta de Sucursal) ... */}
            </Card>
            <p className="text-center mt-5">Cargando tus turnos...</p>
        </Container>
    );
  }


  const turnosVisibles = turnos.filter(
    (turno) => turno.status !== "Cancelado" && turno.status !== "Completed"
  );

  const displayBranch = selectedBranch ? `(${selectedBranch.name})` : "";

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow mb-4">
        <Card.Body>
          <h4 className="mb-3">Reservar nuevo turno {displayBranch}</h4>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3 align-items-end">
              <Col md={3}>
                <Form.Select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un servicio</option>
                  <option value="1">Corte</option>
                  <option value="2">Corte y barba</option>
                  <option value="3">Peinado</option>
                  <option value="4">Coloración</option>
                  <option value="5">Barba</option>
                </Form.Select>
              </Col>

              <Col md={2}>
                <Form.Control
                  type="date"
                  name="appointment_date"
                  value={form.appointment_date}
                  onChange={handleChange}
                  min={minDate}
                  max={maxDate}
                  required
                />
              </Col>

              <Col md={2}>
                <Form.Select
                  name="appointment_time"
                  value={form.appointment_time}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar hora</option>
                  {generarOpcionesHora().map((hora, idx) => (
                    <option key={idx} value={hora}>
                      {hora}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={3}>
                <Form.Select
                  name="barber_id" // Este es el 'userId' del barbero
                  value={form.barber_id}
                  onChange={handleChange}
                  required
                  disabled={loadingResources}
                >
                  <option value="">Selecciona un barbero</option>
                  {availableBarbers.length === 0 ? (
                    <option value="" disabled>No hay barberos en esta sucursal</option>
                  ) : (
                    availableBarbers.map(barber => (
                      <option key={barber.userId} value={barber.userId}>
                        {barber.name} {barber.surname}
                      </option>
                    ))
                  )}
                </Form.Select>
              </Col>

              <Col md={2}>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={!selectedBranch}
                >
                  Reservar
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="mb-4 shadow-sm">
        <Row className="g-0">
          <Col md={4}>
            <Image
              src={getBranchImage(selectedBranch.branchId)}
              fluid
              alt={selectedBranch.name}
              style={{ maxHeight: "200px", width: "100%", objectFit: "cover", borderRadius: "0.375rem 0 0 0.375rem" }}
            />
          </Col>
          <Col md={8}>
            <Card.Body className="d-flex flex-column justify-content-center h-100">
              <Card.Title>Estás reservando en:</Card.Title>
              <Card.Text as="h4" className="mb-1">{selectedBranch.name}</Card.Text>
              <Card.Text className="text-muted">
                {selectedBranch.address}
              </Card.Text>
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={() => navigate("/branches")} // [CORREGIDO] navigate ahora funciona
                className="mt-2"
                style={{ maxWidth: "180px" }} 
              >
                Cambiar Sucursal
              </Button>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      <Card className="p-4 shadow">
        <Card.Body>
          <h3 className="mb-4">Mis turnos</h3>
          {turnosVisibles.length === 0 ? (
            <p className="text-muted">No tenés turnos reservados.</p>
          ) : (
            <Row className="g-4">
              {turnosVisibles.map((turno) => (
                <Col md={4} key={turno.id}>
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <Card.Title className="mb-3">
                        Servicio: {turno.treatmentName}
                      </Card.Title>
                      <Card.Text>
                        <strong>Fecha y Hora:</strong>{" "}
                        {new Date(turno.appointmentDateTime).toLocaleString()}
                        <br />
                        <strong>Barbero:</strong> {turno.barberName}
                        <br />
                        <strong>Estado:</strong> {turno.status}
                      </Card.Text>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => cancelarTurno(turno.id)}
                      >
                        Cancelar
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

function isPastDate(dateStr) {
  const hoy = new Date();
  const fecha = new Date(dateStr);
  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);
  return fecha < hoy;
}

function isWithinOneMonth(dateStr) {
  const hoy = new Date();
  const fecha = new Date(dateStr);
  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);

  const max = new Date(hoy);
  max.setMonth(max.getMonth() + 1);

  return fecha <= max;
}

function isClosedDay(dateStr) {
  const fecha = new Date(dateStr);
  return fecha.getDay() === 0;
}

function isValidHour(timeStr) {
  const [hora, minutos] = timeStr.split(":").map(Number);
  return hora >= 10 && (hora < 19 || (hora === 19 && minutos === 0));
}

export default CostumerView;
