const Faculty = require("../models/faculty");
const Student = require("../models/student");
// const Inboxes = require("../models/Inbox");
const config = require('dotenv').config().parsed;
// const config = require('../config');
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

Helpers.searchFaculty = (query) => {
    return new Promise(async (res, rej) => {
        let faculty = await Faculty.find({$or: [
            {"first_name": {"$regex": query, "$options": "i"}},
            {"last_name": {"$regex": query, "$options": "i"}},
            {"email": {"$regex": query, "$options": "i"}}
        ]});

        res(faculty);
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
    if(file[3] != 'default_profile.png'){
        s3.deleteObject(params, (err, data) => {
            if(err) { console.log(err); return {error: err} }
        })
    }
}

Helpers.findUsers = async function(users) {
    return new Promise(async (res, rej) => {
        try {
            let returnArr = [];
            for(var i = 0; i < users.length; i++) {
                let user = await Faculty.findOne({user_id: users[i]});
                if(!user) {
                    user = await Student.findOne({user_id: users[i]});
                }
                returnArr.push(user);
            }
            // console.log(returnArr);
            res(returnArr);
        } catch(e) {
            rej(e);
        }
    })
}

// Helpers.findInbox = async function(userid) {
//     return new Promise(async (res, rej) => {
//         try {
//             let inbox = await Inboxes.findOne({$or: [
//                 {user2_id: sender, user1_id: recipient},
//                 {user1_id: sender, user2_id: recipient}
//             ]});
//             if(!inbox){
//                 return null;
//             } else {
//                 return inbox;
//             }
//         } catch(e) {
//             rej(e);
//         }
//     })
// }

// Helpers.updateInboxUser = function(user, id, name, email) {
//     // user will be 1 or 2
//     let updates = {};
//     if(user == 1) {
//         updates = {
//             user1_name = name,
//             user1_email = email
//         }
//     } else {
//         updates = {
//             user2_name = name,
//             user2_email = email
//         }
//     }

//     // let inbox = await Inboxes.updateMany
// }

module.exports = Helpers;