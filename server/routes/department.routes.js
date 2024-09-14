const express = require("express");
const router = express.Router();

const { createDepartment, updateDepartment, getDepartment, getAllDepartments } = require("../controllers/department");
const authMiddleware = require("../Middleware/Auth");

router.post("/create_department", authMiddleware,createDepartment);

router.patch("/update_department",authMiddleware, updateDepartment);

router.get("/get_department/:id", authMiddleware,getDepartment);
router.get("/get_all_departments/:faculty", getAllDepartments);


module.exports = router;