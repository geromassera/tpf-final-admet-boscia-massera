import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../components/services/auth.context";
import api from "../components/services/API/Axios";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthenticationContext);

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const renderBotonPorRol = () => {
    if (!user) return null;

    switch (user.role) {
      case "Client":
        return (
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/branches")}
          >
            Sacar turno
          </Button>
        );
      case "Admin":
        return (
          <Button
            variant="warning"
            size="lg"
            onClick={() => navigate("/admin")}
          >
            Ir a panel de administración
          </Button>
        );
      case "Barber":
        return (
          <Button
            variant="info"
            size="lg"
            onClick={() => navigate("/barbersView")}
          >
            Ver turnos
          </Button>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!isLoggedIn || !user || user.role !== "Client") {
        setAppointments([]);
        return;
      }

      try {
        setLoadingAppointments(true);
        const response = await api.get("/appointments/my-appointments");
        setAppointments(response.data || []);
      } catch (error) {
        console.error("Error al obtener turnos del cliente:", error);
        setAppointments([]);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [isLoggedIn, user]);

  const turnosVisibles = appointments.filter(
    (turno) => turno.status !== "Cancelado" && turno.status !== "Completed"
  );

  const proximosTurnos = turnosVisibles.slice(0, 3);

  return (
    <Container className="mt-5">
      <div className="bg-light p-5 rounded-lg m-3 text-center shadow">
        {!isLoggedIn ? (
          <>
            <h1 className="display-4">Bienvenido a HairSync</h1>
            <p className="lead">
              Servicios profesionales de belleza y cuidado capilar
            </p>
            <hr className="my-4" />
            <p>Ingresa para reservar tu cita ahora</p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/login")}
              className="mt-3"
            >
              Ingresar
            </Button>
          </>
        ) : (
          <>
            <h2 className="display-5 mb-4">
              ¡Hola, {user.name}! ¿Qué querés hacer hoy?
            </h2>
            {renderBotonPorRol()}

            {user.role === "Client" && (
              <div className="mt-5 text-start">
                <h4 className="mb-3">Mis próximos turnos</h4>
                {loadingAppointments ? (
                  <p>Cargando turnos...</p>
                ) : proximosTurnos.length === 0 ? (
                  <p className="text-muted">
                    No tenés turnos reservados. ¡Sacá uno desde el botón de arriba!
                  </p>
                ) : (
                  <Row className="g-3">
                    {proximosTurnos.map((turno) => {
                      const precio =
                        turno.price ??
                        "";

                      return (
                        <Col md={4} key={turno.id}>
                          <Card className="h-100 shadow-sm">
                            <Card.Body>
                              <Card.Text>
                                <strong>Fecha y hora:</strong>{" "}
                                {new Date(
                                  turno.appointmentDateTime
                                ).toLocaleString()}
                                <br />
                                <strong>Estado:</strong> {turno.status}
                                <br />
                                <strong>Barbero:</strong> {turno.barberName}
                                <br />
                                <strong>Precio:</strong> ${precio !== "" ? precio : "N/D"}
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                )}
                <div className="mt-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate("/appointments")}
                  >
                    Ver todos mis turnos
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Row className="mt-5">
        <Col md={4} className="mb-4 d-flex">
          <Card className="h-100">
            <Card.Img variant="top" src="./cortepelo.jpg" />
            <Card.Body>
              <Card.Title>Cortes Modernos</Card.Title>
              <Card.Text>Los últimos estilos en cortes de cabello.</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4 d-flex">
          <Card className="h-100">
            <Card.Img variant="top" src="./coloracion.jpg" />
            <Card.Body>
              <Card.Title>Coloración Profesional</Card.Title>
              <Card.Text>
                Técnicas avanzadas de coloración y tratamientos capilares.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4 d-flex">
          <Card className="h-100">
            <Card.Img variant="top" src="./hombrebarba.jpg" />
            <Card.Body>
              <Card.Title>Barba</Card.Title>
              <Card.Text>Estilos más modernos en cortes de barba.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="text-center mt-4 mb-5">
        <Button
          variant="outline-secondary"
          onClick={() => navigate("/services")}
          className="me-3"
        >
          Ver todos los servicios
        </Button>
        <Button variant="outline-primary" onClick={() => navigate("/contact")}>
          Contacto
        </Button>
      </div>
    </Container>
  );
};

export default Home;
