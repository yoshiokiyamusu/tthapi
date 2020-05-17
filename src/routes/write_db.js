const express = require('express');
const { body } = require('express-validator/check');
const router = express.Router();
const mysqlConnection  = require('../database.js');
const writeController = require('../controllers/write_db');
const isAuth = require('../middleware/is-auth'); //para ponerle restriccion de tocken a las funciones


// POST /write/book
router.post('/book', 
  /*[
    body('title')
      .trim()
      .isLength({ min: 1 })
  ],*/
writeController.createPost2);

// POST /write/comment     
router.post('/comment',isAuth,  
  [
    body('usuario')
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 6 })
  ],
writeController.post_comment_proveedor);



module.exports = router;