function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const { S3_ENDPOINT, BUCKET_NAME } = process.env;

const spacesEndpoint = new aws.Endpoint(S3_ENDPOINT);

const s3 = new aws.S3({
  endpoint: spacesEndpoint,
});

const upload = multer({
  storage: multerS3({
    s3, //Hacia donde lo va a subir
    bucket: BUCKET_NAME, //Donde lo va a subir
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, {
        fieldName: file.fieldname + '001' + '-' + Date.now(), //Asignar el nombre original del archivo
      }); 
    },
    key: (request, file, cb) => {
      console.log(file);
      cb(null, getRandomInt(1,1000)+'_'+file.originalname ); //Agregar la extension al archivo subido
    },
  }),
}).array("file"); //Es como un elementListener, "single" es para subir 1 solo archivo "array" es para multiples archivos //"upload" es el nombre la ruta donde esta el formulario 
//"file" es el nombre que le tienes que colocar al elemento input de tu formulario

module.exports = { upload, s3 };
