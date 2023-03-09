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

Heroku TOL Maria DB (Practica)
const mysqlConnection = mysql.createConnection({
  host: 'un0jueuv2mam78uv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'o4ss489wi958kx63',
  password: 'jtssfqcw52r5i9kj',
  database: 'oz5sldk8ael1ojko',
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



*/
