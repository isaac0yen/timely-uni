import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Nav } from 'react-bootstrap';
import { FaUser, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import Session from '../helpers/Session';
import 'react-toastify/dist/ReactToastify.css';
import { api } from '../apis';
import "../css/Login.css";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.account.login(email, password);
      console.log(response);

      if (response.status === 200) {
        Session.setCookie('token', response.token);
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        toast.error('Invalid email or password');
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Nav className="justify-content-center py-3 bg-navy">
        <Nav.Item>
          <Nav.Link as={Link} to="/" className="text-white">Lecture Reminder System</Nav.Link>
        </Nav.Item>
      </Nav>

      <Container fluid className="flex-grow-1 d-flex align-items-center justify-content-center login-background">
        <Row className="w-100 justify-content-center">
          <Col md={4} className="text-center">
            <h1 className="mb-4 text-navy animate-fade-in">Welcome Back</h1>
            <h3 className="mb-5 text-muted animate-fade-in-delay">Kindly Login</h3>
            <Form onSubmit={handleSubmit} className="text-start">
              <Form.Group className="mb-4" controlId="email">
                <Form.Label className="d-flex align-items-center">
                  <FaUser className="me-2" /> Email address
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="py-2"
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label className="d-flex align-items-center">
                  <FaLock className="me-2" /> Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="py-2"
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 py-2 mb-3 d-flex align-items-center justify-content-center">
                <FaSignInAlt className="me-2" /> Login
              </Button>
            </Form>
            <div className="mt-3">
              <Button variant="link" as={Link} to="/forgot-password" className="text-decoration-none p-0">Forgot password?</Button>
            </div>
          </Col>
        </Row>
      </Container>
      <Nav className="justify-content-center py-3 bg-navy">
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/select-role"
            className="text-white"
          >
            <FaUserPlus className="me-2" /> Register
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default LoginPage;