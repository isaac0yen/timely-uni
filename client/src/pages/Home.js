import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import { FaUserTie, FaChalkboardTeacher, FaUserGraduate, FaHome, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import "../css/Home.css";

const RoleBox = ({ role, title, icon }) => (
  <Col xs={12} className="mb-4">
    <Card as={Link} to={`/login/${role}`} className="text-center text-decoration-none role-card">
      <Card.Body className="d-flex flex-row justify-content-start align-items-center p-4">
        {icon}
        <div className="ms-4 text-start">
          <Card.Title className="mb-2">{title}</Card.Title>
          <Card.Text>Click to continue as {title}</Card.Text>
        </div>
      </Card.Body>
    </Card>
  </Col>
);

const HomePage = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Nav className="justify-content-center py-3 bg-navy">
        <Nav.Item>
          <Nav.Link as={Link} to="/" className="text-white">Lecture Reminder System</Nav.Link>
        </Nav.Item>
      </Nav>

      <Container fluid className="flex-grow-1 d-flex flex-column justify-content-center py-5 home-background">
        <Row className="justify-content-center mb-5">
          <Col md={8} className="text-center">
            <h1 className="display-4 fw-bold text-navy animate-fade-in">Lecture Reminder System</h1>
            <p className="lead text-navy animate-fade-in-delay">Choose your role to get started</p>
          </Col>
        </Row>
        <Row className="justify-content-center animate-slide-up">
          <Col md={6}>
            <RoleBox role="admin" title="Admin" icon={<FaUserTie className="fs-1 text-navy" />} />
            <RoleBox role="lecturer" title="Lecturer" icon={<FaChalkboardTeacher className="fs-1 text-navy" />} />
            <RoleBox role="student" title="Student" icon={<FaUserGraduate className="fs-1 text-navy" />} />
          </Col>
        </Row>
      </Container>

      <Nav className="justify-content-center py-3 bg-navy">
        <Nav.Item>
          <Nav.Link as={Link} to="/" className="text-white"><FaHome /> Home</Nav.Link>
        </Nav.Item>
        {/* <Nav.Item>
          <Nav.Link as={Link} to="/login" className="text-white"><FaSignInAlt /> Login</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/register" className="text-white"><FaUserPlus /> Register</Nav.Link>
        </Nav.Item> */}
      </Nav>
    </div>
  );
};

export default HomePage;