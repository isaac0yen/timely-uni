const express = require("express");
const router = express.Router();

const { createDepartment, updateDepartment, getDepartment, getAllDepartments } = require("../controllers/department");

router.post("/create_department", createDepartment);

router.patch("/update_department", updateDepartment);

router.get("/get_department/:id", getDepartment);
router.get("/get_all_departments/:faculty", getAllDepartments);


module.exports = router;