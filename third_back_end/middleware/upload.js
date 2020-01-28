let config = require('dotenv').config().parsed;
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

aws.config.update(
    {
       secretAccessKey: config.AWS_SECRET_KEY,
       accessKeyId: config.AWS_ACCESS_KEY_ID,
       region: 'us-east-2' 
    }
);

const s3 = new aws.S3();

let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'curve-public-bucket',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '.jpg')
        }
    })
});

module.exports = upload;