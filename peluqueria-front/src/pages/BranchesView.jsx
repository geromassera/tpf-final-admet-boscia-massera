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

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        // Mantenemos la ruta plural "/branches" según tu indicación
        const response = await api.get("/branches"); 
        setBranches(response.data);
      } catch (error) {
        console.error("Error al obtener sucursales:", error);
        errorToast("Error al cargar sucursales. Verifique la API."); // Añadido toast de error
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

  // [NUEVO] Función helper para asignar la imagen estática
  const getBranchImage = (branchId) => {
    // Asigna la imagen 1 si el ID es 1, o la imagen 2 para el resto (Norte/Sur, etc.)
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
              <Button variant="outline-primary" onClick={() => navigate("/")}>Volver</Button>
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

      <Row className="g-4">
        {branches.map((branch) => (
          <Col md={4} key={branch.branchId}> 
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                // [CORREGIDO] Usamos la función getBranchImage
                src={getBranchImage(branch.branchId)} 
                alt={branch.name}
                style={{ height: "220px", objectFit: "cover" }}
              />
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
        ))}
      </Row>
    </Container>
  );
};

export default BranchesView;

