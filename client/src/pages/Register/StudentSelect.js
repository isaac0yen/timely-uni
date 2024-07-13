import React, { useEffect, useState } from 'react'
import { Col, Form } from 'react-bootstrap'
import { api } from '../../apis';

function StudentSelect({ formData, handleChange }) {
  const [department, setDepartment] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [faculty, setFaculty] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [level, setLevel] = useState([]);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const facul = await api.faculty.getAllFaculties();
        if (facul.status === 200) {
          setFaculty(facul.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFaculties();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (selectedFaculty) {
        try {
          console.log(selectedFaculty);
          const dept = await api.department.getAllDepartments(selectedFaculty);
          if (dept.status === 200) {
            setDepartment(dept.data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchDepartments();
  }, [selectedFaculty]);

  useEffect(() => {
    const setleveler = async () => {
      await setLevel(['100', '200', '300', '400', '500']);
    }
    setleveler();
  }, [selectedDepartment]);

  return (
    <Col md={6}>
      <Form.Group className="mb-3" controlId="faculty">
        <Form.Label>Faculty</Form.Label>
        <Form.Select
          name="faculty"
          value={formData.faculty}
          onChange={e => { handleChange(e); setSelectedFaculty(e.target.value) }}
          required
        >
          <option value="">Select a faculty</option>
          {faculty.map((fac) => (
            <option key={fac.id} value={fac.id}>
              {fac.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {department.length > 0 &&
        <Form.Group className="mb-3" controlId="department">
          <Form.Label>Department</Form.Label>
          <Form.Select
            name="department"
            value={formData.department}
            onChange={e => { handleChange(e); setSelectedDepartment(e.target.value) }}
            required
          >
            <option value="">Select a department</option>
            {department.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>}

      {selectedDepartment &&
        <Form.Group className="mb-3" controlId="level">
          <Form.Label>Level</Form.Label>
          <Form.Select
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
          >
            <option value="">Select a level</option>
            {level.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </Form.Select>
        </Form.Group>}
    </Col>
  )
}

export default StudentSelect;