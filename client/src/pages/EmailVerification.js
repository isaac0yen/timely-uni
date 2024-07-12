import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Card, Nav } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaHome, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { api } from '../apis';
import "../css/EmailVerification.css";

const EmailVerificationPage = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get('role');

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.account.sendCode(email);
      setStep('code');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while sending the code');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.account.verifyCode(email, code);
      navigate(`/register/${role}?email=${email}&code=${code}`);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while verifying the code');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Nav className="justify-content-center py-3 bg-navy">
        <Nav.Item>
          <Nav.Link as={Link} to="/" className="text-white">Lecture Reminder System</Nav.Link>
        </Nav.Item>
      </Nav>

      <Container fluid className="flex-grow-1 d-flex flex-column justify-content-center py-5 email-verification-background">
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="shadow animate-slide-up">
              <Card.Body className="p-4">
                <h2 className="text-center mb-4 text-navy">Email Verification</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {step === 'email' ? (
                  <Form onSubmit={handleSendCode} className="animate-fade-in">
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label className="d-flex align-items-center">
                        <FaEnvelope className="me-2 text-navy" /> Email address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                      Send Verification Code
                    </Button>
                  </Form>
                ) : (
                  <Form onSubmit={handleVerifyCode} className="animate-fade-in">
                    <Form.Group className="mb-3" controlId="code">
                      <Form.Label className="d-flex align-items-center">
                        <FaLock className="me-2 text-navy" /> Verification Code
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter verification code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                      Verify Code
                    </Button>
                  </Form>
                )}
              </Card.Body>
            </Card>
            {/* <div className="text-center mt-3 animate-fade-in-delay">
              <Link to={`/login/${role}`} className="text-decoration-none me-2 text-navy">Login</Link>
              |
              <Link to="/" className="text-decoration-none ms-2 text-navy">Back to Home</Link>
            </div> */}
          </Col>
        </Row>
      </Container>

      
      <Nav className="justify-content-center py-3 bg-navy">
        <Nav.Item>
          <Nav.Link as={Link} to="/" className="text-white"><FaHome /> Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/login" className="text-white"><FaSignInAlt /> Login</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to= {`/register/${role}`}className="text-white"><FaUserPlus /> Register</Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default EmailVerificationPage;