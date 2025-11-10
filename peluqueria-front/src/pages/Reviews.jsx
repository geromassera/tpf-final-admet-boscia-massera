import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import ReviewModal from "../components/ReviewModal";
import { AuthenticationContext } from "../components/services/auth.context";
import api from "../components/services/API/Axios";
import {
  successToast,
  errorToast,
} from "../components/ui/toast/NotificationToast";

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
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get("/reviews");
      setReviews(response.data);
    } catch (err) {
      errorToast(err.response?.data?.message || "Error al cargar reseñas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const addReview = async (reviewData) => {
    try {
      await api.post("/reviews", reviewData);
      successToast("Reseña creada exitosamente.");
      fetchReviews();
      return true;
    } catch (err) {
      if (err.response?.status === 409) {
        errorToast(err.response.data.message);
      } else {
        errorToast(err.response?.data?.message || "Error al crear la reseña.");
      }
      return false;
    }
  };

  const reviewButton = () => {
    if (!user) return null;

    if (user.role === "Client") {
      return <Button onClick={handleShow}>Dejar una reseña</Button>;
    }
    return null;
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <p>Cargando reseñas...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Reseñas de Nuestros Clientes</h2>

      <Row className="gy-3">
        {reviews.map((review, index) => (
          <Col md={6} lg={4} key={review.createdAt || index}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>{review.clientName}</Card.Title>
                <StarRating rating={review.rating} />
                <Card.Text className="mt-2">{review.text}</Card.Text>
                <Card.Text
                  className="text-muted"
                  style={{ fontSize: "0.8rem" }}
                >
                  {new Date(review.createdAt).toLocaleDateString("es-AR")}
                </Card.Text>
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
