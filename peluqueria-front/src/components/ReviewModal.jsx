import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const ReviewModal = ({ show, handleClose, addReview }) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      toast.error("La reseña no puede estar vacía.");
      return;
    }

    setIsSaving(true);

    const success = await addReview({
      rating,
      text: trimmedText,
    });

    setIsSaving(false);

    if (success) {
      setRating(5);
      setText("");
      handleClose();
    }
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
              maxLength={1000}
              style={{ resize: "none" }}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe tu opinión aquí..."
            />
            <Form.Text muted>
              Máximo 1000 caracteres. Restantes: {1000 - text.length}
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isSaving}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewModal;
