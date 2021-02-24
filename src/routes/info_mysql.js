const express = require("express");
const router = express.Router();
const mysqlConnection = require("../database.js");
const isAuth = require("../middleware/is-auth"); //para ponerle restriccion de tocken a las funciones

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
// GET todas ordenes de servicio de un determinado taller //http://localhost:3006/info/orden_servicio/janina
router.get("/orden_servicio/:proveedor", isAuth, (req, res) => {
  //isAuth,
  var data = {
    proveedor: req.params.proveedor,
  };
  //console.log(data.proveedor);

  $var_sql =
    "SELECT distinct os.orden_servicio, os.proveedor, os.fecha_envio FROM orden_de_servicio ";
  $var_sql +=
    "AS os LEFT JOIN enviados_a_servicio AS es ON os.orden_servicio = es.orden_servicio ";
  $var_sql += "WHERE proveedor = '" + data.proveedor + "' ";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// GET todas ordenes de servicio de un determinado taller
router.get("/sku_orden_servicio/:ordenserv", isAuth, (req, res) => {
  var data = {
    ordenserv: req.params.ordenserv,
  };
  //console.log(data.ordenserv);

  $var_sql = "Select * from orden_de_servicio_sku ";
  $var_sql += "WHERE orden_servicio = '" + data.ordenserv + "' ";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

// GET todos los comentarios de una orden de servicio
router.get("/comentarios_orden_servicio/:ordenserv", isAuth, (req, res) => {
  var data = {
    ordenserv: req.params.ordenserv,
  };
  //console.log(data.ordenserv);

  $var_sql =
    "select * from tb_temp_movimiento WHERE descripcion_mov = 'comentario orden servicio taller' ";
  $var_sql += "AND orden = '" + data.ordenserv + "' ";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

//----ORDEN DE SERVICIO (NIVEL de orden de servicio)----------------------------------
// http://localhost:3006/info/ordenes_servicio/ABEL_TORO
router.get("/ordenes_servicio/:proveedor", (req, res) => {
  //isAuth,
  var data = {
    proveedor: req.params.proveedor,
  };
  //console.log(data.proveedor);

  $var_sql =
    " SELECT json_object('orden_servicio', pendiente_prov.orden_servicio , 'fecha_envio',pendiente_prov.fecha_envio,";
  $var_sql += " 'fecha_entrega',pendiente_prov.recibo_fecha_desde, ";
  $var_sql +=
    " 'proveedor',pendiente_prov.proveedor, 'status', pendiente_prov.status, 'usuario', pendiente_prov.usuario, ";
  $var_sql += " 'timestamp', pendiente_prov.timestamp ";
  $var_sql += " ) as myobj ";

  $var_sql +=
    " FROM ( SELECT DISTINCT tb.orden_servicio, tb.fecha_envio, tb.proveedor, tb.recibo_fecha_desde, ";
  $var_sql +=
    " sku.sku, sku.sku_readable, sku.cantidad, recep_grp.cantidad as 'qty', ";
  $var_sql += " CASE ";
  $var_sql +=
    " WHEN (sku.cantidad - recep_grp.cantidad) is not null THEN (sku.cantidad - recep_grp.cantidad) ";
  $var_sql +=
    " WHEN (sku.cantidad - recep_grp.cantidad) is null THEN sku.cantidad ";
  $var_sql += " END as cantidad_restante, ";
  $var_sql += " tb_status.status, tb_status.usuario, tb_status.timestamp ";
  $var_sql += " FROM orden_de_servicio as tb  ";
  $var_sql +=
    " inner join orden_de_servicio_sku as sku ON tb.orden_servicio = sku.orden_servicio ";
  $var_sql += " left join ( ";
  $var_sql +=
    " SELECT rec.orden_servicio, rec.sku, SUM(rec.cantidad) as cantidad ";
  $var_sql += " FROM recepcion as rec group by rec.sku, rec.orden_servicio ";
  $var_sql +=
    " ) as recep_grp on tb.orden_servicio = recep_grp.orden_servicio AND sku.sku = recep_grp.sku ";
  $var_sql +=
    " left join ( select orden, comentario from tb_temp_movimiento where descripcion_mov = 'comentario orden servicio taller' ";
  $var_sql += " ) as commento ON commento.orden = tb.orden_servicio ";
  $var_sql += " LEFT JOIN ( SELECT tb1.orden_servicio, ";
  $var_sql +=
    " (SELECT tb2.status FROM status_orden_servicio as tb2 WHERE tb2.orden_servicio = tb1.orden_servicio AND tb2.status <> '-' order by timestamp desc limit 1) as 'status', ";
  $var_sql +=
    " (SELECT tb2.usuario FROM status_orden_servicio as tb2 WHERE tb2.orden_servicio = tb1.orden_servicio AND tb2.status <> '-' order by timestamp desc limit 1) as 'usuario', ";
  $var_sql +=
    " (SELECT tb2.timestamp FROM status_orden_servicio as tb2 WHERE tb2.orden_servicio = tb1.orden_servicio AND tb2.status <> '-' order by timestamp desc limit 1) as 'timestamp' ";
  $var_sql += " FROM status_orden_servicio as tb1 group by tb1.orden_servicio ";
  $var_sql +=
    " ) as tb_status ON tb.orden_servicio = tb_status.orden_servicio ";
  $var_sql += " WHERE tb.proveedor = '" + data.proveedor + "' ";
  $var_sql +=
    " AND tb_status.status IS NULL OR tb_status.status IN( '','-','pendiente','aprobado','en_progreso') "; //Solo mostrar OS en curso
  $var_sql += " HAVING cantidad_restante > (-99999) ";
  $var_sql += " ) AS pendiente_prov ";
  $var_sql += " GROUP BY pendiente_prov.orden_servicio ";

  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    var ar = {}; // empty Object
    var os = "prods";
    ar[os] = [];

    for (let i = 0; i < rows.length; i++) {
      var filajs = JSON.parse(rows[i].myobj);
      var objetoArray = {
        orden: filajs.orden_servicio,
        proveedor: filajs.proveedor,
        fecha_creacion: filajs.fecha_envio,
        fecha_entrega: filajs.fecha_entrega,
        status: filajs.status,
        usuario: filajs.usuario,
        timestamp: filajs.timestamp,
      };
      ar[os].push(objetoArray);
    } //end of OP loop

    //console.log(ar[os]);
    if (!err) {
      res.send(ar[os]);
    } else {
      console.log(err);
    }
  }); // end mysqlConnection row
});

//----ORDEN DE SERVICIO (NIVEL de orden de servicio)----------------------------------
router.get("/ordenes_servicio_concluido/:proveedor", (req, res) => {
  //isAuth,
  var data = {
    proveedor: req.params.proveedor,
  };
  //console.log(data.proveedor);
  $var_sql =
    " SELECT json_object('orden_servicio', pendiente_prov.orden_servicio , 'fecha_envio',pendiente_prov.fecha_envio,";
  $var_sql += " 'fecha_entrega',pendiente_prov.recibo_fecha_desde, ";
  $var_sql +=
    " 'proveedor',pendiente_prov.proveedor, 'status', pendiente_prov.status, 'usuario', pendiente_prov.usuario, ";
  $var_sql += " 'timestamp', pendiente_prov.timestamp ";
  $var_sql += " ) as myobj ";
  $var_sql +=
    " FROM ( SELECT DISTINCT tb.orden_servicio, tb.fecha_envio, tb.proveedor, tb.recibo_fecha_desde, ";
  $var_sql +=
    " sku.sku, sku.sku_readable, sku.cantidad, recep_grp.cantidad as 'qty', ";
  $var_sql += " CASE ";
  $var_sql +=
    " WHEN (sku.cantidad - recep_grp.cantidad) is not null THEN (sku.cantidad - recep_grp.cantidad) ";
  $var_sql +=
    " WHEN (sku.cantidad - recep_grp.cantidad) is null THEN sku.cantidad ";
  $var_sql += " END as cantidad_restante, ";
  $var_sql += " tb_status.status, tb_status.usuario, tb_status.timestamp ";
  $var_sql += " FROM orden_de_servicio as tb  ";
  $var_sql +=
    " inner join orden_de_servicio_sku as sku ON tb.orden_servicio = sku.orden_servicio ";
  $var_sql += " left join ( ";
  $var_sql +=
    " SELECT rec.orden_servicio, rec.sku, SUM(rec.cantidad) as cantidad ";
  $var_sql += " FROM recepcion as rec group by rec.sku, rec.orden_servicio ";
  $var_sql +=
    " ) as recep_grp on tb.orden_servicio = recep_grp.orden_servicio AND sku.sku = recep_grp.sku ";
  $var_sql +=
    " left join ( select orden, comentario from tb_temp_movimiento where descripcion_mov = 'comentario orden servicio taller' ";
  $var_sql += " ) as commento ON commento.orden = tb.orden_servicio ";
  $var_sql += " LEFT JOIN ( SELECT tb1.orden_servicio, ";
  $var_sql +=
    " (SELECT tb2.status FROM status_orden_servicio as tb2 WHERE tb2.orden_servicio = tb1.orden_servicio AND tb2.status <> '-' order by timestamp desc limit 1) as 'status', ";
  $var_sql +=
    " (SELECT tb2.usuario FROM status_orden_servicio as tb2 WHERE tb2.orden_servicio = tb1.orden_servicio AND tb2.status <> '-' order by timestamp desc limit 1) as 'usuario', ";
  $var_sql +=
    " (SELECT tb2.timestamp FROM status_orden_servicio as tb2 WHERE tb2.orden_servicio = tb1.orden_servicio AND tb2.status <> '-' order by timestamp desc limit 1) as 'timestamp' ";
  $var_sql += " FROM status_orden_servicio as tb1 group by tb1.orden_servicio ";
  $var_sql +=
    " ) as tb_status ON tb.orden_servicio = tb_status.orden_servicio ";
  $var_sql += " WHERE tb.proveedor = '" + data.proveedor + "' ";
  $var_sql +=
    " AND tb_status.status = 'terminado_enviado' OR tb_status.status = 'liquidado' "; //Solo mostrar OS concluidas
  $var_sql += " HAVING cantidad_restante > (-99999) ";
  $var_sql += " ) AS pendiente_prov ";
  $var_sql += " GROUP BY pendiente_prov.orden_servicio ";

  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    var ar = {}; // empty Object
    var os = "prods";
    ar[os] = [];

    for (let i = 0; i < rows.length; i++) {
      var filajs = JSON.parse(rows[i].myobj);
      var objetoArray = {
        orden: filajs.orden_servicio,
        proveedor: filajs.proveedor,
        fecha_creacion: filajs.fecha_envio,
        fecha_entrega: filajs.fecha_entrega,
        status: filajs.status,
        usuario: filajs.usuario,
        timestamp: filajs.timestamp,
      };
      ar[os].push(objetoArray);
    } //end of OP loop

    //console.log(ar[os]);
    if (!err) {
      res.send(ar[os]);
    } else {
      console.log(err);
    }
  }); // end mysqlConnection row
});

//----ORDEN DE SERVICIO (NIVEL de orden de servicio) limit 1----------------------------------
router.get("/uno_ordenes_servicio/:proveedor/:oserv", isAuth, (req, res) => {
  //isAuth,
  var data = {
    proveedor: req.params.proveedor,
    oserv: req.params.oserv,
  };
  //console.log(data.proveedor);

  $var_sql =
    " SELECT json_object('orden_servicio',pendiente_prov.orden_servicio , 'fecha_envio',pendiente_prov.fecha_envio, ";
  $var_sql += " 'fecha_entrega',pendiente_prov.recibo_fecha_desde, ";
  $var_sql +=
    " 'proveedor',pendiente_prov.proveedor, 'comentario', pendiente_prov.comentario) as myobj ";
  $var_sql +=
    " FROM ( SELECT tb.orden_servicio, tb.fecha_envio, tb.proveedor, tb.recibo_fecha_desde, ";
  $var_sql +=
    " sku.sku, sku.sku_readable, sku.cantidad, recep_grp.cantidad as 'qty', commento.comentario, ";
  $var_sql += " CASE ";
  $var_sql +=
    " WHEN (sku.cantidad - recep_grp.cantidad) is not null THEN (sku.cantidad - recep_grp.cantidad) ";
  $var_sql +=
    " WHEN (sku.cantidad - recep_grp.cantidad) is null THEN sku.cantidad ";
  $var_sql += " END as cantidad_restante ";
  $var_sql += " FROM orden_de_servicio as tb  ";
  $var_sql +=
    " inner join orden_de_servicio_sku as sku ON tb.orden_servicio = sku.orden_servicio ";
  $var_sql += " left join ( ";
  $var_sql +=
    " SELECT rec.orden_servicio, rec.sku, SUM(rec.cantidad) as cantidad ";
  $var_sql += " FROM recepcion as rec group by rec.sku, rec.orden_servicio ";
  $var_sql +=
    " ) as recep_grp on tb.orden_servicio = recep_grp.orden_servicio AND sku.sku = recep_grp.sku ";
  $var_sql +=
    " left join ( select orden, comentario from tb_temp_movimiento where descripcion_mov = 'comentario orden servicio taller' ";
  $var_sql += " ) as commento ON commento.orden = tb.orden_servicio ";
  $var_sql +=
    " WHERE tb.proveedor = '" +
    data.proveedor +
    "' AND tb.orden_servicio = '" +
    data.oserv +
    "' ";
  // $var_sql += " HAVING cantidad_restante > 1 ";
  $var_sql += " ) AS pendiente_prov ";
  $var_sql += " GROUP BY pendiente_prov.orden_servicio ";
  $var_sql += " ";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    var ar = {}; // empty Object
    var os = "prods";
    ar[os] = [];

    for (let i = 0; i < rows.length; i++) {
      var filajs = JSON.parse(rows[i].myobj);
      var objetoArray = {
        orden: filajs.orden_servicio,
        proveedor: filajs.proveedor,
        fecha_creacion: filajs.fecha_envio,
        fecha_entrega: filajs.fecha_entrega,
        comentario: filajs.comentario,
      };
      ar[os].push(objetoArray);
    } //end of OP loop

    //console.log(ar[os]);
    if (!err) {
      res.send(ar[os]);
    } else {
      console.log(err);
    }
  }); // end mysqlConnection row
});

//----ORDEN DE SERVICIO (nivel de orden de sku dentro de OS)----------------------------------
router.get("/ordenes_servicio/:proveedor/:oserv", (req, res) => {
  //isAuth,
  var data = {
    proveedor: req.params.proveedor,
    oserv: req.params.oserv,
  };
  console.log(data.proveedor);

  $var_sql =
    " SELECT json_object( 'orden_servicio',pendiente_prov.orden_servicio,'proveedor',pendiente_prov.proveedor,";
  $var_sql +=
    " 'fecha_envio',pendiente_prov.fecha_envio,'fecha_entrega',pendiente_prov.recibo_fecha_desde,";
  $var_sql +=
    " 'productos', JSON_ARRAY( json_object( 'sku', pendiente_prov.sku,'sku_readable',pendiente_prov.sku_readable, ";
  $var_sql +=
    " 'cantidad', pendiente_prov.cantidad, 'entregaConforme', pendiente_prov.cantidad_conforme, 'entregaNoConforme', pendiente_prov.cantidad_no_conforme, ";
  $var_sql +=
    " 'precio_unit_conIGV', pendiente_prov.precio_unit_conIGV, 'cantidad_pendiente', pendiente_prov.cantidad_pendiente ";
  $var_sql += " ))) as myobj ";
  $var_sql += " FROM ( ";
  $var_sql +=
    " SELECT tb2.orden_servicio, tb2.fecha_envio, tb2.proveedor, tb2.recibo_fecha_desde,tb2.sku,  ";
  $var_sql +=
    " tb2.sku_readable, tb3.cantidad, tb3.cantidad_conforme, tb3.cantidad_no_conforme, tb3.precio_unit_conIGV, ";
  $var_sql += " CASE ";
  $var_sql +=
    " WHEN (tb3.cantidad - tb3.cantidad_conforme - tb3.cantidad_no_conforme) is not null THEN (tb3.cantidad - tb3.cantidad_conforme - tb3.cantidad_no_conforme) ";
  $var_sql +=
    " WHEN (tb3.cantidad - tb3.cantidad_conforme - tb3.cantidad_no_conforme) is null THEN tb3.cantidad ";
  $var_sql += " END as cantidad_pendiente ";
  $var_sql +=
    " FROM( SELECT tb.orden_servicio, tb.fecha_envio, tb.proveedor, tb.recibo_fecha_desde, sku.sku, sku.sku_readable, sku.cantidad, recep_grp.cantidad as 'qty',";
  $var_sql +=
    " CASE WHEN (sku.cantidad - recep_grp.cantidad) is not null THEN (sku.cantidad - recep_grp.cantidad) ";
  $var_sql +=
    " WHEN (sku.cantidad - recep_grp.cantidad) is null THEN sku.cantidad END as cantidad_restante ";
  $var_sql +=
    " FROM orden_de_servicio as tb inner join orden_de_servicio_sku as sku ON tb.orden_servicio = sku.orden_servicio ";
  $var_sql +=
    " left join ( SELECT rec.orden_servicio, rec.sku, SUM(rec.cantidad) as cantidad ";
  $var_sql +=
    " FROM recepcion as rec group by rec.sku, rec.orden_servicio ) as recep_grp on tb.orden_servicio = recep_grp.orden_servicio AND sku.sku = recep_grp.sku ";
  $var_sql +=
    " WHERE tb.proveedor = '" +
    data.proveedor +
    "' AND tb.orden_servicio = '" +
    data.oserv +
    "'  "; //HAVING cantidad_restante > 0
  $var_sql += " ) as tb2 INNER JOIN ( ";
  $var_sql +=
    " SELECT tb.categoria, tb.proveedor, tb.orden_servicio, tb.orden_corte, tb.sku, tb.sku_readable, tb.cantidad,  tb.sku_catalogo_readable, tb.cantidad_conforme, tb.cantidad_no_conforme,  CASE  WHEN tb_precio.costo_unitario_conIGV  is NULL THEN '-'  WHEN tb_precio.costo_unitario_conIGV > 0 THEN tb_precio.costo_unitario_conIGV  END as precio_unit_conIGV  FROM (  SELECT env2.orden_servicio, env2.orden_corte, env2.sku, env2.sku_readable, env2.cantidad,  env2.categoria,env2.proveedor,env2.sku_catalogo_readable,env2.sku_catalogo,  CASE  WHEN tb_conforme.cantidad_conforme is NULL THEN 0  WHEN tb_conforme.cantidad_conforme > 0 THEN tb_conforme.cantidad_conforme  END as cantidad_conforme,  CASE  WHEN tb_no_conforme.cantidad_no_conforme is NULL THEN 0  WHEN tb_no_conforme.cantidad_no_conforme > 0 THEN tb_no_conforme.cantidad_no_conforme  END as cantidad_no_conforme  FROM (  SELECT env.orden_servicio, env.orden_corte, env.sku, env.sku_readable, env.cantidad,  (SELECT categoria FROM sku WHERE sku.sku = env.sku limit 1) AS 'categoria',  (SELECT proveedor FROM orden_de_servicio WHERE orden_de_servicio.orden_servicio = env.orden_servicio limit 1) AS 'proveedor',  (SELECT sku.sku_catalogo_readable FROM sku WHERE sku.sku = env.sku limit 1) AS 'sku_catalogo_readable',  (SELECT sku.sku_catalogo FROM sku WHERE sku.sku = env.sku limit 1) AS 'sku_catalogo'  FROM orden_de_servicio_sku as env  ) as env2  LEFT JOIN (  SELECT orden_servicio, sku,  SUM(cantidad) as 'cantidad_conforme'  FROM recepcion  WHERE estado_sku = 'conforme'  GROUP BY orden_servicio, sku  HAVING cantidad_conforme > 0  ) as tb_conforme  ON env2.orden_servicio = tb_conforme.orden_servicio AND env2.sku_catalogo = tb_conforme.sku  LEFT JOIN (  SELECT orden_servicio, sku,  SUM(cantidad) as 'cantidad_no_conforme'  FROM recepcion  WHERE estado_sku = 'no-conforme'  GROUP BY orden_servicio, sku  HAVING cantidad_no_conforme > 0  ) as tb_no_conforme ON env2.orden_servicio = tb_no_conforme.orden_servicio AND env2.sku_catalogo = tb_no_conforme.sku ";
  $var_sql += " WHERE env2.orden_servicio = '" + data.oserv + "' ) as tb ";
  $var_sql +=
    " LEFT JOIN precios_proveedor AS tb_precio  ON tb.proveedor = tb_precio.proveedor ";
  $var_sql += " AND tb.categoria = tb_precio.categoria_sku ) as tb3 ";
  $var_sql +=
    " ON tb2.orden_servicio = tb3.orden_servicio AND tb2.sku = tb3.sku ";
  $var_sql += " ) AS pendiente_prov ";

  //console.log($var_sql);
  mysqlConnection.query($var_sql, (err, rows, fields) => {
    var ar = {}; // empty Object
    var os = "prods";
    ar[os] = [];

    for (let i = 0; i < rows.length; i++) {
      var filajs = JSON.parse(rows[i].myobj);
      var objetoArray = {
        orden: filajs.orden_servicio,
        proveedor: filajs.proveedor,
        fecha_creacion: filajs.fecha_envio,
        fecha_entrega: filajs.fecha_entrega,
        comentario: filajs.comentario,
        productos: filajs.productos,
      };
      ar[os].push(objetoArray);
    } //end of OP loop

    //console.log(ar[os]);
    if (!err) {
      res.send(ar[os]);
    } else {
      console.log(err);
    }
  }); // end mysqlConnection row
});






// @desc      Get categoria y color_sku_catalogo (Collapse titulo)
// @route     GET http://localhost:3006/info/orden_servicio/categorias/:oserv
// @access    Private
router.get("/orden_servicio/categorias/:oserv", isAuth, (req, res) => { //isAuth,
  var data = {oserv: req.params.oserv };
  console.log('yoshio'); 
  console.log(data.oserv);

  $var_sql = " SELECT json_object('categoria',campo.categoria,'color_sku_catalogo',campo.color_sku_catalogo) as myobj ";
  $var_sql += " FROM (  ";
  $var_sql += " SELECT DISTINCT categoria, color_sku_catalogo FROM sku WHERE sku IN (SELECT DISTINCT sku FROM orden_de_servicio_sku ";
  $var_sql += " WHERE orden_servicio = '" + data.oserv + "' )";
  $var_sql += " ) AS campo ";
  console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    var ar = {}; // empty Object
    var os = "prods";
    ar[os] = [];

    for (let i = 0; i < rows.length; i++) {
      var filajs = JSON.parse(rows[i].myobj);
      var objetoArray = {
        categoria: filajs.categoria,
        color_sku_catalogo: filajs.color_sku_catalogo
      };
      ar[os].push(objetoArray);
    } //end of OP loop

    console.log(ar[os]);
    if (!err) {
      res.send(ar[os]);
    } else {
      console.log(err);
    }
  }); // end mysqlConnection row
});

// @desc      Get categoria y color_sku_catalogo (Collapse titulo)
// @route     GET http://localhost:3006/info/orden_servicio/categorias/sku_catalogo/:oserv
// @access    Public
router.get("/orden_servicio/categorias/sku_catalogo/:oserv", isAuth, (req, res) => { //isAuth,
  var data = {oserv: req.params.oserv};
  console.log(data.oserv); 

  $var_sql = " SELECT json_object('orden_servicio', campo.orden_servicio,'categoria', campo.categoria,'sku_catalogo_readable', campo.sku_catalogo_readable, 'cantidad', campo.cantidad,'color_sku_catalogo', campo.color_sku_catalogo) as myobj ";
  $var_sql += " FROM ( ";
  $var_sql += " SELECT DISTINCT os_sku.orden_servicio, sku.categoria, sku.sku_catalogo_readable, os_sku.cantidad, sku.color_sku_catalogo ";
  $var_sql += " FROM orden_de_servicio_sku as os_sku ";
  $var_sql += " INNER JOIN sku ON sku.sku = os_sku.sku ";
  $var_sql += " WHERE  orden_servicio = '" + data.oserv + "' ";
  $var_sql += " ) AS campo ";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    var ar = {}; // empty Object
    var os = "prods";
    ar[os] = [];

    for (let i = 0; i < rows.length; i++) {
      var filajs = JSON.parse(rows[i].myobj);
      var objetoArray = {
        orden_servicio: filajs.orden_servicio,
        categoria: filajs.categoria,
        sku_catalogo_readable: filajs.sku_catalogo_readable,
        cantidad: filajs.cantidad,
        color_sku_catalogo: filajs.color_sku_catalogo
      };
      ar[os].push(objetoArray);
    } //end of OP loop

    //console.log(ar[os]);
    if (!err) {
      res.send(ar[os]);
    } else {
      console.log(err);
    }
  }); // end mysqlConnection row
});


// @desc      Get trial nested json query
// @route     GET http://localhost:3006/info/orden_servicio/categorias/sku_catalogo/v2/:oserv
// @access    Private
router.get("/orden_servicio/categorias/sku_catalogo/v2/:oserv", isAuth, (req, res) => { //isAuth,
  var data = {oserv: req.params.oserv};
  console.log(data.oserv); 

  $var_sql = "  SELECT json_object('OS',tb1.orden_servicio,'prov',tb1.proveedor, ";
  $var_sql += " 'os_skus', JSON_EXTRACT(IFNULL((SELECT CONCAT('[',GROUP_CONCAT( json_object('sku',sku,'cantidad',cantidad) ),']') ";
  $var_sql += " FROM orden_de_servicio_sku where orden_servicio = tb1.orden_servicio),'[]'),'$'), ";
  $var_sql += " 'os_pendientes', JSON_EXTRACT(IFNULL((SELECT CONCAT('[',GROUP_CONCAT( json_object('prov',proveedor,'cantidad',numOS) ),']') ";
  $var_sql += " From ( SELECT proveedor, count(*) as numOS FROM orden_de_servicio GROUP BY proveedor ) as tb where tb.proveedor = tb1.proveedor),'[]'),'$') ";
  $var_sql += " ) as myobj FROM orden_de_servicio tb1 ";
  $var_sql += " ";
  console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    var ar = {}; // empty Object
    var os = "prods";
    ar[os] = [];

    for (let i = 0; i < rows.length; i++) {
      var filajs = JSON.parse(rows[i].myobj);
      var objetoArray = {
        orden_servicio: filajs.OS,
        proveedor: filajs.prov,
        productos: filajs.os_skus,
        os_pendientes: filajs.os_pendientes
      };
      ar[os].push(objetoArray);
    } //end of OP loop

    //console.log(ar[os]);
    if (!err) {
      res.send(ar[os]);
    } else {
      console.log(err);
    }
  }); // end mysqlConnection row
});





//----Comentarios por ordenes de servicio----------------------------------
// http://localhost:3006/info/os_comentarios/OS-2020-7-5v2
router.get("/os_comentarios/:oserv", isAuth, (req, res) => {
  //isAuth,
  var data = {
    oserv: req.params.oserv,
  };

  $var_sql =
    " SELECT json_object('orden_servicio',com.orden,'comentario',com.comentario, ";
  $var_sql +=
    " 'usuario', com.usuario,'fecha_creacion',com.created_at) as myobj ";
  $var_sql += " FROM( ";
  $var_sql += " select mov_id, orden, comentario, usuario, created_at ";
  $var_sql += " from tb_temp_movimiento ";
  $var_sql +=
    " where descripcion_mov = 'comentario orden servicio taller' and estado <> 'no_activo' ";
  $var_sql +=
    " and orden = '" + data.oserv + "' and comentario <> '' order by mov_id ";
  $var_sql += " ) as com ";
  $var_sql += " ";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    var ar = {}; // empty Object
    var os = "prods";
    ar[os] = [];

    for (let i = 0; i < rows.length; i++) {
      var filajs = JSON.parse(rows[i].myobj);
      var objetoArray = {
        orden_servicio: filajs.orden_servicio,
        comentario: filajs.comentario,
        usuario: filajs.usuario,
        fecha_creacion: filajs.fecha_creacion,
      };
      ar[os].push(objetoArray);
    } //end of OP loop

    //console.log(ar[os]);
    if (!err) {
      res.send(ar[os]);
    } else {
      console.log(err);
    }
  }); // end mysqlConnection row
});

//- - - -DOCUMENTOS IMAGES ACTIVOS - - - - - - - - - -
//GET http://localhost:3006/info/imagenes/OS-2020-8-15v1-37
router.get("/imagenes/:oserv", isAuth, (req, res) => {
  //isAuth,
  var data = {
    oserv: req.params.oserv,
  };
  //console.log(data.oserv);

  $var_sql =
    " SELECT json_object('image_id',tb.image_id,'nombre', tb.nombre, 'url', tb.url, 'estado', tb.estado) as myobj ";
  $var_sql += "FROM ( ";
  $var_sql +=
    " SELECT image_id, nombre, url, estado FROM tb_imagen WHERE orden_servicio = '" +
    data.oserv +
    "'  ";
  $var_sql += " ) AS tb ";
  $var_sql += " ";
  console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    var ar = {}; // empty Object
    var os = "imagen";
    ar[os] = [];

    for (let i = 0; i < rows.length; i++) {
      var filajs = JSON.parse(rows[i].myobj);
      var objetoArray = {
        image_id: filajs.image_id,
        nombre: filajs.nombre,
        url: filajs.url,
        estado: parseInt(filajs.estado),
      };
      ar[os].push(objetoArray);
    } //end of OP loop

    //console.log(ar[os]);
    if (!err) {
      res.send(ar[os]);
    } else {
      console.log(err);
    }
  }); // end mysqlConnection row
});

//prueba json nested
router.get("/json_nested", (req, res) => {
  $var_sql =
    " SELECT json_object('orden_despacho', orden_despacho.cod_orden_despacho, 'cliente',orden_despacho.nombre_cliente, 'skus', ( SELECT concat('[',GROUP_CONCAT(json_object('orden_despacho',cod_orden_despacho, 'sku', sku, 'cantidad', cantidad)),']') from orden_despacho_sku where orden_despacho.cod_orden_despacho = orden_despacho_sku.cod_orden_despacho)) as json_definition from orden_despacho  ";

  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});


// http://localhost:3006/info/woo_orden_sku
router.get("/woo_orden_sku", isAuth,(req, res) => { //isAuth,
  //isAuth,
  var data = {
    oserv: req.params.oserv,
  };

  $var_sql =" SELECT json_object('cod_orden_despacho',com.cod_orden_despacho, ";
  $var_sql += " 'tol_sku',com.tol_sku,'cantidad_despacho', com.cantidad_despacho,'orden_id', ";
  $var_sql += " com.orden_id) as myobj ";
  $var_sql += " FROM( ";
  $var_sql += " SELECT DISTINCT concat('OD','-',YEAR(woo.created_at),'-',MONTH(woo.created_at),'-',DAY(woo.created_at),'v',woo.orden_id) as 'cod_orden_despacho', ";
  $var_sql += " conver.tol_sku, (woo.cantidad * conver.tol_cantidad) as 'cantidad_despacho',cliente.orden_id ";
  $var_sql += " FROM( ";
  $var_sql += " SELECT concat(sku,'_',talla,'_',color) as concatenado, ";
  $var_sql += " orden_id, sku, nombre_sku, talla, color, cantidad, created_at ";
  $var_sql += " FROM woo_order_b2c_producto ";
  $var_sql += " ) AS woo LEFT JOIN ( ";
  $var_sql += " select concat(eco_sku,'_',eco_talla,'_',eco_color) as concatenado, ";
  $var_sql += " eco_sku, eco_talla, eco_color, tol_sku, tol_cantidad ";
  $var_sql += " from ecommerce_tol_conversion ";
  $var_sql += " ) as conver ON woo.concatenado = conver.concatenado ";
  $var_sql += " INNER JOIN woo_order_b2c_cliente as cliente ";
  $var_sql += " ON woo.orden_id = cliente.orden_id ";
  $var_sql += " WHERE conver.eco_sku IS NOT NULL ";
  $var_sql += " AND cliente.orden_id NOT IN (SELECT DISTINCT od.nota_pedido from orden_despacho as od) ";
  $var_sql += " ) as com ";
  console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    var ar = {}; // empty Object
    var os = "prods";
    ar[os] = [];

    for (let i = 0; i < rows.length; i++) {
      var filajs = JSON.parse(rows[i].myobj);
      var objetoArray = {
        cod_orden_despacho: filajs.cod_orden_despacho,
        sku: filajs.tol_sku,
        cantidad_despacho: filajs.cantidad_despacho,
        orden_id: filajs.orden_id,
      };
      ar[os].push(objetoArray);
    } //end of OP loop

    //console.log(ar[os]);
    if (!err) {
      res.send(ar[os]);
    } else {
      console.log(err);
    }
  }); // end mysqlConnection row
});


// http://localhost:3006/info/woo_orden
router.get("/woo_orden", isAuth,(req, res) => { //isAuth,
  var data = {
    oserv: req.params.oserv,
  };

  $var_sql =" SELECT json_object('cod_orden_despacho',com.cod_orden_despacho, ";
  $var_sql += " 'fecha_creacion',DATE(com.fecha_creacion),'fecha_despacho', DATE(com.fecha_despacho),'nombre_cliente',com.nombre_cliente,'nota_pedido', ";
  $var_sql += " com.nota_pedido) as myobj ";
  $var_sql += " FROM( ";
  $var_sql += " SELECT DISTINCT tb1.cod_orden_despacho,DATE(tb1.fecha_creacion) as 'fecha_creacion', DATE(tb1.fecha_despacho) as 'fecha_despacho', ";
  $var_sql += " tb1.nombre_cliente, tb1.nota_pedido ";
  $var_sql += " FROM ( ";
  $var_sql += " SELECT DISTINCT concat('OD','-',YEAR(woo.created_at),'-',MONTH(woo.created_at),'-',DAY(woo.created_at),'v',woo.orden_id) as 'cod_orden_despacho', ";
  $var_sql += " woo.created_at as 'fecha_creacion', ";
  $var_sql += " CASE WHEN WEEKDAY(woo.created_at + INTERVAL 2 DAY) IN (5,6) THEN woo.created_at + INTERVAL 3 DAY ";
  $var_sql += " ELSE (woo.created_at + INTERVAL 2 DAY) END AS 'fecha_despacho', ";
  $var_sql += " cliente.nombre_cliente as 'nombre_cliente', cliente.orden_id as 'nota_pedido' ";
  $var_sql += " FROM( ";
  $var_sql += " SELECT concat(sku,'_',talla,'_',color) as concatenado, ";
  $var_sql += " orden_id, sku, nombre_sku, talla, color, cantidad, created_at ";
  $var_sql += " FROM woo_order_b2c_producto ";
  $var_sql += " ) AS woo LEFT JOIN ( ";
  $var_sql += " select concat(eco_sku,'_',eco_talla,'_',eco_color) as concatenado, ";
  $var_sql += " eco_sku, eco_talla, eco_color, tol_sku, tol_cantidad ";
  $var_sql += " from ecommerce_tol_conversion ";
  $var_sql += " ) as conver ON woo.concatenado = conver.concatenado ";
  $var_sql += " INNER JOIN woo_order_b2c_cliente as cliente ";
  $var_sql += " ON woo.orden_id = cliente.orden_id ";
  $var_sql += " WHERE conver.eco_sku IS NOT NULL ";
  $var_sql += " AND cliente.orden_id NOT IN (SELECT DISTINCT od.nota_pedido from orden_despacho as od) ";
  $var_sql += " ) as tb1 ";
  $var_sql += " ) as com ";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    var ar = {}; // empty Object
    var os = "prods";
    ar[os] = [];

    for (let i = 0; i < rows.length; i++) {
      var filajs = JSON.parse(rows[i].myobj);
      var objetoArray = {
        cod_orden_despacho: filajs.cod_orden_despacho,
        fecha_creacion: filajs.fecha_creacion,
        fecha_despacho: filajs.fecha_despacho,
        nombre_cliente: filajs.nombre_cliente,
        nota_pedido: filajs.nota_pedido,
      };
      ar[os].push(objetoArray);
    } //end of OP loop

    //console.log(ar[os]);
    if (!err) {
      res.send(ar[os]);
    } else {
      console.log(err);
    }
  }); // end mysqlConnection row
});



//:::::::::::Prueba::::::::::::::::::
// GET todas ordenes de servicio de un determinado taller 
//http://localhost:3006/info/powerbiprueba
router.get("/powerbiprueba",  (req, res) => { //isAuth,
  //isAuth,
  var data = {
    proveedor: req.params.proveedor,
  };
  //console.log(data.proveedor);

  $var_sql = "SELECT distinct os.orden_servicio, os.proveedor, os.fecha_envio FROM orden_de_servicio ";
  $var_sql += "AS os LEFT JOIN enviados_a_servicio AS es ON os.orden_servicio = es.orden_servicio ";
  console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      //res.json(rows);
    } else {
      console.log(err);
    }
  });
});
// GET todas ordenes de servicio de un determinado taller 
//http://localhost:3006/info/powerbipruebaconclave
router.get("/powerbipruebaconclave",  isAuth, (req, res) => { 
  //isAuth,
  var data = {
    proveedor: req.params.proveedor,
  };
  //console.log(data.proveedor);

  $var_sql = "SELECT distinct os.orden_servicio, os.proveedor, DATE(os.fecha_envio) as 'fecha_envio' FROM orden_de_servicio ";
  $var_sql += "AS os LEFT JOIN enviados_a_servicio AS es ON os.orden_servicio = es.orden_servicio ";
  console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});



// ****** POWER BI Web apis**********************************//


//SKU catalogos despachados (Historial)
router.get("/despacho_skus",  (req, res) => { 
 
  $var_sql = " SELECT stck.stock_id, tb1.fecha_creacion,stck.id_despacho, tb1.fecha_despacho, tb1.tipo_despacho,tb1.nombre_cliente, tb1.nota_pedido, tb1.detalles, ";
  $var_sql += " catalog.categoria, stck.sku,  catalog.sku_readable, catalog.color, catalog.talla, stck.cantidad, stck.nombre_operacion, stck.usuario, stck.timestamp as 'fecha_despacho_sku' ";
  $var_sql += " FROM stock AS stck LEFT JOIN ";
  $var_sql += " (SELECT cod_orden_despacho, fecha_creacion, fecha_despacho, tipo_despacho, nombre_cliente, nota_pedido, detalles from orden_despacho ) as tb1 ";
  $var_sql += " ON stck.id_despacho = tb1.cod_orden_despacho ";
  $var_sql += " LEFT JOIN ( SELECT catlog.categoria, catlog.sku_catalogo, catlog.sku_readable, catlog.color, catlog.talla FROM tb_sku_catalogo AS catlog ) AS catalog ";
  $var_sql += " ON stck.sku = catalog.sku_catalogo WHERE stck.timestamp > '2021-01-01' AND stck.nombre_operacion = 'out_despacho'  ";
  console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });

});

//PRobar una funcion que cree tabla temporal
function temp_table_despachado() { 

  $var_sql = " CREATE TEMPORARY TABLE IF NOT EXISTS temp_despachado AS (";
  $var_sql += " SELECT stck.stock_id, tb1.fecha_creacion,stck.id_despacho, tb1.fecha_despacho, tb1.tipo_despacho,tb1.nombre_cliente, tb1.nota_pedido, tb1.detalles, ";
  $var_sql += " catalog.categoria, stck.sku,  catalog.sku_readable, catalog.color, catalog.talla, stck.cantidad, stck.nombre_operacion, stck.usuario, stck.timestamp as 'fecha_despacho_sku' ";
  $var_sql += " FROM stock AS stck LEFT JOIN ";
  $var_sql += " (SELECT cod_orden_despacho, fecha_creacion, fecha_despacho, tipo_despacho, nombre_cliente, nota_pedido, detalles from orden_despacho ) as tb1 ";
  $var_sql += " ON stck.id_despacho = tb1.cod_orden_despacho ";
  $var_sql += " LEFT JOIN ( SELECT catlog.categoria, catlog.sku_catalogo, catlog.sku_readable, catlog.color, catlog.talla FROM tb_sku_catalogo AS catlog ) AS catalog ";
  $var_sql += " ON stck.sku = catalog.sku_catalogo WHERE stck.timestamp > '2020-01-01' AND stck.nombre_operacion = 'out_despacho'  ";
  $var_sql += " )";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      //res.json(rows);
      console.log('Tabla temporal creada');
    } else {
      console.log(err);
    }
  });

};

router.get("/despacho_skus_nested",  async(req, res, next) => { 
 
  try {
    await temp_table_despachado()
  } catch (error) {
    return next(error)
  }

  $var_sql = " Select * from temp_despachado ";
  $var_sql += " ";
  $var_sql += " ";
  //console.log($var_sql);

  mysqlConnection.query($var_sql, (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });

});

module.exports = router;
