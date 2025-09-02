import { useState } from "react";
import { Card as BootstrapCard, Button, Modal } from "react-bootstrap";
import {
  FaHeart,
  FaRegHeart,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../api/config";

const defaultImage = "/default-card-image.jpg";

const Card = ({ card, onFavoriteToggle }) => {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(card.isFavorite);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated()) {
      toast.error("Please login to add to favorites");
      return;
    }

    try {
      const response = await api.post(`/cards/${card._id}/favorite`);
      setIsFavorite(response.data.isFavorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(card._id, response.data.isFavorite);
      }
    } catch (error) {
      toast.error("Failed to update favorite status");
    }
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  return (
    <>
      <BootstrapCard className="mb-4" style={{ width: "18rem" }}>
        <BootstrapCard.Img
          variant="top"
          src={card.image?.url || defaultImage}
          alt={card.title}
          style={{ height: "50px", objectFit: "cover" }}
          onError={handleImageError}
        />
        <BootstrapCard.Body>
          <BootstrapCard.Title>{card.title}</BootstrapCard.Title>
          <BootstrapCard.Text>{card.subtitle}</BootstrapCard.Text>
          <div className="d-flex justify-content-between align-items-center">
            <Button variant="primary" onClick={handleCardClick}>
              View Details
            </Button>
            <Button
              variant="link"
              onClick={handleFavoriteToggle}
              className="text-danger">
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
            </Button>
          </div>
        </BootstrapCard.Body>
      </BootstrapCard>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{card.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={card.image?.url || defaultImage}
            alt={card.title}
            className="img-fluid mb-3"
            onError={handleImageError}
          />
          <p>{card.description}</p>
          <div className="mt-3">
            <p>
              <FaPhone className="me-2" />
              {card.phone}
            </p>
            <p>
              <FaEnvelope className="me-2" />
              {card.email}
            </p>
            <p>
              <FaGlobe className="me-2" />
              <a href={card.web} target="_blank" rel="noopener noreferrer">
                {card.web}
              </a>
            </p>
            <p>
              <FaMapMarkerAlt className="me-2" />
              {card.address.street} {card.address.houseNumber},{" "}
              {card.address.city}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Card;
