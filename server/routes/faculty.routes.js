const express = require("express");
const router = express.Router();

const { createFaculty, updateFaculty, getFaculty, getAllFaculties } = require("../controllers/faculty");

router.post("/create_faculty", createFaculty);

router.patch("/update_faculty", updateFaculty);


router.get("/get_faculty/:id", getFaculty);
router.get("/get_all_faculties", getAllFaculties);

module.exports = router;