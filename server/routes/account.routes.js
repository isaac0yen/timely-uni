const express = require("express");
const router = express.Router();

const { sendCode, loginuser, getAccount } = require("../controllers/account");

router.post("/send_code", sendCode);
router.post("/login", loginuser);
router.get("/get_account/:id", getAccount);


module.exports = router;