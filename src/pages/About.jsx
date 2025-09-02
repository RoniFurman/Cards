import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaBusinessTime, FaShieldAlt } from 'react-icons/fa';

const About = () => {
  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">About Business Cards</h1>
      
      <Row className="mb-4">
        <Col md={8} className="mx-auto">
          <p className="lead text-center">
            Business Cards is a modern platform that helps businesses create and share
            digital business cards, making networking easier and more efficient.
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <FaUsers className="display-4 mb-3 text-primary" />
              <Card.Title>For Everyone</Card.Title>
              <Card.Text>
                Whether you're a business owner, freelancer, or professional,
                our platform helps you create a lasting impression.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <FaBusinessTime className="display-4 mb-3 text-success" />
              <Card.Title>Business Features</Card.Title>
              <Card.Text>
                Create, manage, and track your business cards with our
                comprehensive set of tools designed for businesses.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <FaShieldAlt className="display-4 mb-3 text-info" />
              <Card.Title>Secure & Reliable</Card.Title>
              <Card.Text>
                Your data is protected with industry-standard security measures
                and reliable infrastructure.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Our Mission</h2>
              <p>
                We believe in making professional networking more accessible and
                efficient. Our platform helps businesses and professionals create
                meaningful connections through digital business cards that are
                easy to create, share, and manage.
              </p>
              <p className="mb-0">
                Join us in revolutionizing the way professionals connect and
                share their business information.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About; 