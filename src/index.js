//https://www.youtube.com/watch?v=p8CoR-wymQg&t=2170s
const express = require('express');
const app = express();

// Settings
app.set('port', process.env.PORT || 3001);



// Middlewares
app.use(express.json());

//Access Control Allow Origin
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
})


// Routes
app.use(require('./routes/employees'));


// Starting the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});
