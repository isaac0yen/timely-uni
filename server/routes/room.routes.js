const express = require("express");
const router = express.Router();

const { createRoom, updateRoom, getRoom, getAllRooms } = require("../controllers/room");
const authMiddleware = require("../Middleware/Auth");

router.post("/create_room", authMiddleware, createRoom);

router.patch("/update_room", authMiddleware,updateRoom);


router.get("/get_room/:id", authMiddleware,getRoom);
router.get("/get_all_rooms", getAllRooms);

module.exports = router;