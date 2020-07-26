
const { validationResult } = require('express-validator/check');
//const Book = require('../models/write_db.js');
const mysqlConnection  = require('../database.js');
const isAuth = require('../middleware/is-auth'); //para ponerle restriccion de tocken a las funciones

// POST comentarios de proveedor, en base a cierta orden
exports.post_comment_proveedor = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation fallo.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
    
  }

  const nombre_mov = 'comentario' 
  const orden = req.body.orden; 
  const sku = '-'; 
  const cantidad = 0; 
  const descripcion_mov = 'comentario orden servicio taller'; 
  const comentario = req.body.comentario; 
  const usuario = req.body.usuario; 
  const estado = ''; 
  

  $var_sql = "INSERT INTO tb_temp_movimiento (nombre_mov, orden, sku, cantidad, descripcion_mov, comentario, usuario, estado) ";
  $var_sql += "VALUES ('" + nombre_mov + "','" + orden + "','" + sku + "'," + cantidad + ",'" + descripcion_mov + "','" + comentario + "','" + usuario + "','" + estado + "') ";
  console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if(!err) {
      res.status(201).json({ message_post: 'Información guardada', userId: usuario });
      //res.json(rows);
    } else {
      console.log(err);
    }
  });
};




// UPDATE comentario estado
exports.post_comment_inactivo_os= (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation fallo.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
    
  }

  const nombre_mov = 'comentario' 
  const orden = req.body.orden; 
  const sku = '-'; 
  const cantidad = 0; 
  const descripcion_mov = 'comentario orden servicio taller'; 
  const comentario = req.body.comentario; 
  const usuario = req.body.usuario; 
  
  $var_sql = "UPDATE tb_temp_movimiento SET estado = 'no_activo' ";
  $var_sql += " WHERE descripcion_mov = 'comentario orden servicio taller' ";
  $var_sql += " AND orden = '" + orden + "' ";
  $var_sql += " AND comentario = '" + comentario + "' ";
  $var_sql += " AND usuario = '" + usuario + "' ";

  console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if(!err) {
      res.status(201).json({ message_post: 'Comentario inactivo', userId: usuario });
      //res.json(rows);
    } else {
      console.log(err);
    }
  });
};





















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
   