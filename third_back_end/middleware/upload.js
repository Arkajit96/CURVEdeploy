const config = require('dotenv').config().parsed;
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const mime = require('mime-types');

aws.config.update(
    {
       secretAccessKey: config.AWS_SECRET_KEY,
       accessKeyId: config.AWS_ACCESS_KEY_ID,
       region: 'us-east-2' 
    }
);

const s3 = new aws.S3();

const imgFilter = (req, file, cb) => {
    console.log('img filter');
    console.log(file);
    console.log(req);
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(new Error('Invalid Mime Type, only JPEG and PNG'), false);
    }
  }

let imgUpload = multer({
    imgFilter,
    storage: multerS3({
        s3: s3,
        bucket: 'curve-public-bucket',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            console.log(file);
            // cb(null, Date.now().toString() + '.' + mime.extension(file.mimetype));
            cb(null, Date.now().toString() + '/' + file.originalname);
        }
    })
});

let fileUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'curve-public-bucket',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '.' + mime.extension(file.mimetype));
        }
    })
});

module.exports = {imgUpload, fileUpload};