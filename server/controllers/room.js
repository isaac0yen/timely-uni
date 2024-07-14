const Validate = require("../helpers/Validate");
const { db } = require("../helpers/Database")

const createRoom = async (req, res) => {
  try {
    const { name, capacity } = req.body;

    if (!Validate.string(name)) {
      throw new Error("Name is required");
    }
    if (parseInt(capacity) <= 0) {
      throw new Error("Capacity is required");
    }

    const inserted = await db.insertOne("room", { name, capacity });

    if (inserted < 1) {
      throw new Error("Sorry, an error occured.");
    }

    res.status(200).json({
      status:200,
      message: "Room created successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

const updateRoom = async (req, res) => {
  try {
    const { name, capacity, id } = req.body;

    if (!Validate.string(name)) {
      throw new Error("Name is required");
    }
    if (parseInt(capacity) <= 0) {
      throw new Error("Capacity is required");
    }

    const room = { name, capacity };
    const updated = await db.updateOne("room", room, { id });

    if (updated < 1) {
      throw new Error("Sorry, an error occured.");
    }

    res.status(200).json({
      status:200,
      message: "Room updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

const getRoom = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id)<= 0) {
      throw new Error("Invalid Room");
    }

    const room = await db.findOne("room", { id });

    if (!Validate.object(room)) {
      throw new Error("Room not found");
    }

    res.status(200).json({
      status:200,
      message: "Room fetched successfully",
      data: room,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

const getAllRooms = async (req, res) => {
  try {
    const rooms = await db.findMany("room", {});
    if (!Validate.array(rooms)) {
      throw new Error("Rooms not found.");
    }
    res.status(200).json({
      status:200,
      message: "Rooms fetched successfully",
      data: rooms,
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = {
  createRoom,
  updateRoom,
  getRoom,
  getAllRooms
}