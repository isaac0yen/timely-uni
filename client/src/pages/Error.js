import React from 'react';
import { Container, Row, Col, Button, Nav } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaHome, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import "../css/Error.css";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Nav className="justify-content-center py-3 bg-navy">
        <Nav.Item>
          <Nav.Link as={Link} to="/" className="text-white">Lecture Reminder System</Nav.Link>
        </Nav.Item>
      </Nav>

      <Container className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center error-background">
        <Row>
          <Col>
            <h1 className="display-1 text-navy animate-fade-in">404</h1>
            <h2 className="mb-4 animate-fade-in-delay">Page Not Found</h2>
            <p className="mb-4 animate-fade-in-delay">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <Button variant="primary" onClick={handleGoHome} className="animate-slide-up">
              Go to Home Page
            </Button>
          </Col>
        </Row>
      </Container>

      <Nav className="justify-content-center py-3 bg-navy">
        <Nav.Item>
          <Nav.Link as={Link} to="/" className="text-white"><FaHome /> Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/" className="text-white"><FaSignInAlt /> Login</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/register" className="text-white"><FaUserPlus /> Register</Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default ErrorPage;