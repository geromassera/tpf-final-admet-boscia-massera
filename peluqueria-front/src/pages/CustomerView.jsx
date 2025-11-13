import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { successToast, errorToast } from "../components/ui/toast/NotificationToast";
import { AuthenticationContext } from "../components/services/auth.context";
import api from "../components/services/API/Axios";

const CostumerView = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthenticationContext);

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [availableHours, setAvailableHours] = useState([]);

  const [form, setForm] = useState({
    service: "",
    appointment_date: "",
    appointment_time: "",
    barber_id: ""
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
    }
  }, []);

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

  useEffect(() => {
    fetchTurnosCliente();
  }, [user]);

  useEffect(() => {
    const fetchBarbers = async () => {
      if (!selectedBranch?.branchId) {
        setBarbers([]);
        return;
      }
      try {
        const response = await api.get("appointments/barbers", {
          params: { branchId: selectedBranch.branchId }
        });
        setBarbers(response.data || []);
      } catch (err) {
        console.error("Error al obtener barberos:", err);
        errorToast(err.response?.data?.message || "Error al cargar barberos.");
        setBarbers([]);
      }
    };
    fetchBarbers();
  }, [selectedBranch]);

  useEffect(() => {
    const fetchAvailableHours = async () => {
      if (!selectedBranch?.branchId || !form.appointment_date || !form.barber_id) {
        setAvailableHours([]);
        return;
      }
      try {
        const response = await api.get("/appointments/availability", {
          params: {
            branchId: selectedBranch.branchId,
            date: form.appointment_date,
            barberId: form.barber_id
          }
        });
        setAvailableHours(response.data || []);
      } catch (err) {
        console.error("Error al cargar horas disponibles:", err);
        setAvailableHours([]);
      }
    };
    fetchAvailableHours();
  }, [selectedBranch, form.appointment_date, form.barber_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "appointment_date") {
      const dia = new Date(value).getDay();
      if (dia === 0) {
        errorToast("No podés reservar un turno un domingo. El local está cerrado.");
        return;
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "appointment_date" || name === "barber_id"
        ? { appointment_time: "" }
        : {})
    }));
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

    if (!form.service || !form.appointment_date || !form.appointment_time || !form.barber_id) {
      errorToast("Completa todos los campos del turno.");
      return;
    }

    const appointmentData = {
      treatmentId: parseInt(form.service, 10),
      barberId: parseInt(form.barber_id, 10),
      branchId: selectedBranch.branchId,
      appointmentDateTime: form.appointment_time
    };

    try {
      await api.post("/appointments", appointmentData);
      successToast("Turno creado correctamente.");
      setForm({
        service: "",
        appointment_date: "",
        appointment_time: "",
        barber_id: ""
      });
      setAvailableHours([]);
      fetchTurnosCliente();
    } catch (err) {
      const message = err.response?.data?.message || "Error al crear el turno.";
      errorToast(message);
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Cargando tus turnos...</p>;
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

              <Col md={3}>
                <Form.Select
                  name="barber_id"
                  value={form.barber_id}
                  onChange={handleChange}
                  required
                  disabled={!selectedBranch || barbers.length === 0}
                >
                  <option value="">Seleccionar barbero</option>
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
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
                  disabled={availableHours.length === 0}
                >
                  <option value="">Seleccionar hora</option>
                  {availableHours.map((h, idx) => {
                    const dateObj = new Date(h);
                    const label = dateObj.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    });
                    return (
                      <option key={idx} value={h}>
                        {label}
                      </option>
                    );
                  })}
                </Form.Select>
              </Col>

              <Col md={2}>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={
                    !selectedBranch ||
                    !form.service ||
                    !form.appointment_date ||
                    !form.appointment_time ||
                    !form.barber_id
                  }
                >
                  Reservar
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
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

export default CostumerView;

