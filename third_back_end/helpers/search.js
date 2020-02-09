const rp = require('request-promise');

const addIndex = function(student) {

    const options = {
        method: 'POST',
        uri: 'https://search-test-elastic-search-e77a5xnchhx46blzmdi24suite.us-east-2.es.amazonaws.com/students/_doc',
        body: JSON.stringify({
            name: student.first_name + ' ' + student.last_name,
            interests: student.interests,
            major: student.major,
            minor: student.minor
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return rp(options);
}

module.exports = {addIndex}