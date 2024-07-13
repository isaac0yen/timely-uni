import React, { useState } from 'react';
import { Card, Form, Button, Container, Alert, Nav } from 'react-bootstrap';
import { FaEnvelope, FaPaperPlane, FaCheckCircle, FaSignInAlt, FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api } from '../../apis/index';


const Footer = () => {
  return (
    <Nav className="justify-content-center py-3 bg-navy fixed-bottom">
      <Nav.Item>
        <Nav.Link as={Link} to="/" className="text-white"><FaHome /> Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/login" className="text-white"><FaSignInAlt /> Login</Nav.Link>
      </Nav.Item>
    </Nav>
  )
}

const SendConfirmMail = ({ updateState }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await api.account.sendCode(email);
      console.log(result);
      if (result.status === 200) {
        toast.success('Confirmation email sent successfully');

        setTimeout(() => {
          setIsSent(true);
          updateState(true);
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while sending the confirmation email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container className="align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Card className="shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
          <Card.Body className="p-5">
            <h2 className="text-center mb-4" style={{ color: '#0056b3' }}>
              <FaEnvelope className="me-2" />
              Send Confirmation Email
            </h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ borderColor: '#4d94ff' }}
                />
              </Form.Group>
              <div className="d-grid">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isLoading || isSent}
                  style={{ backgroundColor: '#0056b3', borderColor: '#0056b3' }}
                >
                  {isLoading ? (
                    'Sending...'
                  ) : isSent ? (
                    <>
                      <FaCheckCircle className="me-2" />
                      Sent
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="me-2" />
                      Send Confirmation
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
        <Footer />
      </Container>
    </>
  );
};

function Admin() {
  const [hasSentMail, setHasSentMail] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    code: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Verification code is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { name, email, password, code, phone } = formData;

      try {
        const registered = await api.user.createAdmin({ name, email, password, code, phone });
        if (registered.status === 200) {
          toast.success('Admin created successfully');
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          toast.error(registered.message || 'Something went wrong');
        }
      } catch (error) {
        toast.error(error.message || 'An error occurred');
      }
    }
  };

  if (!hasSentMail) {
    return (
      <div className="container mt-5">
        <SendConfirmMail updateState={setHasSentMail} />
        <ToastContainer />
      </div>
    )
  }
  return (
    <>
      <Nav className="justify-content-center py-3 bg-navy">
        <Nav.Item>
          <Nav.Link as={Link} to="/" className="text-white">Lecture Reminder System</Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Admin Registration</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      isInvalid={!!errors.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="code">
                    <Form.Label>Verification Code From the Email</Form.Label>
                    <Form.Control
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      isInvalid={!!errors.code}
                    />
                    <Form.Control.Feedback type="invalid">{errors.code}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      isInvalid={!!errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                  </Form.Group>
                  <div className="d-grid">
                    <Button variant="primary" type="submit" size="lg">
                      Register
                    </Button>
                  </div>
                </Form>
                {Object.keys(errors).length > 0 && (
                  <Alert variant="danger" className="mt-3">
                    Please correct the errors in the form before submitting.
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <ToastContainer />
      </div>
    </>
  )
}

export default Admin
