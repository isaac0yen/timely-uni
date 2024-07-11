const { db } = require("../helpers/Database");
const Validate = require("../helpers/Validate");

const createFaculty = async (req, res) => {
  try {
    const { id: created_by } = req.context;

    const { name, head } = req.body;

    if (Validate.string(name)) {
      throw new Error("Name is required");
    }

    if (Validate.integer(head)) {
      throw new Error("Head is required");
    }

    const inserted = await db.insertOne("faculty", { name, head, created_by });

    if (inserted < 1) {
      throw new Error("Sorry, an error occured.");
    }

    res.status(200).json({
      message: "Faculty created successfully",
    });

  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}

const updateFaculty = async () => {
  const { name, head, id } = req.body;

  if (!Validate.integer(id)) {
    throw new Error("Invalid faculty");
  }

  if (Validate.string(name)) {
    throw new Error("Name is required");
  }

  if (!Validate.integer(head)) {
    throw new Error("Head is required");
  }

  const faculty = {
    name,
    head,
  }

  const updated = await db.updateOne("faculty", faculty, { id });

  if (updated < 1) {
    throw new Error("Sorry, an error occured.");
  }
  res.status(200).json({
    message: "Faculty updated successfully",
  });
}

const getFaculty = async () => {
  try {
    const { id } = req.params;

    if (!Validate.integer(id)) {
      throw new Error("Invalid faculty");
    }

    const faculty = await db.findOne("faculty", { id });

    if (!Validate.object(faculty)) {
      throw new Error("Faculty not found.");
    }
    res.status(200).json({
      message: "Faculty fetched successfully",
      data: faculty,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}

const getAllFaculties = async () => {
  try {

    const faculties = await db.findMany("faculty");

    if (!Validate.array(faculties)) {
      throw new Error("Invalid faculties");
    }

    res.status(200).json({
      message: "Faculties fetched successfully",
      data: faculties,
    });

  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}

module.exports = {
  createFaculty,
  updateFaculty,
  getFaculty,
  getAllFaculties,
}