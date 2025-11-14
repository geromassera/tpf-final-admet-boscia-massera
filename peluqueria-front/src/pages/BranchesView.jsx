import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// [MODIFICADO] Importamos 'Image' para Card.Img (aunque Card.Img también funciona, es más explícito)
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import api from "../components/services/API/Axios";
import { errorToast } from "../components/ui/toast/NotificationToast"; // Importamos Toast

// [NUEVO] Definimos las rutas a las imágenes estáticas (desde /public)
const localImg1 = "/local-placeholder.png";
const localImg2 = "/local-placeholder-2.png";

const BranchesView = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const BranchImg1 = "/local-placeholder.png";
  const BranchImg2 = "/local-placeholder-2.png";
  const DefaultImg = "/default-branch.png";

  const staticBranchImages = {
    "Sucursal Centro": BranchImg1,
    "Sucursal Norte": BranchImg2,
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await api.get("/branches");
        setBranches(response.data);
      } catch (error) {
        console.error("Error al obtener sucursales:", error);
        errorToast("Error al cargar sucursales.");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleSelectBranch = (branch) => {
    localStorage.setItem("selectedBranch", JSON.stringify(branch));
    navigate("/appointments");
  };

  const getBranchImage = (branchId) => {
    if (branchId === 1) return localImg1;
    return localImg2;
  };

  if (loading) {
    return <p className="text-center mt-5">Cargando sucursales...</p>;
  }

  if (branches.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <h2>Elegí tu sucursal</h2>
        <p className="text-danger">No se encontraron sucursales disponibles.</p>
        <Button variant="outline-primary" onClick={() => navigate("/")}>
          Volver
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="text-center mb-5">
        <h2 className="display-5 fw-bold">Elegí tu sucursal</h2>
        <p className="text-muted">
          Seleccioná una de nuestras sucursales para reservar tu turno.
        </p>
      </div>

      <Row className="g-4 justify-content-center">
        {branches.map((branch) => {
          const imageToShow =
            staticBranchImages[branch.name] ?? branch.image ?? DefaultImg;

          return (
            <Col md={4} key={branch.branchId}>
              <Card className="h-100 shadow-sm">
                <Card.Img variant="top" src={imageToShow} alt={branch.name} />

                <Card.Body>
                  <Card.Title>{branch.name}</Card.Title>
                  <Card.Text>
                    <strong>Dirección:</strong> {branch.address}
                  </Card.Text>

                  <Button
                    variant="primary"
                    onClick={() => handleSelectBranch(branch)}
                  >
                    Seleccionar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default BranchesView;
