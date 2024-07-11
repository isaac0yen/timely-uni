const express = require("express");
const router = express.Router();

const { sendCode, loginuser } = require("../controllers/account");

router.post("/send_code", sendCode);
router.post("/login", loginuser);


module.exports = router;