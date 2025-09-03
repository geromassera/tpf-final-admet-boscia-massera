import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3">
          <span className="text-danger">¡Oops!</span> Página no encontrada.
        </p>
        <p className="lead">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <Button variant="primary" onClick={handleGoHome} className="mt-3">
          Volver al inicio
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;
