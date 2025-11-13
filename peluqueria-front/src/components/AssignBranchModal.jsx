import { useState, useEffect } from "react";
import api from "./services/API/Axios";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const AssignBranchModal = ({ show, handleClose, barber, onSaveSuccess }) => {
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show) {
      const fetchBranches = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await api.get("/branches");
          setBranches(response.data);
          setSelectedBranchId(barber?.branchId || "");
        } catch (err) {
          console.error("Error al cargar sucursales:", err);
          setError("No se pudieron cargar las sucursales.");
        } finally {
          setLoading(false);
        }
      };
      fetchBranches();
    }
  }, [show, barber]);

  const handleSave = async () => {
    if (!selectedBranchId) {
      setError("Debes seleccionar una sucursal.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.patch(
        `/admin/users/${barber.userId}/assign-branch/${selectedBranchId}`
      );
      onSaveSuccess();
      handleClose();
    } catch (err) {
      console.error("Error al asignar la sucursal:", err);
      setError("Hubo un problema al asignar la sucursal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Asignar Sucursal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {barber && (
          <p>
            Asignando sucursal a{" "}
            <strong>
              {barber.name} {barber.surname}
            </strong>
          </p>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group>
          <Form.Label>Sucursal</Form.Label>
          <Form.Select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            disabled={loading}
          >
            <option value="">Sin Asignar</option>
            {branches.map((branch) => (
              <option key={branch.branchId} value={branch.branchId}>
                {branch.name} {branch.address}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignBranchModal;
