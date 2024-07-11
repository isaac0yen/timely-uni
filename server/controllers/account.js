const jwt = require("jsonwebtoken");
require("dotenv").config();

const { comparePass } = require("../helpers/Crypt");
const { db } = require("../helpers/Database");
const { generateFourIntegers } = require("../helpers/Generate");
const { Mail } = require("../helpers/Mail");
const Validate = require("../helpers/Validate");

const sendCode = (req, res) => {
  const { email } = req.body;

  if (!Validate.email(email)) {
    return res.status(400).json({
      message: "Email is invalid",
    });
  }

  const code = generateFourIntegers();

  const inserted = db.insertOne("codes", { email, code });

  if (inserted < 0) {
    return res.status(400).json({
      message: "Sorry, an error occured.",
    });
  }

  const message = `Your code is ${code}`;

  Mail(email, message, "Code");
};

const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!Validate.email(email)) {
      throw new Error("Email is invalid")
    }

    if (!Validate.string(password)) {
      throw new Error("Password is invalid")
    }

    const user = await db.findOne("users", { email });

    if (!Validate.object(user)) {
      throw new Error("User does not exist, please register.")
    }

    if (!comparePass(password, user.password)) {
      throw new Error("Password is incorrect")
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = {
  sendCode,
  loginuser
};