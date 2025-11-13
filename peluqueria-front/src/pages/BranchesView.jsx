import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import api from "../components/services/API/Axios";

const BranchesView = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await api.get("/branches");
        setBranches(response.data);
      } catch (error) {
        console.error("Error al obtener sucursales:", error);
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
                src={branch.image} 
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

