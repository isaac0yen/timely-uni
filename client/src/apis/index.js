import axios from "axios";
import Session from "../helpers/Session";

const url = "http://localhost:8080/api/v1";

const token = Session.getCookie("token");




/**
 * @description API client for the School Management System
 */
export const api = {
  account: {
    /**
     * @description Send a verification code to the provided email
     * @param {string} email - The email address to send the code to
     * @returns {Promise<Object>} Response data
     */
    sendCode: async (email) => {
      const response = await axios.post(`${url}/account/send_code`, { email }, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Authenticate a user and get a JWT token
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise<Object>} Response data with JWT token
     */
    login: async (email, password) => {
      const response = await axios.post(`${url}/account/login`, { email, password }, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Get account details for a user
     * @param {string} id - User's ID
     * @returns {Promise<Object>} Response data with user account details
     */
    getAccount: async (id) => {
      const response = await axios.get(`${url}/account/get_account/${id}`, { headers: { Authorization: token } });
      return response.data;
    },
  },

  user: {
    /**
     * @description Create a new admin user
     * @param {Object} adminData - Admin user data
     * @returns {Promise<Object>} Response data
     */
    createAdmin: async (adminData) => {
      const response = await axios.post(`${url}/user/create_admin`, adminData, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Create a new student user
     * @param {Object} studentData - Student user data
     * @returns {Promise<Object>} Response data
     */
    createStudent: async (studentData) => {
      const response = await axios.post(`${url}/user/create_student`, studentData, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Create a new lecturer user
     * @param {Object} lecturerData - Lecturer user data
     * @returns {Promise<Object>} Response data
     */
    createLecturer: async (lecturerData) => {
      const response = await axios.post(`${url}/user/create_lecturer`, lecturerData, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Update an admin user's information
     * @param {Object} adminData - Updated admin user data
     * @returns {Promise<Object>} Response data
     */
    updateAdmin: async (adminData) => {
      const response = await axios.patch(`${url}/user/update_admin`, adminData, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Update a student user's information
     * @param {Object} studentData - Updated student user data
     * @returns {Promise<Object>} Response data
     */
    updateStudent: async (studentData) => {
      const response = await axios.patch(`${url}/user/update_student`, studentData, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Update a lecturer user's information
     * @param {Object} lecturerData - Updated lecturer user data
     * @returns {Promise<Object>} Response data
     */
    updateLecturer: async (lecturerData) => {
      const response = await axios.patch(`${url}/user/update_lecturer`, lecturerData, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Get information about a specific admin
     * @param {number} id - Admin user ID
     * @returns {Promise<Object>} Response data with admin information
     */
    getAdmin: async (id) => {
      const response = await axios.get(`${url}/user/get_admin/${id}`, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Get information about all admins
     * @returns {Promise<Object>} Response data with list of admins
     */
    getAllAdmins: async () => {
      const response = await axios.get(`${url}/user/get_all_admins`, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Get information about a specific student
     * @param {number} id - Student user ID
     * @returns {Promise<Object>} Response data with student information
     */
    getStudent: async (id) => {
      const response = await axios.get(`${url}/user/get_student/${id}`, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Get information about all students in a department
     * @param {number} department - Department ID
     * @returns {Promise<Object>} Response data with list of students
     */
    getAllStudents: async (department) => {
      const response = await axios.get(`${url}/user/get_all_students`, { params: { department }, headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Get information about a specific lecturer
     * @param {number} id - Lecturer user ID
     * @returns {Promise<Object>} Response data with lecturer information
     */
    getLecturer: async (id) => {
      const response = await axios.get(`${url}/user/get_lecturer/${id}`, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Get information about all lecturers
     * @returns {Promise<Object>} Response data with list of lecturers
     */
    getAllLecturers: async () => {
      const response = await axios.get(`${url}/user/get_all_lecturers`, { headers: { Authorization: token } });
      return response.data;
    },
  },

  department: {
    /**
     * @description Create a new department
     * @param {Object} departmentData - Department data
     * @returns {Promise<Object>} Response data
     */
    createDepartment: async (departmentData) => {
      const response = await axios.post(`${url}/department/create_department`, departmentData, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Update a department's information
     * @param {Object} departmentData - Updated department data
     * @returns {Promise<Object>} Response data
     */
    updateDepartment: async (departmentData) => {
      const response = await axios.patch(`${url}/department/update_department`, departmentData, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Get information about a specific department
     * @param {number} id - Department ID
     * @returns {Promise<Object>} Response data with department information
     */
    getDepartment: async (id) => {
      const response = await axios.get(`${url}/department/get_department/${id}`, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Get information about all departments
     * @returns {Promise<Object>} Response data with list of departments
     */
    getAllDepartments: async (faculty) => {
      const response = await axios.get(`${url}/department/get_all_departments/${faculty}`, { headers: { Authorization: token } });
      return response.data;
    },
  },

  faculty: {
    /**
     * @description Create a new faculty
     * @param {Object} facultyData - Faculty data
     * @returns {Promise<Object>} Response data
     */
    createFaculty: async (facultyData) => {
      const response = await axios.post(`${url}/faculty/create_faculty`, facultyData, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Update a faculty's information
     * @param {Object} facultyData - Updated faculty data
     * @returns {Promise<Object>} Response data
     */
    updateFaculty: async (facultyData) => {
      const response = await axios.patch(`${url}/faculty/update_faculty`, facultyData, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Get information about a specific faculty
     * @param {number} id - Faculty ID
     * @returns {Promise<Object>} Response data with faculty information
     */
    getFaculty: async (id) => {
      const response = await axios.get(`${url}/faculty/get_faculty/${id}`, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Get information about all faculties
     * @returns {Promise<Object>} Response data with list of faculties
     */
    getAllFaculties: async () => {
      const response = await axios.get(`${url}/faculty/get_all_faculties`, { headers: { Authorization: token } });
      return response.data;
    },
  },

  course: {
    /**
     * @description Create a new course
     * @param {Object} courseData - Course data
     * @returns {Promise<Object>} Response data
     */
    createCourse: async (courseData) => {
      const response = await axios.post(`${url}/course/create_course`, courseData, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Update a course's information
     * @param {Object} courseData - Updated course data
     * @returns {Promise<Object>} Response data
     */
    updateCourse: async (courseData) => {
      const response = await axios.patch(`${url}/course/update_course`, courseData, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Get information about a specific course
     * @param {number} id - Course ID
     * @returns {Promise<Object>} Response data with course information
     */
    getCourse: async (id) => {
      const response = await axios.get(`${url}/course/get_course/${id}`, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Get information about all courses
     * @param {number} id - Course ID
     * @returns {Promise<Object>} Response data with list of courses
     */
    getAllCourses: async (id) => {
      const response = await axios.get(`${url}/course/get_all_courses/${id}`, { headers: { Authorization: token } });
      return response.data;
    },
  },

  room: {
    /**
     * @description Create a new room
     * @param {Object} roomData - Room data
     * @returns {Promise<Object>} Response data
     */
    createRoom: async (roomData) => {
      const response = await axios.post(`${url}/room/create_room`, roomData, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Update a room's information
     * @param {Object} roomData - Updated room data
     * @returns {Promise<Object>} Response data
     */
    updateRoom: async (roomData) => {
      const response = await axios.patch(`${url}/room/update_room`, roomData, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Get information about a specific room
     * @param {number} id - Room ID
     * @returns {Promise<Object>} Response data with room information
     */
    getRoom: async (id) => {
      const response = await axios.get(`${url}/room/get_room/${id}`, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Get information about all rooms
     * @returns {Promise<Object>} Response data with list of rooms
     */
    getAllRooms: async () => {
      const response = await axios.get(`${url}/room/get_all_rooms`, { headers: { Authorization: token } });
      return response.data;
    },
  },

  timetable: {
    /**
     * @description Create a new timetable entry
     * @param {Object} timetableData - Timetable entry data
     * @returns {Promise<Object>} Response data
     */
    createTimetable: async (timetableData) => {
      const response = await axios.post(`${url}/timetable/create_timetable`, timetableData, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Update a timetable entry's information
     * @param {Object} timetableData - Updated timetable entry data
     * @returns {Promise<Object>} Response data
     */
    updateTimetable: async (timetableData) => {
      const response = await axios.patch(`${url}/timetable/update_timetable`, timetableData, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Get information about a specific timetable entry
     * @param {number} id - Timetable entry ID
     * @returns {Promise<Object>} Response data with timetable entry information
     */
    getTimetable: async (id) => {
      const response = await axios.get(`${url}/timetable/get_timetable/${id}`, { headers: { Authorization: token } });
      return response.data;
    },

    /**
     * @description Get information about all timetable entries for a specific course and level
     * @param {number} course - Course ID
     * @param {number} level - Level
     * @returns {Promise<Object>} Response data with list of timetable entries
     */
    getAllTimetables: async (id, level) => {
      const response = await axios.get(`${url}/timetable/get_all_timetables/${id}/${level}`, { headers: { Authorization: token } });
      return response.data;
    },
  },
};
