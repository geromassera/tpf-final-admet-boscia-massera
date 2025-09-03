import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-light py-3 mt-4 border-top">
      <Container>
        <Row className="justify-content-center">
          <Col xs="auto">
            <p className="mb-0 text-center">
              &copy; 2025 HairSync. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
