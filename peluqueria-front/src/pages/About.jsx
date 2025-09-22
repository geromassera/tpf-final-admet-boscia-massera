import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const localImg1 = "./local-placeholder.png";
const localImg2 = "./local-placeholder-2.png";
const teamImg1 = "./team-1.png";
const teamImg2 = "./team-2.png";
const teamImg3 = "./team-3.png";

const AboutUs = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Sobre Nosotros</h2>

      {/* Nuestros Locales */}
      <Col md={12} className="mt-4">
        <h3 className="text-center mb-3">Nuestros Locales</h3>
        <Row className="g-3 justify-content-center">
          <Col xs={12} sm={6} md={5} lg={4}>
            <Card className="shadow-sm h-100">
              <Image
                src={localImg1}
                fluid
                alt="Local Av. Francia"
                style={{ maxHeight: 200, objectFit: "cover" }}
              />
              <Card.Body className="text-center">
                <Card.Title>Local Av. Francia</Card.Title>
                <Card.Text>Av. Francia 1375, Rosario</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={6} md={5} lg={4}>
            <Card className="shadow-sm h-100">
              <Image
                src={localImg2}
                fluid
                alt="Local Av. Pellegrini"
                style={{ maxHeight: 200, objectFit: "cover" }}
              />
              <Card.Body className="text-center">
                <Card.Title>Local Av. Pellegrini</Card.Title>
                <Card.Text>Av. Pellegrini 2500, Rosario</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>

      {/* Nuestro equipo */}
      <Col md={12} className="mt-4">
        <h3 className="text-center mb-3">Nuestro equipo</h3>
        <Row className="g-3 justify-content-center">
          <Col
            xs={12}
            sm={6}
            md={4}
            lg={3}
            className="d-flex justify-content-center"
          >
            <figure className="text-center">
              <Image
                src={teamImg1}
                roundedCircle
                fluid
                alt="Equipo - 1"
                style={{ width: 180, height: 180, objectFit: "cover" }}
              />
              <figcaption className="mt-2">Martín</figcaption>
            </figure>
          </Col>

          <Col
            xs={12}
            sm={6}
            md={4}
            lg={3}
            className="d-flex justify-content-center"
          >
            <figure className="text-center">
              <Image
                src={teamImg2}
                roundedCircle
                fluid
                alt="Equipo - 2"
                style={{ width: 180, height: 180, objectFit: "cover" }}
              />
              <figcaption className="mt-2">Laura</figcaption>
            </figure>
          </Col>

          <Col
            xs={12}
            sm={6}
            md={4}
            lg={3}
            className="d-flex justify-content-center"
          >
            <figure className="text-center">
              <Image
                src={teamImg3}
                roundedCircle
                fluid
                alt="Equipo - 3"
                style={{ width: 180, height: 180, objectFit: "cover" }}
              />
              <figcaption className="mt-2">Julián</figcaption>
            </figure>
          </Col>
        </Row>
      </Col>
      <Row className="gy-4">
        {/* Historia */}
        <Col md={6} lg={6}>
          <Card className="shadow-sm h-100 p-3">
            <Card.Body>
              <Card.Title>
                <strong>Breve historia</strong>
              </Card.Title>
              <Card.Text>
                Nuestra peluquería nació en 2010 como un pequeño emprendimiento
                familiar en Rosario. Con el paso de los años fuimos creciendo
                gracias a la confianza de nuestros clientes y al compromiso del
                equipo por ofrecer un servicio cercano y profesional.
              </Card.Text>

              <Card.Text>
                Empezamos con un solo local y hoy contamos con un equipo de
                profesionales especializados en corte, coloración y styling,
                manteniendo siempre la atención personalizada.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Filosofía y valores */}
        <Col md={6} lg={6}>
          <Card className="shadow-sm h-100 p-3">
            <Card.Body>
              <Card.Title>
                <strong>Filosofía y valores</strong>
              </Card.Title>
              <Card.Text>
                Creemos que la peluquería es un espacio de cuidado y
                transformación. Nuestro enfoque se basa en:
              </Card.Text>

              <ul>
                <li>
                  <strong>Respeto:</strong> trato amable y profesional con cada
                  cliente.
                </li>
                <li>
                  <strong>Calidad:</strong> uso de productos seleccionados y
                  técnicas actualizadas.
                </li>
                <li>
                  <strong>Personalización:</strong> soluciones pensadas según
                  las necesidades individuales.
                </li>
                <li>
                  <strong>Sostenibilidad:</strong> buscamos prácticas
                  conscientes y productos con menor impacto.
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        {/* Servicios y diferenciadores */}
        <Col md={12} lg={8} className="mx-auto">
          <Card className="shadow-sm p-3">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Card.Text>
                    <strong>Servicios:</strong>
                    <br />
                    💇Cortes de cabello (hombre, mujer y niños)
                    <br />
                    🎨Coloración y mechas
                    <br />
                    💃Peinados y styling para eventos
                    <br />
                    💆Tratamientos capilares (hidratación y reparación)
                  </Card.Text>
                </Col>

                <Col md={6}>
                  <Card.Text>
                    <strong>Diferenciadores:</strong>
                    <br />
                    - Atención personalizada con asesoramiento de imagen.
                    <br />
                    - Técnicas actualizadas y formación continua del equipo.
                    <br />
                    - Productos profesionales seleccionados para cada tipo de
                    cabello.
                    <br />- Ambiente cómodo y ameno pensado para la experiencia
                    del cliente.
                  </Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Footer CTA pequeño */}
        <Col md={8} className="mx-auto mt-4">
          <Card className="text-center shadow-sm p-3">
            <Card.Body>
              <Card.Text>
                <strong>¿Querés conocernos en persona?</strong>
                <br />
                Pasate por cualquiera de nuestros locales o reservá un turno
                online.
              </Card.Text>

              <div>
                <Button as={Link} to="/contact">
                  Contacto
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
