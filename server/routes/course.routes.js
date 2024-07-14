const express = require("express");
const router = express.Router();

const { createCourse, updateCourse, getCourse, getAllCourses } = require("../controllers/course");

router.post("/create_course", createCourse);

router.patch("/update_course", updateCourse);

router.get("/get_course/:id", getCourse);
router.get("/get_all_courses/:id", getAllCourses);

module.exports = router;