import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { useContext } from "react";
import { AuthenticationContext } from "../components/services/auth.context";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthenticationContext);

  const renderBotonPorRol = () => {
    if (!user) return null;

    switch (user.role) {
      case "Customer":
        return (
          <Button
            variant="success"
            size="lg"
            onClick={() => navigate("/appointments")}
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
          </>
        )}
      </div>

      <Row className="mt-5">
        <Col md={4} className="mb-4">
          <Card>
            <Card.Img variant="top" src="./cortepelo.jpg" />
            <Card.Body>
              <Card.Title>Cortes Modernos</Card.Title>
              <Card.Text>Los últimos estilos en cortes de cabello.</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card>
            <Card.Img variant="top" src="./coloracion.jpg" />
            <Card.Body>
              <Card.Title>Coloración Profesional</Card.Title>
              <Card.Text>
                Técnicas avanzadas de coloración y tratamientos capilares.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card>
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
