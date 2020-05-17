const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//const User = require('../models/user');
const mysqlConnection  = require('../database.js');


exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  //Evaluar si existe ese input mail en la DB(Mysql)
  $var_sql = "SELECT COUNT(*) FROM tb_usuarios WHERE email = '" + email + "' ";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if(!err) {
      
      const token = jwt.sign(
        {
          email: email
          
        },
        'somesuperyoshiosecretpassword',
        { expiresIn: '1h' } //en una hora muere la session token
      );
      console.log(token);
      res.status(200).json({ token: token });
      
    } else {
      console.log(err);
    }
  });

};