import React, { useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert, Nav, Spinner } from 'react-bootstrap';
import { FaHome, FaSignInAlt } from 'react-icons/fa';
import { api } from '../apis';
import "../css/Register.css";
import Admin from './Register/Admin';
import StudentSelect from './Register/StudentSelect';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const { role } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  const code = searchParams.get('code');

  const [formData, setFormData] = useState({
    name: '',
    email: email || '',
    password: '',
    confirmPassword: '',
    code: code || '',
    matric_no: '',
    phone: '',
    classRep: false,
    level: '',
    faculty: '',
    department: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      let response;
      switch (role) {
        case 'lecturer':
          response = await api.user.createLecturer(formData);
          break;
        case 'student':
          response = await api.user.createStudent(formData);
          break;
        default:
          throw new Error('Invalid role');
      }

      if (response && response.status === 200) {
        toast.success('Registration successful!');
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  if (role === 'admin') {
    return <Admin />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Nav className="justify-content-center py-3 bg-navy">
        <Nav.Item>
          <Nav.Link as={Link} to="/" className="text-white">Lecture Reminder System</Nav.Link>
        </Nav.Item>
      </Nav>

      <Container fluid className="flex-grow-1 d-flex align-items-center justify-content-center register-background">
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={4} className="text-center">
            <h1 className="mb-4 text-navy animate-fade-in">Register as {role.charAt(0).toUpperCase() + role.slice(1)}</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="card animate-slide-up">
              <div className="card-body">
                <Form onSubmit={handleSubmit} className="text-start">
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      readOnly={!!email}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  {role === 'student' && (
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="matric_no">
                          <Form.Label>Matric Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="matric_no"
                            value={formData.matric_no}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="phone">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <StudentSelect formData={formData} handleChange={handleChange} />
                    </Row>
                  )}
                  <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ms-2">Registering...</span>
                      </>
                    ) : (
                      'Register'
                    )}
                  </Button>
                </Form>
              </div>
            </div>
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
        </Nav.Item>
      </Nav>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default RegisterPage;