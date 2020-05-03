//https://www.youtube.com/watch?v=p8CoR-wymQg&t=2170s
const express = require('express');
const db = require('./database');

const bodyParser = require('body-parser');
const infoRoutes = require('./routes/info_mysql');
const writeRoutes = require('./routes/write_db');
const app = express();

// Settings
app.set('port', process.env.PORT || 3005);



// Middlewares
app.use(express.json());

//Access Control Allow Origin
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
})


//Para crear el objecto Error:
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data  });
});


//Rutas del servidor
app.use(require('./routes/employees'));
app.use('/info', infoRoutes);
app.use('/write', writeRoutes);

// Starting the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});
