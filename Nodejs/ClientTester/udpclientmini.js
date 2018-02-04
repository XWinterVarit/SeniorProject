var PORT = 50000;
var HOST = '127.0.0.1';

var dgram = require('dgram');

const Client = require('node-rest-client').Client
const httpclient = new Client()
var message = new Buffer('My KungFu is Good!');
console.log("show length "+message.length)

let udpshoot = async () => {

    let client = dgram.createSocket('udp4');

    client.bind({
        address: 'localhost',
        port: 55555,
        exclusive: true
    })

    await new Promise(resolve => {
        client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
            if (err) throw err;
            console.log('UDP message sent to ' + HOST + ':' + PORT);
            resolve()
        })
    })
    client.close();

}


let httpshoot = () => {
    httpclient.get("http://localhost:50000/callSession", (data, response) => {
        console.log(data)
    })
}
let messagetest = () => {
    let args = {
        data: {
            type: "refresh",
            lists: [
                {type: "member", name: "well", persistedID: "1", positionX: 20, positionY: 20, standby: false, active: true, IP : "127.0.0.1", PORT : "50000"},
                {type: "member", name: "A", persistedID: "2", positionX: 21, positionY: 21, standby: false, active: true, IP : "127.0.0.1", PORT : "50000"},
                {type: "member", name: "B", persistedID: "3", positionX: 22, positionY: 22, standby: false, active: true, IP : "127.0.0.1", PORT : "50000"},
                {type: "object", subtype: "remote", persistedID: "10",owner_name: "cheevarit", positionX: 23, positionY: 23},
                {type: "object", subtype: "remote",persistedID: "11",owner_name: "david", positionX: 24, positionY: 24},
                {type: "object", subtype: "dummy",persistedID: "12",owner_name: "david", positionX: 25, positionY: 25},
            ]
        },
        headers: {
            "Content-Type": "application/json"
        }
    }
    console.log("calls")

    httpclient.post("http://localhost:50000/callSession", args, (data, response) => {

    })
}
messagetest()
//httpshoot()
//udpshoot()