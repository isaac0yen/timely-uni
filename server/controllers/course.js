const e = require("express");
const { db } = require("../helpers/Database");
const Validate = require("../helpers/Validate");

const createCourse = async (req, res) => {
  try {
    const { id: created_by } = req.context;
    const { name, department, faculty, code, lecturer, level } = req.body;

    if (!Validate.string(name)) {
      throw new Error("Name is required");
    }

    if (!Validate.integer(department)) {
      throw new Error("Department is required");
    }

    if (!Validate.integer(faculty)) {
      throw new Error("Faculty is required");
    }

    if (!Validate.string(code)) {
      throw new Error("Code is required");
    }

    if (!Validate.integer(lecturer)) {
      throw new Error("Lecturer is required");
    }

    const inserted = await db.insertOne("course", { name, department, faculty, code, lecturer, created_by, level });

    if (inserted < 1) {
      throw new Error("Sorry, an error occured.");
    }

    res.status(200).json({
      message: "Course created successfully",
    });

  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: error.message,
    });
  }
}

const updateCourse = () => {
  const { name, department, faculty, code, lecturer, id } = req.body;

  if (!Validate.integer(id)) {
    throw new Error("Invalid course");
  }

  if (!Validate.string(name)) {
    throw new Error("Name is required");
  }

  if (!Validate.integer(department)) {
    throw new Error("Department is required");
  }

  if (!Validate.integer(faculty)) {
    throw new Error("Faculty is required");
  }

  if (!Validate.string(code)) {
    throw new Error("Code is required");
  }

  if (!Validate.integer(lecturer)) {
    throw new Error("Lecturer is required");
  }

  const course = {
    name,
    department,
    faculty,
    code,
    lecturer,
  }

  const updated = db.updateOne("course", course, { id });

}

const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Validate.integer(id)) {
      throw new Error("Invalid ID");
    }

    const course = await db.findOne("course", { id });

    if (!Validate.object(course)) {
      throw new Error("Course not found");
    }

    res.status(200).json({
      message: "Course fetched successfully",
      status: 200,
      data: course,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

const getAllCourses = async (req, res) => {
  const { id, level } = req.params;
  console.log(id)

  const department = await db.findOne("user_department", { user_id: id })
  console.log(id, level)

  if (department === undefined || department === "undefined" || department === null || department === "null") {
    console.log(11)

    try {
      let courses = await db.findMany("course");

      if (!Validate.array(courses)) {
        throw new Error("No Courses found");
      }

      res.status(200).json({
        message: "Courses fetched successfully",
        status: 200,
        data: courses,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }

  } else {
    try {
      const query = { department: department.department_id };
      if (level != "null") {
        query.level = level;
      }
      const courses = await db.findMany("course", query);
      console.log(courses)
      if (!Validate.array(courses)) {
        throw new Error("No Courses found");
      }

      res.status(200).json({
        message: "Courses fetched successfully",
        status: 200,
        data: courses,
      });
    } catch (error) {
      console.log(error)
      res.status(400).json({
        message: error.message,
      });
    }
  }

}

module.exports = {
  createCourse,
  updateCourse,
  getCourse,
  getAllCourses,
}