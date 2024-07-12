import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import "../css/Home.css";

const RoleBox = ({ role, title, icon }) => (
  <Col md={6} className="mb-4">
    <Card as={Link} to={`/login/${role}`} className="h-100 text-center text-decoration-none role-card shadow-sm">
      <Card.Body className="d-flex flex-column justify-content-center align-items-center p-4">
        <i className={`bi ${icon} fs-1 mb-3 text-primary`}></i>
        <Card.Title className="mb-2">{title}</Card.Title>
        <Card.Text>Click to continue as {title}</Card.Text>
      </Card.Body>
    </Card>
  </Col>
);

const HomePage = () => {
  return (
    <Container fluid className="py-5 home-background">
      <Row className="justify-content-center mb-5">
        <Col md={8} className="text-center">
          <h1 className="display-4 fw-bold text-white"> Lecture Reminder System</h1>
          <p className="lead text-light">Choose your role to get started</p>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <RoleBox role="admin" title="Admin" icon="bi-person-badge" />
      </Row>
      <Row className="justify-content-center">
        <RoleBox role="lecturer" title="Lecturer" icon="bi-person-video3" />
      </Row>
      <Row className="justify-content-center">
        <RoleBox role="student" title="Student" icon="bi-mortarboard" />
      </Row>
    </Container>
  );
};

export default HomePage;
