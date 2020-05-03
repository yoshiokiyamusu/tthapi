const express = require('express');
const router = express.Router();
const mysqlConnection  = require('../database.js');
const isAuth = require('../middleware/is-auth'); //para ponerle restriccion de tocken a las funciones

/*
//GET todas ordenes de servicio
router.get('/orden_servicio', (req, res) => {

    $var_sql = "SELECT distinct os.orden_servicio, os.proveedor, os.fecha_envio FROM orden_de_servicio ";
    $var_sql += "AS os LEFT JOIN enviados_a_servicio AS es ON os.orden_servicio = es.orden_servicio ";

    mysqlConnection.query($var_sql, (err, rows, fields) => {
      if(!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });
});
*/
// GET todas ordenes de servicio de un determinado taller
router.get('/orden_servicio/:proveedor',  (req, res) => { //isAuth,
    var data = {
     "proveedor": req.params.proveedor        
    };
    console.log(data.proveedor);

    $var_sql = "SELECT distinct os.orden_servicio, os.proveedor, os.fecha_envio FROM orden_de_servicio ";
    $var_sql += "AS os LEFT JOIN enviados_a_servicio AS es ON os.orden_servicio = es.orden_servicio ";
    $var_sql += "WHERE proveedor = '" + data.proveedor + "' ";
    //console.log($var_sql);

    mysqlConnection.query($var_sql, (err, rows, fields) => {
      if(!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });
});

// GET todas ordenes de servicio de un determinado taller
router.get('/sku_orden_servicio/:ordenserv', (req, res) => {
    var data = {
     "ordenserv": req.params.ordenserv        
    };
    console.log(data.ordenserv);

    $var_sql = "Select * from orden_de_servicio_sku ";
    $var_sql += "WHERE orden_servicio = '" + data.ordenserv + "' ";
    console.log($var_sql);

    mysqlConnection.query($var_sql, (err, rows, fields) => {
      if(!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });
});

// GET todos los comentarios de una orden de servicio
router.get('/comentarios_orden_servicio/:ordenserv', (req, res) => {
    var data = {
     "ordenserv": req.params.ordenserv        
    };
    console.log(data.ordenserv);

    $var_sql = "select * from tb_temp_movimiento WHERE descripcion_mov = 'comentario orden servicio taller' ";
    $var_sql += "AND orden = '" + data.ordenserv + "' ";
    console.log($var_sql);

    mysqlConnection.query($var_sql, (err, rows, fields) => {
      if(!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });
});









//GET todas ordenes de servicio
router.get('/books', (req, res) => {

  $var_sql = "select * from books ";
 

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});







module.exports = router;