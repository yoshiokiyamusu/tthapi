
const express = require('express');
const router = express.Router();
const mysqlConnection  = require('../database.js');



// GET all Employees
router.get('/', (req, res) => {
  mysqlConnection.query('SELECT * FROM employee', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

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



module.exports = router;
