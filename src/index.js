//https://www.youtube.com/watch?v=p8CoR-wymQg&t=2170s
//https://www.youtube.com/watch?v=p8CoR-wymQg&t=2170s
require("dotenv").config();
const path = require("path");
const express = require("express");
const db = require("./database");

const bodyParser = require("body-parser");
const infoRoutes = require("./routes/info_mysql");
const writeRoutes = require("./routes/write_db");
const authRoutes = require("./routes/auth");
const errorHandler = require("./middleware/error");
const app = express();

// Settings
app.set("port", process.env.PORT || 3006);

// Middlewares
app.use(express.json());

app.use(bodyParser.json()); //application/json

//Access Control Allow Origin
app.use(function (req, res, next) {
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  //res.header("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//Rutas del servidor
app.use(require("./routes/employees"));
app.use("/info", infoRoutes);
app.use("/write", writeRoutes);

//Authorization token
app.use("/auth", authRoutes);

//error Handling
app.use(errorHandler); 


// Starting the server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});

/*
//Access Control Allow Origin
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
})
*/
