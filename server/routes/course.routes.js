const express = require("express");
const router = express.Router();

const { createCourse, updateCourse, getCourse, getAllCourses } = require("../controllers/course");
const authMiddleware = require("../Middleware/Auth");

router.post("/create_course", authMiddleware, createCourse);

router.patch("/update_course", authMiddleware, updateCourse);

router.get("/get_course/:id", authMiddleware, getCourse);
router.get("/get_all_courses/:id/:level", getAllCourses);

module.exports = router;