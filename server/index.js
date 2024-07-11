const express = require("express");
const app = express();

const Logger = require("./helpers/Logger");

const { mySQLConnect } = require("./helpers/Database");

const userRoutes = require("./routes/user.routes");

app.use("/api/v1/user", userRoutes);

Logger.init();

mySQLConnect().then(() => {

  app.listen(8080, () => {
    console.log("http://localhost:8080")
  })

}).catch(error => {

  console.log(error);
  
});