const express = require("express");
const app = express();
const cors = require("cors");

const Logger = require("./helpers/Logger");

const { mySQLConnect } = require("./helpers/Database");
const authMiddleware =require ("./Middleware/Auth")

const userRoutes = require("./routes/user.routes");
const courseRoutes = require("./routes/course.routes");
const departmentRoutes = require("./routes/department.routes");
const facultyRoutes = require("./routes/faculty.routes");
const timetableRoutes = require("./routes/timetable.routes");
const accountRoutes = require("./routes/account.routes");
const roomRoutes = require("./routes/room.routes");

app.use(cors());

app.use(express.json());

app.use("/api/v1/user",authMiddleware, userRoutes);
app.use("/api/v1/course",authMiddleware, courseRoutes);
app.use("/api/v1/department", authMiddleware, departmentRoutes);
app.use("/api/v1/faculty", authMiddleware, facultyRoutes);
app.use("/api/v1/room", authMiddleware, roomRoutes);
app.use("/api/v1/timetable", authMiddleware, timetableRoutes);
app.use("/api/v1/account", accountRoutes);


Logger.init();

mySQLConnect().then(() => {

  app.listen(8080, () => {
    console.log("http://localhost:8080")
  })

}).catch(error => {

  console.log(error);
  
});