import { Card, Container, Row, Col } from "react-bootstrap";

const services = [
  {
    name: "Corte",
    description: "Corte clásico o moderno adaptado a tu estilo.",
    price: "$4.500",
    image: "/service-img-1.png",
  },
  {
    name: "Corte y barba",
    description: "Look completo con corte de cabello y perfilado de barba.",
    price: "$6.500",
    image: "/service-img-2.png",
  },
  {
    name: "Peinado",
    description: "Peinados para eventos o el día a día.",
    price: "$3.000",
    image: "/service-img-3.png",
  },
  {
    name: "Coloración",
    description: "Color vibrante y duradero, incluye asesoramiento.",
    price: "$8.000",
    image: "/service-img-4.png",
  },
  {
    name: "Barba",
    description: "Afeitado, perfilado y cuidado con productos de calidad.",
    price: "$2.500",
    image: "/service-img-5.png",
  },
];

const Services = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Nuestros Servicios</h2>
      <Row>
        {services.map((service, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={service.image}
                alt={service.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{service.name}</Card.Title>
                <Card.Text>{service.description}</Card.Text>
                <Card.Text>
                  <strong>Precio: {service.price}</strong>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Services;
