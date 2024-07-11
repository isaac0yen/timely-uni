const express = require("express");
const router = express.Router();

const { createRoom, updateRoom, getRoom, getAllRooms } = require("../controllers/room");

router.post("/create_room", createRoom);

router.patch("/update_room", updateRoom);


router.get("/get_room/:id", getRoom);
router.get("/get_all_rooms", getAllRooms);

module.exports = router;