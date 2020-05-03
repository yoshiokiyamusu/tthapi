
const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'corner_tool', //corner_tool   node_db_practice
  multipleStatements: true
});

mysqlConnection.connect(function (err) {
  if (err) {
    console.error(err);
    return;
  } else {
    console.log('db is connected');
  }
});

module.exports = mysqlConnection;






/*

heroku TOL
const mysqlConnection = mysql.createConnection({
  host: 'ysp9sse09kl0tzxj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'mlq7ddpaya3gnozv',
  password: 'n4slsu3xuaiqtbgd',
  database: 'szps1l4ru1pkph3s',
  multipleStatements: true
});

localhost
const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'corner_tool', //corner_tool   node_db_practice
  multipleStatements: true
});





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
