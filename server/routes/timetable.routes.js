const express = require("express");
const router = express.Router();

const { createTimetable, updateTimetable, getTimetable, getAllTimetables } = require("../controllers/timetable");

router.post("/create_timetable", createTimetable);

router.patch("/update_timetable", updateTimetable);


router.get("/get_timetable/:id", getTimetable);
router.get("/get_all_timetables/:id/:level", getAllTimetables);

module.exports = router;