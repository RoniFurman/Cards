import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = (formData) => {
    const errors = {};
    
    if (!formData.get('name.first')) errors.firstName = 'First name is required';
    if (!formData.get('name.last')) errors.lastName = 'Last name is required';
    if (!formData.get('phone')) errors.phone = 'Phone is required';
    if (!formData.get('email')) errors.email = 'Email is required';
    if (!formData.get('email').includes('@')) errors.email = 'Invalid email format';
    if (!formData.get('password')) errors.password = 'Password is required';
    if (formData.get('password').length < 7) errors.password = 'Password must be at least 7 characters';
    if (formData.get('password') !== formData.get('confirmPassword')) errors.confirmPassword = 'Passwords do not match';
    
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
      setError('');
      
      const userData = {
        name: {
          first: formData.get('name.first'),
          middle: formData.get('name.middle') || '',
          last: formData.get('name.last')
        },
        phone: formData.get('phone'),
        email: formData.get('email'),
        password: formData.get('password'),
        image: {
          url: formData.get('image.url') || '',
          alt: formData.get('image.alt') || ''
        },
        address: {
          state: formData.get('address.state'),
          country: formData.get('address.country'),
          city: formData.get('address.city'),
          street: formData.get('address.street'),
          houseNumber: Number(formData.get('address.houseNumber')),
          zip: Number(formData.get('address.zip'))
        },
        isBusiness: formData.get('isBusiness') === 'true'
      };

      const result = await register(userData);
      if (result.success) {
        toast.success('Registration successful! You are now logged in.');
        navigate('/');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
      toast.error(error.message || 'Registration failed. Please try again.');
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
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login">Login here</Link>
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