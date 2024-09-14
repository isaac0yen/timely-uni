const jwt = require("jsonwebtoken");
require("dotenv").config();

const { comparePass } = require("../helpers/Crypt");
const { db } = require("../helpers/Database");
const { generateFourIntegers } = require("../helpers/Generate");
const { Mail } = require("../helpers/Mail");
const Validate = require("../helpers/Validate");
const Logger = require("../helpers/Logger");

const sendCode = async (req, res) => {
  try {

    const { email } = req.body;

    if (!Validate.email(email)) {
      return res.status(400).json({
        message: "Email is invalid",
      });
    }

    const code = generateFourIntegers();

    const inserted = await db.insertOne("codes", { email, code });

    if (inserted < 0) {
      return res.status(400).json({
        message: "Sorry, an error occured.",
      });
    }

    const message = `Your code is ${code}`;

    await Mail(email, message, "Code");

    return res.status(200).json({
      status: 200,
      message: "Code sent successfully",
    });

  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

const loginuser = async (req, res) => {
  try {
    const { email, password, fcm_token } = req.body;

    if (!Validate.email(email)) {
      throw new Error("Email is invalid")
    }

    if (!Validate.string(password)) {
      throw new Error("Password is invalid")
    }

    const user = await db.findOne("users", { email });

    if (!Validate.object(user)) {
      throw new Error("User does not exist.");
    }

    if (user?.status !== "ACTIVE") {
      throw new Error("User has not been activated yet.");
    }

    if (!comparePass(password, user.password)) {
      throw new Error("Password is incorrect")
    }

    await db.updateOne("users", { fcm_token }, { id: user.id });
    Logger.info("token", { fcm_token, user: user.id })

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      status: 200,
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    console.log(error);
    res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
}

const getAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { DateTime } = require('luxon');
    const today = DateTime.now().setZone('Africa/Lagos').toFormat('yyyy-MM-dd');

    let query;
    if (req.context.role !== 'student') {
      query = `
        SELECT u.id, u.name, u.role, u.email, u.matric_no, u.classRep, u.level, u.status,
               d.name AS department_name,
               t.id AS timetable_id, t.time_start, t.time_end, t.date,
               c.name AS course_name,
               l.name AS lecturer_name
        FROM users u
        LEFT JOIN user_department ud ON u.id = ud.user_id
        LEFT JOIN department d ON ud.department_id = d.id
        LEFT JOIN timetable t ON d.id = t.department AND t.date = ?
        LEFT JOIN course c ON t.course = c.id
        LEFT JOIN users l ON c.lecturer = l.id
        WHERE u.id = ?
      `;
    } else {
      query = `
        SELECT u.id, u.name, u.role, u.email, u.matric_no, u.classRep, u.level, u.status,
               d.name AS department_name,
               t.id AS timetable_id, t.time_start, t.time_end, t.date,
               c.name AS course_name,
               l.name AS lecturer_name
        FROM users u
        LEFT JOIN user_department ud ON u.id = ud.user_id
        LEFT JOIN department d ON ud.department_id = d.id
        LEFT JOIN timetable t ON d.id = t.department AND u.level = t.level AND t.date = ?
        LEFT JOIN course c ON t.course = c.id
        LEFT JOIN users l ON c.lecturer = l.id
        WHERE u.id = ?
      `;
    }
    const [result] = await db.executeDirect(query, [today, id]);

    console.log(result);

    if (!result.length) {
      throw new Error("User does not exist.");
    }

    const user = {
      id: result[0].id,
      name: result[0].name,
      role: result[0].role,
      email: result[0].email,
      matric_no: result[0].matric_no,
      classRep: result[0].classrep,
      level: result[0].level,
      status: result[0].status,
      department: result[0].department_name || null,
      timetables: []
    };

    result.forEach(row => {
      if (row.timetable_id) {
        user.timetables.push({
          id: row.timetable_id,
          time_start: row.time_start,
          time_end: row.time_end,
          date: row.date,
          course: row.course_name,
          lecturer: row.lecturer_name,
        });
      }
    });

    res.status(200).json({
      status: 200,
      message: "User found successfully",
      data: user,
    });

  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
}

const addCarryOver = async (req, res) => {
  try {
    const { user_id, course_id, course_name } = req.body;

    if (!parseInt(user_id) > 1) {
      throw new Error("User ID is invalid");
    }
    if (!parseInt(course_id) > 1) {
      throw new Error("Course ID is invalid");
    }
    if (course_name.length < 1) {
      throw new Error("Course name is invalid");
    }

    const existingRecord = await db.findOne("carry_over", { user_id, course_id });
    if (existingRecord) {
      throw new Error("Carry over record already exists for this user and course");
    }

    const object = {
      user_id,
      course_id,
      course_name
    }

    const inserted = await db.insertOne("carry_over", object);

    res.status(200).json({
      status: 200,
      message: "Carry over added successfully",
      data: inserted,
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
}

const getAllInactive = async (req, res) => {

  if (req.context.role !== 'admin') {
    res.status(401).json({
      status: 401,
      message: "You are not authorized to perform this action",
    });
    return;
  }

  try {
    const allInactive = await db.findMany("users", { status: "INACTIVE" });

    res.status(200).json({
      status: 200,
      message: "All inactive users found successfully",
      data: allInactive,
    });
  } catch (error) {
    res.status(200).json({
      status: 400,
      message: error.message,
    });
  }
}

const updateInactive = async (req, res) => {

  if (req.context.role !== 'admin') {
    res.status(401).json({
      status: 401,
      message: "You are not authorized to perform this action",
    });
    return;
  }

  try {
    const { id, status, email } = req.body;

    console.log({ id, status, email })

    if (parseInt(id) < 1) {
      throw new Error("User ID is invalid");
    }

    if (!Validate.email(email)) {
      throw new Error("Email is invalid");
    }

    if (status !== "ACTIVE" && status !== "INACTIVE" && status !== "DELETED") {
      throw new Error("Status is invalid");
    }

    const updated = await db.updateOne("users", { status }, { id });

    if (updated < 1) {
      throw new Error("User not found");
    }

    res.status(200).json({
      status: 200,
      message: "User updated successfully",
      data: updated,
    });

    await Mail(email, "Your account has been approved, Kindly login <a href=\"https://temi.isaac0yen.com/\">here </a>", "YOUR ACCOUNT HAS BEEN APPROVED");

  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message,
    });
  }

}

module.exports = {
  sendCode,
  loginuser,
  getAccount,
  addCarryOver,
  getAllInactive,
  updateInactive
};
