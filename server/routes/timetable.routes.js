const express = require("express");
const router = express.Router();

const { createTimetable, updateTimetable, getTimetable, getAllTimetables } = require("../controllers/timetable");
const authMiddleware = require("../Middleware/Auth");

router.post("/create_timetable",authMiddleware, createTimetable);

router.patch("/update_timetable", authMiddleware,updateTimetable);


router.get("/get_timetable/:id",authMiddleware, getTimetable);
router.get("/get_all_timetables/:id/:level",authMiddleware, getAllTimetables);

module.exports = router;