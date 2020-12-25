const mysql = require("mysql");

const mysqlConnection = mysql.createConnection({
  host: 'klbcedmmqp7w17ik.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'nbl3g3rfgr9zmzlp',
  password: 'nl6fxqx5cxwy81hv',
  database: 'zau1dw9gx8qcfum4',
  multipleStatements: true
});

mysqlConnection.connect(function (err) {
  if (err) {
    console.error(err);
    return;
  } else {
    console.log("db is connected");
  }
});

module.exports = mysqlConnection;

/*
Heroku TOL Maria DB
const mysqlConnection = mysql.createConnection({
  host: 'klbcedmmqp7w17ik.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'nbl3g3rfgr9zmzlp',
  password: 'nl6fxqx5cxwy81hv',
  database: 'zau1dw9gx8qcfum4',
  multipleStatements: true
});



localhost
const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_tol_local', //corner_tool   node_db_practice
  multipleStatements: true
});

//Push to Github:
git add .
git commit -m "comment"
git push api_tol_wms master

git remote -v
git status
api_tol_wms



//PARA CONECTAR AL MYSQL REMOTO::
const mysqlConnection = mysql.createConnection({
        host: 'fugfonv8odxxolj8.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'cfvc0xg9mms2s789',
        password: 'zcyp2fux4q42n6rm',
        database: 'm6ul1nyhger85ik5',
  multipleStatements: true
});


********************************
CREATE DATABASE IF NOT EXISTS company;

USE company;

CREATE TABLE employee (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) DEFAULT NULL,
  salary INT(11) DEFAULT NULL,
  PRIMARY KEY(id)
);

DESCRIBE employee;

INSERT INTO employee values
  (1, 'Ryan Ray', 20000),
  (2, 'Joe McMillan', 40000),
  (3, 'John Carter', 50000);

SELECT * FROM employee;

*/
