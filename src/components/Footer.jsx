import { Link } from 'react-router-dom';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { isAuthenticated, isBusiness, isAdmin } = useAuth();

  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4} className="mb-3">
            <h5>Business Cards</h5>
            <p className="text-muted">
              Connect with businesses and showcase your services with our digital business cards platform.
            </p>
          </Col>
          
          <Col md={4} className="mb-3">
            <h5>Quick Links</h5>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/" className="text-light">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="text-light">
                About
              </Nav.Link>
              {isAuthenticated() && (
                <Nav.Link as={Link} to="/favorites" className="text-light">
                  Favorites
                </Nav.Link>
              )}
              {isBusiness() && (
                <Nav.Link as={Link} to="/my-cards" className="text-light">
                  My Cards
                </Nav.Link>
              )}
              {isAdmin() && (
                <Nav.Link as={Link} to="/crm" className="text-light">
                  CRM
                </Nav.Link>
              )}
            </Nav>
          </Col>
          
          <Col md={4} className="mb-3">
            <h5>Contact Us</h5>
            <address className="text-muted">
              <p>
                <strong>Email:</strong> info@businesscards.com
              </p>
              <p>
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
              <p>
                <strong>Address:</strong> 123 Business Street, Suite 100
                <br />
                City, State 12345
              </p>
            </address>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Business Cards. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 