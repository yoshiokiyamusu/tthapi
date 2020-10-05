const path = require("path");
const express = require("express");
const { body } = require("express-validator/check");
const router = express.Router();
const mysqlConnection = require("../database.js");
const writeController = require("../controllers/write_db");
const isAuth = require("../middleware/is-auth"); //para ponerle restriccion de tocken a las funciones
const { upload } = require("../libs/multer");

// POST http://localhost:3006/write/book
router.post(
  "/book",
  /*[
    body('title')
      .trim()
      .isLength({ min: 1 })
  ],*/
  writeController.createPost2
);

// POST /write/comment
router.post(
  "/comment",
  isAuth,
  [body("usuario").trim().not().isEmpty().isLength({ min: 1 })],
  writeController.post_comment_proveedor
);

// Update /write/inactivo_comment
router.post(
  "/inactivo_comment",
  isAuth,
  [body("usuario").trim().not().isEmpty().isLength({ min: 1 })],
  writeController.post_comment_inactivo_os
);

// POST http://localhost:3006/write/os_status
router.post(
  "/os_status",
  [body("orden").trim().not().isEmpty().isLength({ min: 1 })],
  writeController.post_os_status
);

// POST http://localhost:3006/write/image
router.post(
  "/image",
  [body("os").trim().not().isEmpty().isLength({ min: 1 })],
  writeController.post_os_image
);

// POST http://localhost:3006/write/upload | Post cargar fotos docs en Digital Ocean
router.post("/upload", isAuth, upload, writeController.uploadFile);

module.exports = router;
