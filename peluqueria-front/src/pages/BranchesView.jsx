// File: peluqueria-front/src/pages/BranchesView.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const BranchesView = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const HARDCODED_BRANCHES = [
    {
      branchId: 1, 
      name: "Sucursal Centro",
      address: "Av. Pellegrini 1234",
      image: "./local-placeholder.png", 
    },
    {
      branchId: 2, 
      name: "Sucursal Norte",
      address: "Bv. Rondeau 4567",
      image: "./local-placeholder-2.png", 
    },
    {
      branchId: 3,
      name: "Sucursal Sur",
      address: "Boulevard 789",
      image: "./local-placeholder-2.png", 
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setBranches(HARDCODED_BRANCHES);
      setLoading(false);
    }, 300);
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

