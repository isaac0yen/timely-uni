const express = require("express");
const router = express.Router();

const { createFaculty, updateFaculty, getFaculty, getAllFaculties } = require("../controllers/faculty");
const authMiddleware = require("../Middleware/Auth");

router.post("/create_faculty", authMiddleware, createFaculty);

router.patch("/update_faculty", authMiddleware, updateFaculty);


router.get("/get_faculty/:id", authMiddleware, getFaculty);
router.get("/get_all_faculties", getAllFaculties);

module.exports = router;