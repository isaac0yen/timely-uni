const express = require("express");
const router = express.Router();

const { sendCode, loginuser, getAccount, addCarryOver, getAllInactive, updateInactive } = require("../controllers/account");
const authMiddleware = require("../Middleware/Auth");

router.post("/send_code", sendCode);
router.post("/login", loginuser);
router.get("/get_account/:id", authMiddleware, getAccount);
router.post("/add_carry_over", authMiddleware, addCarryOver);
router.get("/get_all_inactive", authMiddleware, getAllInactive);
router.patch("/update_inactive", authMiddleware, updateInactive);


module.exports = router;