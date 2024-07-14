const Validate = require("../helpers/Validate");
const { db } = require("../helpers/Database")
const createTimetable = async (req, res) => {
  try {
    const { id: created_by } = req.context;
    const { label, course, time_start, time_end, date, level, room } = req.body;

    if (!Validate.string(label)) {
      throw new Error("Label is required");
    }
    if (parseInt(course) <= 0) {
      throw new Error("Course is required");
    }
    if (!Validate.time(time_start)) {
      throw new Error("Time start is required");
    }
    if (!Validate.time(time_end)) {
      throw new Error("Time end is required");
    }
    if (!Validate.date(date)) {
      console.log(date)
      throw new Error("Date is required");
    }
    if (parseInt(level) <= 0) {
      throw new Error("Level is required");
    }
    if (parseInt(room) <= 0) {
      throw new Error("room is required");
    }
    room

    const dept = await db.findOne("user_department", { user_id: created_by });

    const inserted = db.insertOne("timetable", { label, course, created_by, time_start, time_end, date, level, department: dept.department_id, room });

    if (inserted < 1) {
      throw new Error("Sorry, an error occured.");
    }

    res.status(200).json({
      message: "Timetable created successfully",
    });

  } catch (error) {
    console.log(error)

    res.status(400).json({
      message: error.message,
    });
  }
}

const updateTimetable = (req, res) => {
  try {
    const { label, course, time_start, time_end, date, level, id } = req.body;

    if (!Validate.string(label)) {
      throw new Error("Label is required");
    }
    if (!Validate.integer(course)) {
      throw new Error("Course is required");
    }
    if (!Validate.time(time_start)) {
      throw new Error("Time start is required");
    }
    if (!Validate.time(time_end)) {
      throw new Error("Time end is required");
    }
    if (Validate.date(date)) {
      throw new Error("Date is required");
    }
    if (!Validate.integer(level)) {
      throw new Error("Level is required");
    }

    const timetable = {
      label,
      course,
      time_start,
      time_end,
      date,
      level,
    };

    const updated = db.updateOne("timetable", timetable, { id });
  }
  catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

const getTimetable = (req, res) => {
  try {

    const { id } = req.params;

    if (!Validate.integer(id)) {
      throw new Error("Invalid timetable");
    }

    const timetable = db.findOne("timetable", { id });

    if (!Validate.object(timetable)) {
      throw new Error("Timetable not found");
    }

    res.status(200).json({
      message: "Timetable fetched successfully",
      data: timetable,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

const getAllTimetables = async (req, res) => {
  try {
    const { id, level } = req.params;

    if (parseInt(id) <= 0) {
      throw new Error("Course is required");
    }

    if (parseInt(level) <= 0) {
      throw new Error("Level is required");
    }

    const department = await db.findOne("user_department", { user_id: id })

    if (parseInt(department.department_id) <= 0) {
      throw new Error("Course is required");
    }

    const timetables = await db.findMany("timetable", { department: department.department_id, level });

    if (!Validate.array(timetables)) {
      throw new Error("No timetables found");
    }

    res.status(200).json({
      message: "Timetables fetched successfully",
      data: timetables,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = {
  createTimetable,
  updateTimetable,
  getTimetable,
  getAllTimetables
}
