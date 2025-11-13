import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../components/services/API/Axios";
import { useState, useEffect, use } from "react";
import { errorToast } from "../components/ui/toast/NotificationToast";

const localImg1 = "./local-placeholder.png";
const localImg2 = "./local-placeholder-2.png";
const teamImg1 = "./team-1.png";
const teamImg2 = "./team-2.png";
const teamImg3 = "./team-3.png";
const defaultTeamImg = "./team-default.jpg";

const staticBarberImages = {
  "Martin Lopez": teamImg1,
  "Laura Martinez": teamImg2,
  "Julian Gonzalez": teamImg3,
};

const AboutUs = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barbersResponse, branchesResponse] = await Promise.all([
          api.get("/user/barbers"),
          api.get("/branches"),
        ]);
        setBarbers(barbersResponse.data);
        setBranches(branchesResponse.data);
      } catch (err) {
        errorToast(err.response?.data?.message || "Error al obtener datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
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
                alt="Sucursal Centro"
                style={{ maxHeight: 200, objectFit: "cover" }}
              />
              <Card.Body className="text-center">
                <Card.Title>Sucursal Centro</Card.Title>
                <Card.Text>Av Pellegrini 1234, Rosario</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} sm={6} md={5} lg={4}>
            <Card className="shadow-sm h-100">
              <Image
                src={localImg2}
                fluid
                alt="Sucursal Norte"
                style={{ maxHeight: 200, objectFit: "cover" }}
              />
              <Card.Body className="text-center">
                <Card.Title>Sucursal Norte</Card.Title>
                <Card.Text>Bv Rondeau 4567, Rosario</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
      {/* Nuestro equipo */}
      <Col md={12} className="mt-5">
        <h3 className="text-center mb-5">Nuestro equipo</h3>
        <Row className="g-3 justify-content-center">
          {loading ? (
            <p>Cargando equipo...</p>
          ) : (
            barbers.map((barber) => {
              const fullName = `${barber.name} ${barber.surname}`;
              const imageUrl = staticBarberImages[fullName] || defaultTeamImg;
              const branch = branches.find(
                (b) => b.branchId === barber.branchId
              );
              const branchName = branch ? branch.name : null;

              return (
                <Col
                  key={barber.userId}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className="d-flex justify-content-center"
                >
                  <figure className="text-center">
                    <Image
                      src={imageUrl}
                      roundedCircle
                      fluid
                      alt={fullName}
                      style={{ width: 180, height: 180, objectFit: "cover" }}
                    />
                    <figcaption className="mt-2">
                      {fullName}
                      {branchName && (
                        <span
                          className="d-block text-muted"
                          style={{ fontsize: "0.9rem" }}
                        >
                          ({branchName})
                        </span>
                      )}
                    </figcaption>
                  </figure>
                </Col>
              );
            })
          )}
        </Row>
      </Col>
      {/* Historia */}
      <Row className="gy-4">
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

        {/* Por qué elegirnos */}
        <Col md={12} lg={8} className="mx-auto mt-4">
          <Card className="shadow-sm p-3">
            <Card.Body>
              <Card.Title>
                <strong>¿Por qué elegirnos?</strong>
              </Card.Title>
              <Card.Text>
                En nuestra peluquería, nos esforzamos por ofrecer una
                experiencia superior en cada visita. Nuestros principales
                diferenciadores son:
                <br />
                <ul>
                  <li>
                    Atención personalizada con asesoramiento de imagen
                    profesional.
                  </li>
                  <li>
                    Técnicas de vanguardia y un equipo en formación continua.
                  </li>
                  <li>
                    Uso exclusivo de productos profesionales de alta calidad.
                  </li>
                  <li>
                    Un ambiente cálido y relajante, diseñado para tu confort.
                  </li>
                  <li>
                    Compromiso con la sostenibilidad, utilizando productos con
                    menor impacto ambiental.
                  </li>
                </ul>
              </Card.Text>
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
