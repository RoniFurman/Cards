import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api/config";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const defaultImage = "/default-card-image.jpg";

const Favorites = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await api.get("/cards");
        if (response.data && Array.isArray(response.data)) {
          const favoriteCards = response.data.filter(
            (card) => card.likes && card.likes.includes(user._id)
          );
          setCards(favoriteCards);
        } else {
          setCards([]);
          toast.error("Invalid response format from server");
        }
      } catch (error) {
        toast.error("Failed to fetch favorite cards");
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [navigate, isAuthenticated, user._id]);

  const toggleFavorite = async (cardId) => {
    try {
      const response = await api.patch(`/cards/${cardId}`);
      if (response.data) {
        setCards(
          cards.map((card) =>
            card._id === cardId ? { ...card, likes: response.data.likes } : card
          )
        );
        const isLiked = response.data.likes.includes(user._id);
        toast.success(
          isLiked ? "Added to favorites" : "Removed from favorites"
        );
      }
    } catch (error) {
      toast.error("Failed to update favorite status");
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
      <h2 className="mb-4">My Favorite Cards</h2>
      {cards.length === 0 ? (
        <p>No favorite cards yet.</p>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {cards.map((card) => (
            <Col key={card._id}>
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={card.image?.url || defaultImage}
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
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-link p-0"
                      onClick={() => toggleFavorite(card._id)}>
                      {user && card.likes?.includes(user._id) ? (
                        <FaHeart className="text-danger" />
                      ) : (
                        <FaRegHeart />
                      )}
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/card/${card._id}`)}>
                      View Details
                    </button>
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

export default Favorites;
