const express = require('express');
const router = express.Router();
const mysqlConnection  = require('../database.js');
const writeController = require('../controllers/write_db');
const isAuth = require('../middleware/is-auth'); //para ponerle restriccion de tocken a las funciones


// POST /feed/post
router.post('/book', 
  /*[
    body('title')
      .trim()
      .isLength({ min: 1 })
  ],*/
  writeController.createPost2);

module.exports = router;