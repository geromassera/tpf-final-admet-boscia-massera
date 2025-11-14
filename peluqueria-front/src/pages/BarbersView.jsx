import { useEffect, useState, useContext } from "react";
import { Button, Table, Form, Row, Col } from "react-bootstrap";
import {
  successToast,
  errorToast,
} from "../components/ui/toast/NotificationToast";
import { AuthenticationContext } from "../components/services/auth.context";
import api from "../components/services/API/Axios";

const BarberView = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthenticationContext);
  
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Si filterDate tiene un valor, se añade como parámetro de consulta 'date'
      const dateQuery = filterDate ? `?date=${filterDate}` : '';
      
      // Llamada al endpoint con el parámetro de fecha opcional
      const response = await api.get(`/appointments/barber/schedule${dateQuery}`);
      
      setAppointments(response.data); 
      
    } catch (err) {
      errorToast(err.response?.data?.message || "Error al obtener turnos.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await api.put(`/appointments/${appointmentId}/cancel`);
      
      successToast("Turno cancelado correctamente.");
      fetchAppointments();
    } catch (err) {
      errorToast(err.response?.data?.message || "Error al cancelar el turno.");
    }
  };
  
  // Vuelve a cargar los turnos cada vez que filterDate cambia
  useEffect(() => {
    fetchAppointments();
  }, [filterDate]);

  const handleClearFilter = () => {
    // Si el filtro se limpia, vuelve a la fecha de hoy por defecto.
    setFilterDate(new Date().toISOString().split('T')[0]);
  };

  const assignedAppointments = appointments;

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <p>Cargando tu agenda...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Mi Agenda de Turnos</h3>

      {/* [NUEVO] Controles de Filtros */}
      <Form as={Row} className="mb-4 g-3 bg-light p-3 border rounded">
        <Form.Group as={Col} md="8" controlId="filterAppointmentDate">
          <Form.Label>Filtrar por Fecha de Turno</Form.Label>
          <Form.Control 
            type="date" 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </Form.Group>
        
        <Col md="4" className="d-flex align-items-end">
          <Button variant="outline-secondary" onClick={handleClearFilter}>
            Hoy / Limpiar Filtro
          </Button>
        </Col>
      </Form>
      
      {/* Fin Controles de Filtros */}

      {assignedAppointments.length === 0 ? (
        <p>Sin turnos asignados o confirmados en tu agenda para la fecha seleccionada.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Servicio</th>
              <th>Fecha y Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {assignedAppointments.map((appt) => (
              <tr key={appt.id}> 
                <td>{appt.clientName}</td>
                <td>{appt.clientPhone}</td>
                <td>{appt.treatmentName}</td>
                <td>{new Date(appt.appointmentDateTime).toLocaleString()}</td> 
                <td>{appt.status}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleCancelAppointment(appt.id)}
                  >
                    Cancelar turno
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default BarberView;
