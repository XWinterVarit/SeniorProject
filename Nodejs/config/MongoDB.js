



const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const url = 'mongodb://mongo:27017/myproject'
let tools = {db:null, count:2}
console.log("check count : " + tools.count)

const dbName = 'myproject'

MongoClient.connect(url,
    {
        reconnectTries: 60,
        reconnectInterval: 1000
    },
    (err, client)=>{
        assert.equal(null, err)
        console.log("Connect successfully to MongoDB")

        tools.db = client.db(dbName)
        tools.count++
    })

module.exports.checkConnection = () => {
    console.log("Oh yessss")
}
module.exports.tools = tools