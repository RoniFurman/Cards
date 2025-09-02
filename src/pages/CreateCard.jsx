import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../api/config";

const CreateCard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const validateForm = (formData) => {
    const errors = {};

    if (!formData.get("title")) errors.title = "Title is required";
    if (!formData.get("subtitle")) errors.subtitle = "Subtitle is required";
    if (!formData.get("description"))
      errors.description = "Description is required";
    if (!formData.get("phone")) errors.phone = "Phone is required";
    if (!formData.get("email")) errors.email = "Email is required";
    if (!formData.get("email").includes("@"))
      errors.email = "Invalid email format";
    if (!formData.get("web")) errors.web = "Website is required";
    if (!formData.get("web").startsWith("http"))
      errors.web = "Website must start with http:// or https://";
    if (!formData.get("address.state")) errors.state = "State is required";
    if (!formData.get("address.country"))
      errors.country = "Country is required";
    if (!formData.get("address.city")) errors.city = "City is required";
    if (!formData.get("address.street")) errors.street = "Street is required";
    if (!formData.get("address.houseNumber"))
      errors.houseNumber = "House number is required";
    if (!formData.get("address.zip")) errors.zip = "ZIP code is required";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const imageUrl = formData.get("image.url");
      const imageAlt = formData.get("image.alt");

      const cardData = {
        title: formData.get("title"),
        subtitle: formData.get("subtitle"),
        description: formData.get("description"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        web: formData.get("web"),
        image: {
          url: imageUrl || "",
          alt: imageAlt || "Card image",
        },
        address: {
          state: formData.get("address.state"),
          country: formData.get("address.country"),
          city: formData.get("address.city"),
          street: formData.get("address.street"),
          houseNumber: Number(formData.get("address.houseNumber")),
          zip: Number(formData.get("address.zip")),
        },
        bizNumber:
          Number(formData.get("bizNumber")) ||
          Math.floor(Math.random() * 1000000),
        user_id: user._id,
      };

      console.log("Sending card data:", cardData);

      const response = await api.post("/cards", cardData);
      if (response.data) {
        toast.success("Card created successfully!");
        navigate("/my-cards");
      }
    } catch (error) {
      console.error("Error creating card:", error.response?.data);
      setError(error.response?.data?.message || "Failed to create card");
      toast.error(error.response?.data?.message || "Failed to create card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">
                <FaSave className="me-2" />
                Create New Card
              </h2>

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter card title"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Subtitle *</Form.Label>
                  <Form.Control
                    type="text"
                    name="subtitle"
                    placeholder="Enter card subtitle"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    placeholder="Enter card description"
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Enter phone number"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Website *</Form.Label>
                  <Form.Control
                    type="url"
                    name="web"
                    placeholder="Enter website URL"
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Business Number</Form.Label>
                      <Form.Control
                        type="number"
                        name="bizNumber"
                        placeholder="Enter business number"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Image Alt Text</Form.Label>
                      <Form.Control
                        type="text"
                        name="image.alt"
                        placeholder="Enter image description"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Card Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="image.url"
                    placeholder="Enter image URL"
                    onChange={(e) => setImagePreview(e.target.value)}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </div>
                  )}
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>State *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.state"
                        placeholder="Enter state"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.country"
                        placeholder="Enter country"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.city"
                        placeholder="Enter city"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Street *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.street"
                        placeholder="Enter street"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>House Number *</Form.Label>
                      <Form.Control
                        type="number"
                        name="address.houseNumber"
                        placeholder="Enter house number"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>ZIP Code *</Form.Label>
                      <Form.Control
                        type="number"
                        name="address.zip"
                        placeholder="Enter ZIP code"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Creating...
                    </>
                  ) : (
                    "Create Card"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateCard;
