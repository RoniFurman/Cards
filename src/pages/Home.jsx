import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../api/config";

const defaultImage = "/default-card-image.jpg";

const Home = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/cards`);
      if (response.data) {
        setCards(response.data);
      } else {
        setCards([]);
        toast.error("No cards data received from server");
      }
    } catch (error) {
      setCards([]);
      toast.error(error.response?.data?.message || "Failed to fetch cards");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
  };

  const toggleFavorite = async (cardId) => {
    if (!isAuthenticated()) {
      toast.error("Please login to add cards to favorites");
      return;
    }

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
      toast.error(
        error.response?.data?.message || "Failed to update favorite status"
      );
    }
  };

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {cards.length === 0 ? (
        <div className="text-center">
          <h3>No cards found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      ) : (
        <Row>
          {cards.map((card) => (
            <Col key={card._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <div className="card h-100">
                <Link to={`/card/${card._id}`}>
                  <img
                    src={card.image?.url || defaultImage}
                    alt={card.title}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={handleImageError}
                  />
                </Link>
                <div className="card-body">
                  <Link
                    to={`/card/${card._id}`}
                    className="text-decoration-none">
                    <h5 className="card-title">{card.title}</h5>
                  </Link>
                  <p className="card-text">{card.description}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      {card.address?.street} {card.address?.houseNumber},{" "}
                      {card.address?.city}
                    </small>
                  </p>
                  <Button
                    variant={
                      card.likes?.includes(user?._id)
                        ? "danger"
                        : "outline-danger"
                    }
                    onClick={() => toggleFavorite(card._id)}
                    disabled={!isAuthenticated()}>
                    {card.likes?.includes(user?._id) ? "❤️" : "🤍"}
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Home;
