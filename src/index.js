//https://www.youtube.com/watch?v=p8CoR-wymQg&t=2170s
const express = require('express');
const app = express();

// Settings
app.set('port', process.env.PORT || 3001);

// Middlewares
app.use(express.json());

// Routes
app.use(require('./routes/employees'));

// Starting the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});
