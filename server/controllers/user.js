const Validate = require("../helpers/Validate");
const { db } = require("../helpers/Database");
const { cipherPass } = require("../helpers/Crypt");

const createAdmin = async (req, res) => {
  try {

    const { name, email, password, code, phone } = req.body;

    if (!Validate.string(name)) {
      throw new Error("Name is required");
    }
    if (!Validate.email(email)) {
      throw new Error("Name is required");
    }
    if (!Validate.string(password)) {
      throw new Error("Password is required");
    }
    if (parseInt(code) < 0) {
      throw new Error("Code is invalid");
    }

    const codeExists = await db.findOne("codes", { email, code: code });

    if (!codeExists) {
      throw new Error("Code is invalid");
    }

    const hashedPassword = cipherPass(password);

    const admin = {
      name,
      email,
      password: hashedPassword,
      role: "admin",
      phone: Validate.formatPhone(phone),
    };

    const inserted = await db.insertOne("users", admin);

    if (inserted < 1) {
      throw new Error("Sorry, an error occured.");
    }

    await db.deleteMany("codes", { email });

    res.status(200).json({
      status: 200,
      message: "Admin created successfully",
    });

  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
}

const createStudent = async (req, res) => {
  try {

    const { name, email, password, matric_no, phone, classRep, level, faculty, department } = req.body;

    if (!Validate.string(name)) {
      throw new Error("Name is required");
    }
    if (!Validate.email(email)) {
      throw new Error("Invalid email");
    }
    if (!Validate.string(password)) {
      throw new Error("Password is required");
    }
    if (!Validate.string(matric_no)) {
      throw new Error("Invalid matric number");
    }
    if (!Validate.phone(phone)) {
      throw new Error("Invalid phone number");
    }
    if (parseInt(level) < 0) {
      throw new Error("Invalid level");
    }
    if (Validate.integer(faculty)) {
      throw new Error("Invalid faculty");
    }
    if (Validate.integer(department)) {
      throw new Error("Invalid department");
    }

    const hashedPassword = cipherPass(password);

    const student = {
      name,
      email,
      password: hashedPassword,
      matric_no,
      phone,
      classRep: false,
      role: "student",
      level,
    };

    const inserted = await db.insertOne("users", student);

    if (inserted < 1) {
      throw new Error("Sorry, an error occurred.");
    }

    const insertedDepartment = await db.insertOne("user_department", { user_id: inserted, department_id: department });


    if (insertedDepartment < 1) {
      /* THIS IS A VERY BAD PRACTICE! */
      await db.deleteOne("users", { id: inserted });
      throw new Error("Sorry, an error occurred.");
    }

    res.status(200).json({
      status: 200,
      message: "Student created successfully",
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

const createLecturer = async (req, res) => {
  const { name, email, password } = req.body;

  if (!Validate.string(name)) {
    throw new Error("Name is required");
  }

  if (!Validate.email(email)) {
    throw new Error("Invalid email");
  }

  if (!Validate.string(password)) {
    throw new Error("Password is required");
  }

  const hashedPassword = cipherPass(password);

  const lecturer = {
    name,
    email,
    password: hashedPassword,
    role: "lecturer",
  }

  const inserted = await db.insertOne("users", lecturer);

  if (inserted < 1) {
    throw new Error("Sorry, an error occured.");
  }

  res.status(200).json({
    status: 200,
    message: "Lecturer created successfully",
  });

}

const updateAdmin = async (req, res) => {
  const { id } = req.context;
  const { name, email } = req.body;

  if (Validate.integer(id)) {
    throw new Error("RELOGIN")
  }

  if (!Validate.string(name)) {
    throw new Error("Name is required");
  }

  if (!Validate.email(email)) {
    throw new Error("Invalid email");
  }

  const admin = {
    name,
    email,
  }

  const updated = await db.updateOne("user", admin, { id, status: "admin" });

  if (updated < 1) {
    throw new Error("Sorry, an error occured.");
  }

  res.status(200).json({
    status: 200,
    message: "Admin updated successfully",
  });
}

const updateStudent = async (req, res) => {
  const { name, email, matric_no, phone, classRep, level } = req.body;

  if (!Validate.string(name)) {
    throw new Error("Name is required");
  }
  if (!Validate.email(email)) {
    throw new Error("Invalid email");
  }
  if (!Validate.string(matric_no)) {
    throw new Error("Invalid matric number");
  }
  if (!Validate.phone(phone)) {
    throw new Error("Invalid phone number");
  }
  if (classRep !== "true" && classRep !== "false") {
    throw new Error("Invalid classRep value");
  }
  if (!Validate.integer(level)) {
    throw new Error("Invalid level");
  }

  const student = {
    name,
    email,
    matric_no,
    phone,
    classRep,
    role: "student",
    level
  };

  const updated = await db.updateOne("user", student, { id, status: "student" });

  if (updated < 1) {
    throw new Error("Sorry, an error occured")
  }

  res.status(200).json({
    status: 200,
    message: "Student updated successfully",
  });

}

const updateLecturer = async (req, res) => {
  const { name, email } = req.body;

  if (!Validate.string(name)) {
    throw new Error("Name is required");
  }

  if (!Validate.email(email)) {
    throw new Error("Invalid email");
  }

  const lecturer = {
    name,
    email,
  }

  const updated = await db.updateOne("user", lecturer, { id, status: "lecturer" });

  if (updated < 1) {
    throw new Error("Sorry, an error occured.")
  }

  res.status(200).json({
    status: 200,
    message: "Lecturer updated successfully",
  });
}

const getAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Validate.integer(id)) {
      throw new Error("Invalid admin");
    }

    const admin = await db.findOne("user", { id, role: "admin" });

    if (!Validate.object(admin)) {
      throw new Error("Couldn't find admin");
    }

    res.status(200).json({
      status: 200,
      message: "Admin found successfully",
      data: admin,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

const getAllAdmins = async (req, res) => {
  try {
    const admins = await db.findMany("user", { role: "admin" });
    if (!Validate.array(admins)) {
      throw new Error("Couldn't find admins");
    }

    res.status(200).json({
      status: 200,
      message: "Admins found successfully",
      data: admins,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

const getStudent = async () => {
  try {
    const { id } = req.params;

    if (!Validate.integer(id)) {
      throw new Error("Invalid student");
    }

    const student = await db.findOne("user", { id, role: "student" });

    if (!Validate.object(student)) {
      throw new Error("Couldn't find student");
    }

    res.status(200).json({
      status: 200,
      message: "Student found successfully",
      data: student,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

const getAllStudents = async () => {
  try {

    const { department } = req.params;

    if (!Validate.integer(department)) {
      throw new Error("Invalid department");
    }

    const students = await db.findMany("user", { role: "student", department });

    if (!Validate.array(students)) {
      throw new Error("Couldn't find students");
    }

    res.status(200).json({
      status: 200,
      message: "Students found successfully",
      data: admins,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

const getLecturer = async () => {
  try {
    const { id } = req.params;

    if (!Validate.integer(id)) {
      throw new Error("Invalid lecturer");
    }

    const lecturer = await db.findOne("user", { id, role: "lecturer" });

    if (!Validate.object(lecturer)) {
      throw new Error("Couldn't find lecturer");
    }

    res.status(200).json({
      status: 200,
      message: "Lecturer found successfully",
      data: lecturer,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

const getAllLecturers = async () => {
  try {
    const lecturers = await db.findMany("user", { role: "lecturer" });
    if (!Validate.array(lecturers)) {
      throw new Error("Couldn't find lecturers");
    }

    res.status(200).json({
      status: 200,
      message: "Lecturers found successfully",
      data: lecturers,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = {
  createAdmin,
  createStudent,
  createLecturer,
  updateAdmin,
  updateStudent,
  updateLecturer,
  getAdmin,
  getAllAdmins,
  getStudent,
  getAllStudents,
  getLecturer,
  getAllLecturers
}