import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center">
      <Row>
        <Col>
          <h1 className="display-1 text-danger">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="mb-4">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Button variant="primary" onClick={handleGoHome}>
            Go to Home Page
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorPage;
