import { Card, Container, Row, Col, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import api from "../components/services/API/Axios";
import { errorToast } from "../components/ui/toast/NotificationToast";

const staticServiceDetails = {
  Corte: {
    description: "Corte clásico o moderno adaptado a tu estilo.",
    image: "/service-img-1.png",
  },
  "Corte y Barba": {
    description: "Look completo con corte de cabello y perfilado de barba.",
    image: "/service-img-2.png",
  },
  Peinado: {
    description: "Peinados para eventos o el día a día.",
    image: "/service-img-3.png",
  },
  Coloración: {
    description: "Color vibrante y duradero, incluye asesoramiento.",
    image: "/service-img-4.png",
  },
  Barba: {
    description: "Afeitado, perfilado y cuidado con productos de calidad.",
    image: "/service-img-5.png",
  },
};

const Services = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTreatments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/treatment");
      setTreatments(response.data);
    } catch (err) {
      console.error("Error al cargar servicios:", err);
      errorToast("No se pudieron cargar los servicios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  if (loading) {
    return (
      <Container className="my-5">
        <h2 className="text-center mb-4">Nuestros Servicios</h2>
        <p className="text-center">Cargando...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Nuestros Servicios</h2>
      <Row>
        {treatments.map((treatment) => {
          const staticDetails = staticServiceDetails[treatment.name] || {};
          const imageUrl = staticDetails.image || "/default-service.png";
          const description =
            staticDetails.description || "Servicio profesional de peluquería.";

          return (
            <Col key={treatment.treatmentId} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={imageUrl}
                  all
                  alt={treatment.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{treatment.name}</Card.Title>
                  <Card.Text>{description}</Card.Text>
                  <Card.Text>
                    <strong>Precio: $ {treatment.price}</strong>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default Services;
