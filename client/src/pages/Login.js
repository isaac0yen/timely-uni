import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { api } from '../apis';
import "../css/Login.css";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { role } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (role === 'admin') {
        // Redirect Admins to EmailVerification page
        navigate(`/verify-email?role=${role}`);
      } else {
        const response = await api.account.login(email, password);
        localStorage.setItem('token', response.token);
        navigate(`/${role}-dashboard`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <Container fluid className="login-page vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'}}>
      <Row className="w-100 justify-content-center">
        <Col md={4} className="text-center">
          <h1 className="mb-4 text-primary">Welcome Back</h1>
          <h3 className="mb-5 text-muted">Login as {role.charAt(0).toUpperCase() + role.slice(1)}</h3>
          {error && <Alert variant="danger">{error}</Alert>}
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
          <div className="mt-4">
            {role === 'admin' ? (
              <Link to={`/verify-email?role=${role}`} className="text-decoration-none me-3">Create an account</Link>
            ) : (
              <Link to={`/register/${role}`} className="text-decoration-none me-3">Create an account</Link>
            )}
            <Link to="/" className="text-decoration-none">Back to Home</Link>
          </div>
          <div className="mt-3">
            <a href="#" className="text-decoration-none">Forgot password?</a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
