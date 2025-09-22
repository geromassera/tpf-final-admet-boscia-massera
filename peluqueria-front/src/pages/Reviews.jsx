import { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import ReviewModal from "../components/ReviewModal";
import { useContext } from "react";
import { AuthenticationContext } from "../components/services/auth.context";

// Componente para mostrar estrellas
const StarRating = ({ rating }) => {
  return (
    <div>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < rating ? "gold" : "#ccc" }}>
          ★
        </span>
      ))}
    </div>
  );
};

const ReviewsPage = () => {
  const { user } = useContext(AuthenticationContext);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: "Martín",
      rating: 5,
      comment: "Excelente atención, muy profesionales.",
    },
    {
      id: 2,
      user: "Laura",
      rating: 4,
      comment: "Muy buen corte, volveré pronto.",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const addReview = (review) => {
    setReviews([...reviews, { ...review, id: reviews.length + 1 }]);
  };

  const reviewButton = () => {
    if (!user) return null;

    if (user.role === "Customer") {
      return <Button onClick={handleShow}>Dejar una reseña</Button>;
    }
  };
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Reseñas de Nuestros Clientes</h2>

      <Row className="gy-3">
        {reviews.map((review) => (
          <Col md={6} lg={4} key={review.id}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>{review.user}</Card.Title>
                <StarRating rating={review.rating} />
                <Card.Text className="mt-2">{review.comment}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-4">{reviewButton()}</div>

      <ReviewModal
        show={showModal}
        handleClose={handleClose}
        addReview={addReview}
      />
    </Container>
  );
};

export default ReviewsPage;
