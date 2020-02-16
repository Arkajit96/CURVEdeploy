const Faculty = require("../models/faculty");
const Student = require("../models/student");
const config = require('dotenv').config().parsed;
const aws = require('aws-sdk')
const search = require('./search').addIndex;

aws.config.update(
    {
       secretAccessKey: config.AWS_SECRET_KEY,
       accessKeyId: config.AWS_ACCESS_KEY_ID,
       region: 'us-east-2' 
    }
);

const s3 = new aws.S3();


let Helpers = {};

Helpers.esSearch = search;

Helpers.SearchHelper = (queryArr, query) => {
    return new Promise( async (res, rej) => {
        let names = [];
        try{
            if(queryArr[1]) {
                names = await Faculty.find(
                    {
                    "first_name": {"$regex": `${queryArr[0]}`, "$options": "i"},
                    "last_name": {"$regex": `${queryArr[queryArr.length-1]}`, "$options": "i"}
                    }, (err, docs) => {
                    //   console.log(docs);
                    }
                );
            } else {
                names = await Faculty.find(
                    {$or:[
                        {"first_name": {"$regex": `${queryArr[0]}`, "$options": "i"}},
                        {"last_name": {"$regex": `${queryArr[0]}`, "$options": "i"}}
                    ]}
                );
            }
        
            let departments = await Faculty.find({"department": {"$regex": `${query}`, "$options": "i"}});
        
            let interests = await Faculty.find({interests: {"$regex": `${query}`, "$options": "i"}});

            res({"names": names, "departments": departments, "interests": interests});
        } catch(e) {
            console.log(e);
            rej(e);
        }
    })
}

Helpers.deleteS3 = (file) => {
    console.log(file);
    file = file.split('/');
    console.log(file);
    const params = {
        Bucket: 'curve-public-bucket',
        Key: file[3]
    }
    s3.deleteObject(params, (err, data) => {
        if(err) { console.log(err); return {error: err} }
    })
}

module.exports = Helpers;