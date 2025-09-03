import { Modal, Button } from "react-bootstrap";

const ConfirmAdminModal = ({ show, handleClose, handleConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar acción</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que querés asignar el rol <strong>admin</strong> a este
        usuario?
        <br />
        <span className="text-danger">
          Esta acción es irreversible y otorgará acceso total al sistema.
        </span>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmAdminModal;
