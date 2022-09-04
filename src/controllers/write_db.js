var FormData = require('form-data');
const fetch = require("node-fetch");

const { validationResult } = require("express-validator/check");

//const Book = require('../models/write_db.js');
const mysqlConnection = require("../database.js");
const isAuth = require("../middleware/is-auth"); //para ponerle restriccion de tocken a las funciones

//npm packages for pics
const fs = require("fs");
const path = require("path");
const { upload, s3 } = require("../libs/multer");

// POST agregar nuevo estado a la orden de servicio
exports.post_os_status = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation fallo.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  //parametros, values to insert
  const orden_servicio = req.body.orden;
  const status = req.body.status;
  const usuario = req.body.usuario;

  $var_sql =
    "INSERT INTO status_orden_servicio (orden_servicio, status, usuario) ";
  $var_sql +=
    "VALUES ('" + orden_servicio + "','" + status + "','" + usuario + "') ";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res
        .status(201)
        .json({ message_post: "Información guardada", userId: usuario });
      //res.json(rows);
    } else {
      console.log(err);
    }
  });
}; //END function

// POST agregar datos de imagen
exports.post_os_image = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation fallo.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  //parametros, values to insert
  const orden_servicio = req.body.os;
  const nombre = req.body.nombre;
  const url = req.body.url;
  const estado = req.body.estado;
  const descripcion = req.body.descripcion;

  $var_sql = "INSERT INTO tb_imagen (orden_servicio, nombre, url, estado, descripcion)";
  $var_sql += " VALUES ('" + orden_servicio + "','" + nombre + "','" + url + "','" + estado + "','" + descripcion + "') ";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res.status(201).json({
        message_post: "Imagen guardada",
        orden_servicio: orden_servicio,
        nombre: nombre,
      });
      //res.json(rows);
    } else {
      console.log(err);
    }
  });
}; //END function

// POST comentarios de proveedor, en base a cierta orden
exports.post_comment_proveedor = (req, res, next) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation fallo.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  //parametros, values to insert
  const nombre_mov = "comentario";
  const orden = req.body.orden;
  const sku = "-";
  const cantidad = 0;
  const descripcion_mov = "comentario orden servicio taller";
  const comentario = req.body.comentario;
  const usuario = req.body.usuario;
  const estado = "";

  $var_sql =
    "INSERT INTO tb_temp_movimiento (nombre_mov, orden, sku, cantidad, descripcion_mov, comentario, usuario, estado) ";
  $var_sql +=
    "VALUES ('" +
    nombre_mov +
    "'," +
    mysqlConnection.escape(orden) +
    ",'" +
    sku +
    "'," +
    cantidad +
    ",'" +
    descripcion_mov +
    "'," +
    mysqlConnection.escape(comentario) +
    "," +
    mysqlConnection.escape(usuario) +
    ",'" +
    estado +
    "') ";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res
        .status(201)
        .json({ message_post: "Información guardada", userId: usuario });
      //res.json(rows);
    } else {
      console.log(err);
    }
  });
};

// UPDATE comentario estado
exports.post_comment_inactivo_os = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation fallo.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const nombre_mov = "comentario";
  const orden = req.body.orden;
  const sku = "-";
  const cantidad = 0;
  const descripcion_mov = "comentario orden servicio taller";
  const comentario = req.body.comentario;
  const usuario = req.body.usuario;

  $var_sql = "UPDATE tb_temp_movimiento SET estado = 'no_activo' ";
  $var_sql += " WHERE descripcion_mov = 'comentario orden servicio taller' ";
  $var_sql += " AND orden = '" + orden + "' ";
  $var_sql += " AND comentario = '" + comentario + "' ";
  $var_sql += " AND usuario = '" + usuario + "' ";

  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res
        .status(201)
        .json({ message_post: "Comentario inactivo", userId: usuario });
      //res.json(rows);
    } else {
      console.log(err);
    }
  });
};

// GET todos los comentarios de una orden de servicio
exports.createPost2 = (req, res, next) => {
  console.log(req.body);
  //console.log(Object.entries(req.body));
  //for (var [key, value] of Object.entries(req.body[0].title)) {
  //  console.log(key + ' ' + value); 
  //}
  for (var i = 0; i < req.body.length; i++) {
    const title = req.body[i].title;
    const content = req.body[i].content;
  
  $var_sql =
    "INSERT INTO books (title,content ) VALUES ('" +
    title +
    "','" +
    content +
    "') ";

  console.log($var_sql);
  } 

  res.status(201).json({
    message: "msg",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content
    },
  });
 /*
  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });*/
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
  const imageUrl = "images/duck.jpg";
  const creator = "Yoshio";
  //validation
  if (title.length < 3) {
    return res.status(422).json({
      message: "Validation failed, yoyo pocos caracteres en campo titulo.",
    });
    console.log("mensaje de error: titulo tiene menos de 30 caracteres");
  }
  //Insert into Mysql
  const book = new Book(null, title, content, imageUrl, creator);
  console.log(book);

  book
    .save()
    .then(() => {
      //res.redirect('/');
    })
    .catch((err) => console.log(err));

  // Create post in db
  res.status(201).json({
    message: "Post created successfully!",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      creator: { name: "Yoshio" },
      createdAt: new Date(),
    },
  });
};

//POST upload fotos de archivos
exports.uploadFile = async (req, res, next) => {
  //const token = localStorage.getItem('token');

  for (var i = 0; i < req.files.length; i++) {
    // Saving the Image URL in Database
    //Insert into Mysql tb_imagen
    const orden_servicio = req.body.os;
    const nombre = req.body.nombre_pic;
    const url = req.files[i].location;
    const estado = "1";
    const descripcion = req.body.descripcion;

    $var_sql =
      "INSERT INTO tb_imagen (orden_servicio, nombre, url, estado, descripcion)";
    $var_sql +=
      " VALUES (" +
      mysqlConnection.escape(orden_servicio) +
      ",'" +
      nombre +
      "','" +
      url +
      "','" +
      estado +
      "','" +
      descripcion +
      "') ";
    console.log($var_sql);

    mysqlConnection.query($var_sql, (err, rows, fields) => {
      if (!err) {
        /* res.status(201).json({
          message_post: "Imagen guardada",
          orden_servicio: orden_servicio,
          nombre: nombre,
        });
       */
      } else {
        console.log(err);
      }
    });
  } //END Loop
  // Redirect to the initial page
  res.status(200).json({
    success: true,
    mensaje: "Se recepciono el archivo exitosamente",
  });
};



//POST upload fotos de archivos - Color Pic
exports.colorPic = async (req, res, next) => {
  //const token = localStorage.getItem('token');

  for (var i = 0; i < req.files.length; i++) {
    //Insert into Mysql color
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const url = req.files[i].location;
    const estado = "1";
    const usuario = req.body.usuario;
    
    $var_sql = "INSERT INTO color (nombre, descripcion, img_url, estado, usuario )";
    $var_sql += " VALUES (" + mysqlConnection.escape(nombre) + "," + mysqlConnection.escape(descripcion) + ",'" + url + "','" + estado + "','" + usuario + "') ";
    console.log($var_sql);

    mysqlConnection.query($var_sql, (err, rows, fields) => {
      if (!err) {
        /* res.status(201).json({
          message_post: "Imagen guardada",
          nombre: nombre
        });
       */
      } else {
        console.log(err);
      }
    });
  } //END Loop
  // Redirect to the initial page
  res.status(201).json({
    success: true,
    mensaje: "Se recepciono el archivo exitosamente",
  });
};


// POST poblar tabla orden_despacho
exports.post_woo_orden_despacho = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation fallo.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  //parametros, values to insert
  const cod_orden_despacho = req.body.cod_orden_despacho;
  const fecha_creacion = req.body.fecha_creacion;
  const fecha_despacho = req.body.fecha_despacho;
  const tipo_despacho = 'cliente_pedido';
  const nombre_cliente = req.body.nombre_cliente;
  const nota_pedido = req.body.nota_pedido;
  const detalles = '-';
  const status = 'por_despachar';

  $var_sql =
    "INSERT INTO orden_despacho (cod_orden_despacho, fecha_creacion, fecha_despacho, tipo_despacho, nombre_cliente, nota_pedido, detalles, status) ";
  $var_sql +=
    "VALUES ('" + cod_orden_despacho + "','" + fecha_creacion + "','" + fecha_despacho + "','" + tipo_despacho + "','" + nombre_cliente + "','" + nota_pedido + "','" + detalles + "','" + status + "') ";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res
        .status(201)
        .json({ message_post: "Información guardada", order_despacho: cod_orden_despacho });
      //res.json(rows);
    } else {
      console.log(err);
    }
  });

}; //END function

// POST poblar tabla orden_despacho_sku
exports.post_woo_orden_despacho_sku = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation fallo.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  //parametros, values to insert
  const cod_orden_despacho = req.body.cod_orden_despacho;
  const sku = req.body.sku;
  const cantidad = req.body.cantidad;

  $var_sql =
    "INSERT INTO orden_despacho_sku (cod_orden_despacho, sku, cantidad) ";
  $var_sql +=
    "VALUES ('" + cod_orden_despacho + "','" + sku + "','" + cantidad + "') ";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res
        .status(201)
        .json({ message_post: "Información guardada", order_despacho: cod_orden_despacho });
      //res.json(rows);
    } else {
      console.log(err);
    }
  });




}; //END function


// POST purchased sku from woocommerce ordeners
exports.post_woo_orden_sku = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation fallo.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  //parametros, values to insert
  const orden_id = req.body.orden_id;
  const sku = req.body.sku_pack;
  const nombre_sku = req.body.sku_nombre;
  const talla = req.body.talla;
  const color = req.body.color;
  const cantidad = req.body.cantidad;
  const created_at = new Date().toISOString();
  
  $var_sql =
    "INSERT INTO woo_order_b2c_producto (orden_id, sku, nombre_sku, talla, color, cantidad) ";
  $var_sql +=
    "VALUES ('" + orden_id + "','" + sku + "','" + nombre_sku + "','" + talla + "','" + color + "','" + cantidad + "') ";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res
        .status(201)
        .json({ message_post: "Información guardada", orderId: orden_id });
      //res.json(rows);
    } else {
      console.log(err);
    }
  });

}; //END function

// POST purchased sku from woocommerce ordeners
exports.post_woo_orden = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation fallo.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  //parametros, values to insert
  const orden_id = req.body.orden_id;
  const nombre_cliente = req.body.nombre_cliente;
  const fecha_orden = req.body.fecha_orden;
  const estado = req.body.estado;
  const created_at = new Date().toISOString();
  
  $var_sql = "INSERT INTO woo_order_b2c_cliente (orden_id, nombre_cliente, fecha_orden, estado) ";
  $var_sql += "VALUES ('" + orden_id + "','" + nombre_cliente + "','" + fecha_orden + "','" + estado + "') ";
  console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res
        .status(201)
        .json({ message_post: "Información guardada", orderId: orden_id });
      //res.json(rows);
    } else {
      console.log(err);
    }
  });

}; //END function











// POST test postHref, redireccionamiento 0 | vanilla JS
exports.post_href_0 = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation fallo.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  //parametros, values to insert
  const os = 'OS_prueba';
  const nombre = req.body.nombre;
  const descripcion_pic = 'Ejemplo descripcion';

  var variable_http_end = 'http://localhost:3006';
   
  var token_v0 = req.headers['authorization']; 
  var tokenv = token_v0.slice(7);
  //console.log(tokenv);
        
  if(nombre == 'yoshio'){
        /* Ejecutar Post api 1 */   
        let todo = {
          os: os,
          nombre: nombre,
          descripcion: descripcion_pic
        };

        fetch(variable_http_end + '/write/href1_image', {
            method: 'POST',
            body: JSON.stringify(todo),
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tokenv }
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            console.log('Success:', result);
            res.status(201).json({
              message_post: "Datos guardados input yoshio",
              nombre: nombre,
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
  }else{
      let todo = {
        codigo: 'ejemplo',
        categoria :'cat_ejemplo',
        nombre: nombre,
        estado: 'activo'
      };
      fetch(variable_http_end + '/write/href2_supplier', {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tokenv }
      })
      .then(response => response.json())
      .then(result => {
          console.log(result);
          console.log('Success:', result);
          res.status(201).json({
            message_post: "Datos guardados input yoshio",
            nombre: nombre,
          });
      })
      .catch(error => {
          console.error('Error:', error);
      });
  
  }//End Else
}; //END function






// POST test postHref, redireccionamiento 1 | Tabla:tb_imagen
exports.post_href_1 = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const error = new Error("Validation fallo.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  
  //parametros, values to insert
  const orden_servicio = 'prueba href';
  const nombre = req.body.nombre;
  const url = 'prueba href';
  const estado = 'prueba href';
  const descripcion = 'prueba href';

  $var_sql = "INSERT INTO tb_imagen (orden_servicio, nombre, url, estado, descripcion)";
  $var_sql += " VALUES ('" + orden_servicio + "','" + nombre + "','" + url + "','" + estado + "','" + descripcion + "') ";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res.status(201).json({
        message_post: "Datos guardados",
        nombre: nombre,
      });
      //res.json(rows);
    } else {
      console.log(err);
    }
  });
}; //END function


// POST test postHref, redireccionamiento 2 | Tabla:supplier
exports.post_href_2 = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation fallo.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  //parametros, values to insert
  const codigo = 'prueba href';
  const categoria = 'prueba href';
  const nombre = req.body.nombre;
  const estado = 'prueba href';

  $var_sql = "INSERT INTO supplier (codigo, categoria, nombre, estado)";
  $var_sql += " VALUES ('" + codigo + "','" + categoria + "','" + nombre + "','" + estado + "') ";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res.status(201).json({
        message_post: "Datos guardados",
        nombre: nombre,
      });
      //res.json(rows);
    } else {
      console.log(err);
    }
  });
}; //END function