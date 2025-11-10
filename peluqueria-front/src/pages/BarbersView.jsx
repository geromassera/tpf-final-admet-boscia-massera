import { useEffect, useState, useContext } from "react";
import { Button, Table } from "react-bootstrap";
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

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get("/appointments/barber/schedule");
      
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

  useEffect(() => {
    fetchAppointments();
  }, []);

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
      <h3>Mi Agenda de Turnos</h3>
      {assignedAppointments.length === 0 ? (
        <p>Sin turnos asignados o confirmados en tu agenda.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Cliente</th>
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
