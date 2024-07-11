const express = require("express");
const router = express.Router();

const { createAdmin, createStudent, createLecturer, updateAdmin, updateStudent, updateLecturer, getAdmin, getAllAdmins, getStudent, getAllStudents, getLecturer, getAllLecturers } = require("../controllers/user");

router.post("/create_admin", createAdmin);
router.post("/create_student", createStudent);
router.post("/create_lecturer", createLecturer);

router.patch("/update_admin", updateAdmin);
router.patch("/update_student", updateStudent);
router.patch("/update_lecturer", updateLecturer);


router.get("/get_admin/:id", getAdmin);
router.get("/get_all_admins", getAllAdmins);


router.get("/get_student/:id", getStudent);
router.get("/get_all_students", getAllStudents);


router.get("/get_lecturer/:id", getLecturer);
router.get("/get_all_lecturers", getAllLecturers);


module.exports = router;