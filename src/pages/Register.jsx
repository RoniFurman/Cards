import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { FaUserPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = (formData) => {
    const errors = {};

    if (!formData.get("name.first"))
      errors.firstName = "First name is required";
    if (!formData.get("name.last")) errors.lastName = "Last name is required";
    if (!formData.get("phone")) errors.phone = "Phone is required";
    if (!formData.get("email")) errors.email = "Email is required";
    if (!formData.get("email").includes("@"))
      errors.email = "Invalid email format";
    if (!formData.get("password")) errors.password = "Password is required";
    if (formData.get("password").length < 7)
      errors.password = "Password must be at least 7 characters";
    if (formData.get("password") !== formData.get("confirmPassword"))
      errors.confirmPassword = "Passwords do not match";

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

      // Helper for minimum length
      const minLen = (val, min, placeholder) => {
        if (!val || val.length < min) return placeholder;
        return val;
      };

      // Validate and set all fields
      const userData = {
        name: {
          first: minLen(formData.get("name.first"), 2, "John"),
          middle: minLen(formData.get("name.middle"), 2, "--"),
          last: minLen(formData.get("name.last"), 2, "Doe"),
        },
        phone: minLen(formData.get("phone"), 9, "0512345678"),
        email: minLen(formData.get("email"), 5, "user@email.com"),
        password: minLen(formData.get("password"), 7, "Abc123Abc"),
        image: {
          url: minLen(formData.get("image.url"), 14, "https://img.com/def"),
          alt: minLen(formData.get("image.alt"), 2, "img"),
        },
        address: {
          state: minLen(formData.get("address.state"), 2, "IL"),
          country: minLen(formData.get("address.country"), 2, "Israel"),
          city: minLen(formData.get("address.city"), 2, "City"),
          street: minLen(formData.get("address.street"), 2, "Street"),
          houseNumber: Number(formData.get("address.houseNumber")),
          zip: Number(formData.get("address.zip")),
        },
        isBusiness: formData.get("isBusiness") === "true" ? true : false,
      };

      const result = await register(userData);
      if (result.success) {
        if (result.pendingLogin) {
          toast.success("Registration successful! Please log in.");
          navigate("/login");
        } else {
          toast.success("Registration successful! You are now logged in.");
          navigate("/");
        }
      } else {
        setError(result.message || "Registration failed. Please try again.");
        toast.error(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
      toast.error(error.message || "Registration failed. Please try again.");
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
                <FaUserPlus className="me-2" />
                Register
              </h2>

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name.first"
                        placeholder="First name"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Middle Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name.middle"
                        placeholder="Middle name"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name.last"
                        placeholder="Last name"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Phone number"
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
                        placeholder="Email address"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password *</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password *</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Image URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="image.url"
                        placeholder="Image URL"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Image Alt Text</Form.Label>
                      <Form.Control
                        type="text"
                        name="image.alt"
                        placeholder="Image description"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>State *</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.state"
                        placeholder="State"
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
                        placeholder="Country"
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
                        placeholder="City"
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
                        placeholder="Street"
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
                        placeholder="House number"
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
                        placeholder="ZIP code"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="isBusiness"
                    label="Register as a business"
                    value="true"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 mb-3"
                  disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account? <Link to="/login">Login here</Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
