const express = require("express");
const router = express.Router();

const { createAdmin, createStudent, createLecturer, updateAdmin, updateStudent, updateLecturer, getAdmin, getAllAdmins, getStudent, getAllStudents, getLecturer, getAllLecturers } = require("../controllers/user");
const authMiddleware = require("../Middleware/Auth");

router.post("/create_admin", createAdmin);
router.post("/create_student", createStudent);
router.post("/create_lecturer",  createLecturer);

router.patch("/update_admin", authMiddleware, updateAdmin);
router.patch("/update_student", authMiddleware, updateStudent);
router.patch("/update_lecturer", authMiddleware, updateLecturer);


router.get("/get_admin/:id", authMiddleware, getAdmin);
router.get("/get_all_admins", getAllAdmins);


router.get("/get_student/:id", authMiddleware, getStudent);
router.get("/get_all_students", getAllStudents);


router.get("/get_lecturer/:id", authMiddleware, getLecturer);
router.get("/get_all_lecturers", getAllLecturers);


module.exports = router;