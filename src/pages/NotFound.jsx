import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaHome } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotFound = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="text-center">
            <Card.Body className="py-5">
              <h1 className="display-1 text-muted">404</h1>
              <h2 className="mb-4">Page Not Found</h2>
              <p className="lead text-muted mb-4">
                The page you are looking for might have been removed, had its name
                changed, or is temporarily unavailable.
              </p>
              <Button
                as={Link}
                to="/"
                variant="primary"
                className="d-inline-flex align-items-center"
              >
                <FaHome className="me-2" />
                Go to Homepage
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
};

export default NotFound; 