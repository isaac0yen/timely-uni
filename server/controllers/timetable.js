const Validate = require("../helpers/Validate");

const createTimetable = (req, res) => {
  try {
    const { id: created_by } = req.context;
    const { label, course, time_start, time_end, date, level } = req.body;

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

    const inserted = db.insertOne("timetable", { label, course, created_by, time_start, time_end, date, level });

    if (inserted < 1) {
      throw new Error("Sorry, an error occured.");
    }

    res.status(200).json({
      message: "Timetable created successfully",
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

const updateTimetable = () => {
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

const getTimetable = () => {
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

const getAllTimetables = () => {
  try {
    const { department, level } = req.params;

    if (!Validate.integer(department)) {
      throw new Error("Course is required");
    }

    if (!Validate.integer(level)) {
      throw new Error("Level is required");
    }

    const timetables = db.findMany("timetable", { department, level });

    if (!Validate.array(timetables)) {
      throw new Error("No timetables found");
    }

    res.status(200).json({
      message: "Timetables fetched successfully",
      data: timetables,
    });
  } catch (error) {
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
