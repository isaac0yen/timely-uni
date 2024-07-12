const express = require("express");
const app = express();

const Logger = require("./helpers/Logger");

const { mySQLConnect } = require("./helpers/Database");

const userRoutes = require("./routes/user.routes");
const courseRoutes = require("./routes/course.routes");
const departmentRoutes = require("./routes/department.routes");
const facultyRoutes = require("./routes/faculty.routes");
const timetableRoutes = require("./routes/timetable.routes");
const accountRoutes = require("./routes/account.routes");

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/department", departmentRoutes);
app.use("/api/v1/faculty", facultyRoutes);
app.use("/api/v1/room", roomRoutes);
app.use("/api/v1/timetable", timetableRoutes);
app.use("/api/v1/account", accountRoutesRoutes);

Logger.init();

mySQLConnect().then(() => {

  app.listen(8080, () => {
    console.log("http://localhost:8080")
  })

}).catch(error => {

  console.log(error);
  
});