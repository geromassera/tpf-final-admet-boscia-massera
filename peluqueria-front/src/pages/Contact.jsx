import { Card, Container, Row, Col } from "react-bootstrap";

const Contact = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Contacto</h2>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <Card.Text>
                <strong>📍 Dirección:</strong> Av. Francia 1375, Rosario, Santa
                Fé
              </Card.Text>
              <Card.Text>
                <strong>📞 Teléfono:</strong> +54 9 341 392 1175
              </Card.Text>
              <Card.Text>
                <strong>📧 Email:</strong> contacto@peluqueria.com
              </Card.Text>
              <Card.Text>
                <strong>🕘 Horarios:</strong>
                <br />
                Lunes a Sabados: 10:00 - 19:00
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
