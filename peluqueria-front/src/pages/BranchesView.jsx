// File: peluqueria-front/src/pages/BranchesView.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import api from "../components/services/API/Axios"; 
import { errorToast } from "../components/ui/toast/NotificationToast"; 

const BranchesView = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await api.get("/branch"); 
      
      setBranches(response.data);
      
    } catch (err) {
      console.error("Error fetching branches:", err);
      errorToast(err.response?.data?.message || "Error al cargar las sucursales.");
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
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
                src={branch.branchId === 1 ? "./local-placeholder.png" : "./local-placeholder-2.png"}
                alt={branch.name}
                style={{ height: "220px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{branch.name}</Card.Title>
                <Card.Text>
                  <strong>Dirección:</strong> {branch.address}
                  <br />
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

