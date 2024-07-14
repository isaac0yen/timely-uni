const { db } = require("../helpers/Database");
const Validate = require("../helpers/Validate");

const createDepartment = async (req, res) => {
  try {

    const { id: created_by } = req.context;

    const { name, faculty, head } = req.body;

    if (!Validate.string(name)) {
      throw new Error("Name is required");
    }

    if (!Validate.integer(faculty)) {
      throw new Error("Faculty is required");
    }

    if (!Validate.integer(head)) {
      throw new Error("Head is required");
    }

    const inserted = await db.insertOne("department", { name, faculty, head, created_by });

    if (inserted < 1) {
      throw new Error("Sorry, an error occured.");
    }

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

const updateDepartment = async (req, res) => {
  try {
    const { name, faculty, head, id } = req.body;

    if (!Validate.integer(id)) {
      throw new Error("Invalid department");
    }

    if (!Validate.string(name)) {
      throw new Error("Name is required");
    }

    if (!Validate.integer(faculty)) {
      throw new Error("Faculty is required");
    }

    if (!Validate.integer(head)) {
      throw new Error("Head is required");
    }

    const department = {
      name,
      faculty,
      head,
    }

    const updated = await db.updateOne("department", department, { id });

    if (updated < 1) {
      throw new Error("Sorry, an error occured.");
    }

    res.status(200).json({
      message: "Department updated successfully",
      status: 200,
    })
      ;
  } catch (error) {
    res.status(200).json({
      message: error.message,
      status: 200,
    })
      ;
  }

}

const getDepartment = async () => {
  try {
    const { id } = req.params;

    if (!Validate.integer(id)) {
      throw new Error("Invalid ID");
    }

    const department = await db.findOne("department", { id });

    if (!Validate.object(department)) {
      throw new Error("Department not found");
    }

    res.status(200).json({
      message: "Department fetched successfully",
      status: 200,
      data: department,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

const getAllDepartments = async (req, res) => {

  const { faculty } = req.params;

  try {
    const departments = await db.findMany("department", { faculty });

    if (!Validate.array(departments)) {
      throw new Error("Invalid departments");
    }

    res.status(200).json({
      message: "Departments fetched successfully",
      status: 200,
      data: departments,
    })

  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = {
  createDepartment,
  updateDepartment,
  getDepartment,
  getAllDepartments
}