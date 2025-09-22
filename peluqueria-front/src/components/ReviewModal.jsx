import { useState, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { AuthenticationContext } from "./services/auth.context";
import { toast } from "react-toastify";

const ReviewModal = ({ show, handleClose, addReview }) => {
  const { user } = useContext(AuthenticationContext);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      toast.error("La reseña no puede estar vacía ni contener solo espacios.");
      return;
    }

    addReview({
      user: user.name,
      rating,
      comment: trimmedComment,
    });

    toast.success("Reseña guardada con éxito");

    setRating(5);
    setComment("");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Dejar una reseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="rating" className="mb-3">
            <Form.Label>Puntuación</Form.Label>
            <Form.Select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((star) => (
                <option key={star} value={star}>
                  {star} estrellas
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="comment">
            <Form.Label>Comentario</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              maxLength={255}
              style={{ resize: "none" }}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe tu opinión aquí..."
            />
            <Form.Text muted>
              Máximo 255 caracteres. Restantes: {255 - comment.length}
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewModal;
