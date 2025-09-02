import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import api from "../api/config";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const defaultImage = "/default-card-image.jpg";

const CardDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 31.7767, lng: 35.2345 });

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/cards/${id}`);
        setCard(response.data);

        if (response.data.address) {
          const address = `${response.data.address.street} ${response.data.address.houseNumber}, ${response.data.address.city}, ${response.data.address.state} ${response.data.address.zip}, ${response.data.address.country}`;

          if (window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
              if (status === "OK" && results[0]) {
                setMapCenter({
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng(),
                });
              }
            });
          }
        }
      } catch (error) {
        toast.error("Failed to fetch card details");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id, navigate]);

  const toggleFavorite = async () => {
    if (!isAuthenticated()) {
      toast.error("Please login to add to favorites");
      return;
    }

    try {
      const response = await api.patch(`/cards/${id}`);
      setCard({ ...card, likes: response.data.likes });
      toast.success("Favorite status updated");
    } catch (error) {
      toast.error("Failed to update favorite status");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this card?")) {
      return;
    }

    try {
      await api.delete(`/cards/${id}`);
      toast.success("Card deleted successfully");
      navigate("/");
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

  if (!card) {
    return (
      <Container className="text-center py-5">
        <h4>Card not found</h4>
        <Button variant="primary" onClick={() => navigate("/")}>
          Return to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img
              variant="top"
              src={card.image?.url || defaultImage}
              alt={card.title}
              style={{ height: "300px", objectFit: "cover" }}
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
              <div className="mb-3">
                <p className="mb-1">
                  <FaMapMarkerAlt className="me-2" />
                  {`${card.address.street} ${card.address.houseNumber}, ${card.address.city}, ${card.address.state} ${card.address.zip}, ${card.address.country}`}
                </p>
                <p className="mb-1">
                  <FaPhone className="me-2" />
                  {card.phone}
                </p>
                <p className="mb-1">
                  <FaEnvelope className="me-2" />
                  {card.email}
                </p>
                {card.web && (
                  <p className="mb-1">
                    <FaGlobe className="me-2" />
                    <a
                      href={card.web}
                      target="_blank"
                      rel="noopener noreferrer">
                      {card.web}
                    </a>
                  </p>
                )}
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <Button variant="link" className="p-0" onClick={toggleFavorite}>
                  {user && card.likes?.includes(user._id) ? (
                    <FaHeart className="text-danger" />
                  ) : (
                    <FaRegHeart />
                  )}
                </Button>
                {user && (user._id === card.user_id || user.isAdmin) && (
                  <div>
                    <Button
                      variant="outline-primary"
                      className="me-2"
                      href={`/edit-card/${id}`}>
                      <FaEdit className="me-1" />
                      Edit
                    </Button>
                    <Button variant="outline-danger" onClick={handleDelete}>
                      <FaTrash className="me-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d216289.2480825459!2d34.497219406193004!3d32.10926965278717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4bb6fe4f32b1%3A0xdb7fd25f06e2d540!2sTel%20Aviv%20District!5e0!3m2!1sen!2sil!4v1744821472538!5m2!1sen!2sil"
            width="600"
            height="450"
            loading="lazy"></iframe>
        </Col>
      </Row>
    </Container>
  );
};

export default CardDetails;
