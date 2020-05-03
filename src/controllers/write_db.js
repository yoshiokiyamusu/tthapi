//const { validationResult } = require('express-validator/check');

//const Book = require('../models/write_db.js');
const mysqlConnection  = require('../database.js');



// GET todos los comentarios de una orden de servicio
exports.createPost2 = (req, res, next) => {

  const title = req.body.title; 
  const content = req.body.content;

  $var_sql = "INSERT INTO books (title,content ) VALUES ('" + title + "','" + content + "') ";
  
  console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
};

exports.ejemplo = (req, res, next) => {
    /* 
      const errors = validationResult(req);
     if (!errors.isEmpty()) {
       const error = new Error('Validation failed, entered data is incorrect.');
       error.statusCode = 422;
       throw error;
     }
     */
     const title = req.body.title;     
     const content = req.body.content;
     const imageUrl = 'images/duck.jpg';
     const creator =  'Yoshio';
     //validation
     if (title.length < 3) {   
       return res.status(422).json({
         message: 'Validation failed, yoyo pocos caracteres en campo titulo.'
         
       }); 
       console.log('mensaje de error: titulo tiene menos de 30 caracteres');  
     }
     //Insert into Mysql
     const book = new Book(null, title, content, imageUrl, creator);
     console.log(book);
     
     book.save().then(() => {
         //res.redirect('/');
     }).catch(err => console.log(err));
   
   
     // Create post in db
     res.status(201).json({
       message: 'Post created successfully!',
       post: { _id: new Date().toISOString(), 
         title: title, 
         content: content,
         creator:{name:'Yoshio'},
         createdAt:new Date()
       } 
     });
};
   