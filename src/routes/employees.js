
const express = require('express');
const router = express.Router();
const mysqlConnection  = require('../database.js');



/*

      // GET An Employee (one parameter)
      router.get('/:id', (req, res) => {
        const { id } = req.params;
        mysqlConnection.query('SELECT * FROM employee WHERE id = ?', [id], (err, rows, fields) => {
          if (!err) {
            res.json(rows[0]);
          } else {
            console.log(err);
          }
        });
      });

*/
/*
    // GET An Employee (two parameter)
    router.get('/:nombre/:min_salary', (req, res) => {
      var data = {
          "empleado": {
              "nombre": req.params.nombre,
              "min_salary": req.params.min_salary
          }
      };
      console.log(data.empleado.nombre);
      console.log(data.empleado.min_salary);

      mysqlConnection.query("SELECT * FROM employee WHERE name like '%" + data.empleado.nombre + "%' and salary > " + data.empleado.min_salary + "",
      (err, rows, fields) => {
        if (!err) {
          res.json(rows);
        } else {
          console.log(err);
        }
      });

    });
*/
/*
      // INSERT An Employee
      router.post('/', (req, res) => {
        const {id, name, salary} = req.body;
        console.log(id, name, salary);

        var data = {
            "empleado": {
                "id_num": req.body.id,
                "nombre": req.body.name,
                "salario": req.body.salary
            }
        };
        console.log(data.empleado.nombre);

        mysqlConnection.query(" INSERT INTO employee(name, salary) VALUES ( '" + data.empleado.nombre + "', " + data.empleado.salario + ")",
        (err, rows, fields) => {
          if (!err) {
            res.json(rows);
          } else {
            console.log(err);
          }
        });


      });
*/



    // GET all presente sku---------------------------------------------------------------------------
    router.get('/presente', (req, res) => {

      $var_sql = "SELECT sku.categoria, s_stock.sku, sku.sku_readable, sku.sku_catalogo_readable,  (IFNULL(s_stock.subt_cantidad,0) + IFNULL(s_ins.subt_cantidad,0) - IFNULL(s_out.subt_cantidad,0) + IFNULL(s_ajuste.subt_cantidad,0)) as sb_total FROM (SELECT sku, SUM(cantidad) as subt_cantidad from stock where nombre_operacion = 'stock' group by sku) as s_stock LEFT JOIN (SELECT sku, SUM(cantidad) as subt_cantidad from stock where nombre_operacion LIKE '%in%' group by sku) as s_ins ON s_stock.sku = s_ins.sku LEFT JOIN (SELECT sku, SUM(cantidad) as subt_cantidad from stock where nombre_operacion LIKE '%out%' group by sku) as s_out ON s_stock.sku = s_out.sku LEFT JOIN (SELECT sku, SUM(cantidad) as subt_cantidad from stock where nombre_operacion = 'ajuste' group by sku) as s_ajuste ON s_stock.sku = s_ajuste.sku inner join sku ON s_stock.sku = sku.sku_catalogo group by s_stock.sku ORDER BY sb_total asc";

      mysqlConnection.query($var_sql, (err, rows, fields) => {
        if(!err) {
          res.json(rows);
        } else {
          console.log(err);
        }
      });
    });
    // END: GET all sku---------------------------------------------------------------------------

    // GET all por recibir sku---------------------------------------------------------------------------
    router.get('/por_recibir', (req, res) => {

      $var_sql = " Select base.proveedor, base.categoria, base.sku, base.sku_readable, base.fecha_de_envio as fecha_envio, base.recibo_fecha_desde, base.recibo_fecha_hasta, base.sku_catalogo, CASE  WHEN (base.cantidad_units_enviadas - resta.cantidad) is NULL THEN base.cantidad_units_enviadas WHEN (base.cantidad_units_enviadas - resta.cantidad) > 0 THEN (base.cantidad_units_enviadas - resta.cantidad) END AS qty_pendiente from ( select sku.categoria, tb1.orden_corte, tb1.orden_servicio, tb2.proveedor, tb1.sku, tb1.sku_readable, sku.sku_catalogo,tb1.cantidad_units_enviadas, tb1.fecha_de_envio, tb2.recibo_fecha_desde,tb2.recibo_fecha_hasta from enviados_a_servicio as tb1 left join orden_de_servicio as tb2 ON tb1.orden_servicio = tb2.orden_servicio inner join sku ON tb1.sku = sku.sku WHERE tb1.sku NOT LIKE '%-B%' AND tb1.sku NOT LIKE '%-C%' AND tb1.sku NOT LIKE '%-D%' ) as base left join ( SELECT orden_servicio, sku, SUM(cantidad) as cantidad from recepcion group by orden_servicio, sku  ) as resta ON base.orden_servicio = resta.orden_servicio  AND base.sku_catalogo = resta.sku  HAVING qty_pendiente > 0 order by base.recibo_fecha_desde asc ";

      mysqlConnection.query($var_sql, (err, rows, fields) => {
        if(!err) {
          res.json(rows);
        } else {
          console.log(err);
        }
      });
    });
    // END: GET all sku---------------------------------------------------------------------------

    // GET all por despachar sku---------------------------------------------------------------------------
    router.get('/por_despachar', (req, res) => {

      $var_sql = " SELECT *, case  WHEN (od_sku.cantidad - out_desp.cantidad) is NULL THEN od_sku.cantidad WHEN (od_sku.cantidad - out_desp.cantidad) < 1 THEN (od_sku.cantidad - out_desp.cantidad) WHEN (od_sku.cantidad - out_desp.cantidad) > 1 THEN (od_sku.cantidad - out_desp.cantidad) end as 'cantidad_pendiente',  od_sku.cantidad as 'qty_od', out_desp.cantidad as 'qty_stock_out' FROM orden_despacho as od  INNER JOIN orden_despacho_sku as od_sku  ON od_sku.cod_orden_despacho = od.cod_orden_despacho left join (select id_despacho,sku,SUM(cantidad) as 'cantidad' from stock where nombre_operacion = 'out_despacho' group by id_despacho,sku) as out_desp on od.cod_orden_despacho = out_desp.id_despacho and od_sku.sku = out_desp.sku inner join (select categoria, sku_catalogo from tb_sku_catalogo) as sku_cat_tb on od_sku.sku = sku_cat_tb.sku_catalogo where  status = 'por_despachar' HAVING cantidad_pendiente > 0 ";

      mysqlConnection.query($var_sql, (err, rows, fields) => {
        if(!err) {
          res.json(rows);
        } else {
          console.log(err);
        }
      });
    });
    // END: GET all sku---------------------------------------------------------------------------


    router.get('/prueba', (req, res) => {

      $var_sql = "SELECT * from orden_despacho_sku order by cantidad desc limit 12";

      mysqlConnection.query($var_sql, (err, rows, fields) => {
        if(!err) {
          res.json(rows);
        } else {
          console.log(err);
        }
      });
    });









    // GET all presente sku (one parameter) Filtra por categoria ---------------------------------------------
    router.get('/:nombre', (req, res) => {

      var data = {
          "categoria": {
              "nombre": req.params.nombre
          }
      };

      $var_sql = " SELECT sku.categoria, s_stock.sku, sku.sku_readable, sku.sku_catalogo_readable, (IFNULL(s_stock.subt_cantidad,0) + IFNULL(s_ins.subt_cantidad,0) - IFNULL(s_out.subt_cantidad,0) + IFNULL(s_ajuste.subt_cantidad,0)) as sb_total FROM (SELECT  sku, SUM(cantidad) as subt_cantidad from stock where nombre_operacion = 'stock' group by sku) as s_stock LEFT JOIN (SELECT sku, SUM(cantidad) as subt_cantidad from stock where nombre_operacion LIKE '%in%' group by sku) as s_ins ON s_stock.sku = s_ins.sku LEFT JOIN (SELECT sku, SUM(cantidad) as subt_cantidad from stock where nombre_operacion LIKE '%out%' group by sku) as s_out ON s_stock.sku = s_out.sku LEFT JOIN (SELECT sku, SUM(cantidad) as subt_cantidad from stock where nombre_operacion = 'ajuste' group by sku) as s_ajuste ON s_stock.sku = s_ajuste.sku inner join sku ON s_stock.sku = sku.sku_catalogo  WHERE sku.categoria = '" + data.categoria.nombre + "' group by s_stock.sku ORDER BY sb_total asc ";

      mysqlConnection.query($var_sql, (err, rows, fields) => {
        if (!err) {
          res.json(rows[0]);
        } else {
          console.log(err);
        }
      });
    });
   // END: GET all presente sku (one parameter) Filtra por categoria ---------------------------------------------






module.exports = router;
