const Faculty = require("../models/faculty");
const Student = require("../models/student");


let Helpers = {};

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

module.exports = Helpers;