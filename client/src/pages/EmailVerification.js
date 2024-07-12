import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { api } from '../apis';

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
      await api.account.sendCode(email); // Call your API to send the verification code
      setStep('code'); // Move to the next step
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while sending the code');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Implement actual code verification logic here
      // For demonstration, we'll assume the code is valid and proceed to the registration page
      await api.account.verifyCode(email, code); // Call your API to verify the code
      navigate(`/register/${role}?email=${email}&code=${code}`);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while verifying the code');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Email Verification</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {step === 'email' ? (
                <Form onSubmit={handleSendCode}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
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
                <Form onSubmit={handleVerifyCode}>
                  <Form.Group className="mb-3" controlId="code">
                    <Form.Label>Verification Code</Form.Label>
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
          <div className="text-center mt-3">
            <Link to={`/login/${role}`} className="text-decoration-none me-2">Login</Link>
            |
            <Link to="/" className="text-decoration-none ms-2">Back to Home</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EmailVerificationPage;
