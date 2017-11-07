const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const url = 'mongodb://mongo:27017/myproject'
let tools = {db:null, count:2};
console.log("check count : " + tools.count)
MongoClient.connect(url,
    {
            reconnectTries: 60,
            reconnectInterval: 1000
    },
    (err, database)=>{
            assert.equal(null, err)
            tools.db = database
            tools.count++
            console.log("Connect successfully to server")
    })

module.exports.checkConnection = () => {
        console.log("Oh yessss")
}
module.exports.tools = tools;