import React, { useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../apis';
import "../css/Register.css"; // Import custom CSS for additional styling
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const RegisterPage = () => {
  const { role } = useParams();
  const location = useLocation();
  const history = useNavigate();
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      let response;
      switch (role) {
        case 'admin':
          response = await api.user.createAdmin(formData);
          break;
        case 'lecturer':
          response = await api.user.createLecturer(formData);
          break;
        case 'student':
          response = await api.user.createStudent(formData);
          break;
        default:
          throw new Error('Invalid role');
      }
      history.push(`/login/${role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    }
  };

  return (
    <Container fluid className="register-page vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4} className="text-center">
          <h1 className="mb-4 text-primary">Register as {role.charAt(0).toUpperCase() + role.slice(1)}</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <div className="card">
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
                <Form.Group className="mb-3" controlId="code">
                  <Form.Label>Verification Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    readOnly={!!code}
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
                      <Form.Group className="mb-3" controlId="classRep">
                        <Form.Check
                          type="checkbox"
                          id="classRep"
                          name="classRep"
                          label="I am a class representative"
                          checked={formData.classRep}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="level">
                        <Form.Label>Level</Form.Label>
                        <Form.Control
                          type="text"
                          name="level"
                          value={formData.level}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="faculty">
                        <Form.Label>Faculty</Form.Label>
                        <Form.Control
                          type="text"
                          name="faculty"
                          value={formData.faculty}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="department">
                        <Form.Label>Department</Form.Label>
                        <Form.Control
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}
                <Button variant="primary" type="submit" className="w-100">
                  Register
                </Button>
              </Form>
            </div>
          </div>
          <div className="text-center mt-3">
            Already have an account? <Link to={`/login/${role}`}>Login</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
