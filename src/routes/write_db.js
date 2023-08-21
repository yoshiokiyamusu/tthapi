const path = require('path');
const express = require('express');
const { body } = require('express-validator/check');
const router = express.Router();
const mysqlConnection = require('../database.js');
const writeController = require('../controllers/write_db');
const isAuth = require('../middleware/is-auth'); //para ponerle restriccion de tocken a las funciones
const { upload } = require('../libs/multer');

// POST http://localhost:3006/write/book
router.post(
  '/book',
  /*[
    body('title')
      .trim()
      .isLength({ min: 1 })
  ],*/
  writeController.createPost2
);

// POST /write/comment
router.post(
  '/comment',
  isAuth,
  [body('usuario').trim().not().isEmpty().isLength({ min: 1 })],
  writeController.post_comment_proveedor
);

// Update /write/inactivo_comment
router.post(
  '/inactivo_comment',
  isAuth,
  [body('usuario').trim().not().isEmpty().isLength({ min: 1 })],
  writeController.post_comment_inactivo_os
);

// POST http://localhost:3006/write/os_status
router.post(
  '/os_status',
  [body('orden').trim().not().isEmpty().isLength({ min: 1 })],
  writeController.post_os_status
);

// POST http://localhost:3006/write/image
router.post(
  '/image',
  [body('os').trim().not().isEmpty().isLength({ min: 1 })],
  writeController.post_os_image
);

// POST http://localhost:3006/write/upload | Post cargar fotos docs en Digital Ocean
router.post('/upload', upload, writeController.uploadFile); //isAuth,

// POST http://localhost:3006/write/colorPic | Post cargar fotos docs en Digital Ocean
router.post('/colorPic', upload, writeController.colorPic); //isAuth,

// POST http://localhost:3006/write/woo_orden_sku | subir woo ordenes por orden de compra
router.post(
  '/woo_orden_sku',
  [body('orden_id').trim().not().isEmpty().isLength({ min: 1 })],
  writeController.post_woo_orden_sku
);

// POST http://localhost:3006/write/woo_orden | subir woo ordenes por SKU de orden de compra
router.post(
  '/woo_orden',
  [body('orden_id').trim().not().isEmpty().isLength({ min: 1 })],
  writeController.post_woo_orden
);

// POST http://localhost:3006/write/woo_orden_despacho | Poblar tabla mysql orden despacho con api de woo ordenes
router.post(
  '/woo_orden_despacho',
  [body('cod_orden_despacho').trim().not().isEmpty().isLength({ min: 1 })],
  writeController.post_woo_orden_despacho
);

// POST http://localhost:3006/write/woo_orden_despacho_Sku | Poblar tabla mysql orden despachoSKU con api de woo ordenes
router.post(
  '/woo_orden_despacho_sku',
  [body('cod_orden_despacho').trim().not().isEmpty().isLength({ min: 1 })],
  writeController.post_woo_orden_despacho_sku
);

//:: :: :: :: Href test :: :: :: :: :: :: :: :: :: :: :: ::
// POST http://localhost:3006/write/href0_redirec
router.post(
  '/href0_redirec',
  [body('nombre').trim().not().isEmpty().isLength({ min: 1 })],
  writeController.post_href_0
);
// POST http://localhost:3006/write/href1_image
router.post(
  '/href1_image',
  isAuth,
  [body('os').trim().not().isEmpty().isLength({ min: 1 })],
  writeController.post_href_1
);
// POST http://localhost:3006/write/href2_supplier
router.post(
  '/href2_supplier',
  isAuth,
  [body('nombre').trim().not().isEmpty().isLength({ min: 1 })],
  writeController.post_href_2
);

// **** TailoredHome Apis *****

//Cargar foto de material y escribir en sql th_material
// POST http://localhost:3006/write/materPic | Post cargar fotos docs en Digital Ocean
router.post('/materPic', upload, writeController.materPic); //isAuth,

module.exports = router;
