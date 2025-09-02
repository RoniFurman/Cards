import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api/config";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const defaultImage = "/default-card-image.jpg";

const MyCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const fetchMyCards = async () => {
      try {
        setLoading(true);
        const response = await api.get("/cards/my-cards");
        setCards(response.data || []);
      } catch (error) {
        toast.error("Failed to fetch your cards");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCards();
  }, [navigate, isAuthenticated]);

  const handleDelete = async (cardId) => {
    if (!window.confirm("Are you sure you want to delete this card?")) {
      return;
    }

    try {
      await api.delete(`/cards/${cardId}`);
      setCards(cards.filter((card) => card._id !== cardId));
      toast.success("Card deleted successfully");
    } catch (error) {
      toast.error("Failed to delete card");
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Business Cards</h2>
        <Button variant="primary" onClick={() => navigate("/create-card")}>
          Create New Card
        </Button>
      </div>
      {cards.length === 0 ? (
        <p>You haven't created any cards yet.</p>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {cards.map((card) => (
            <Col key={card._id}>
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={card.image?.url || ""}
                  alt={card.title}
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = defaultImage;
                  }}
                />
                <Card.Body>
                  <Card.Title>{card.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {card.subtitle}
                  </Card.Subtitle>
                  <Card.Text>{card.description}</Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="outline-primary"
                      onClick={() => navigate(`/edit-card/${card._id}`)}>
                      <FaEdit className="me-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDelete(card._id)}>
                      <FaTrash className="me-2" />
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyCards;
