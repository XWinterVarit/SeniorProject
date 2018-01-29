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
    httpclient.get("http://localhost:50000", (data, response) => {
        console.log(data)
    })
}

httpshoot()
//udpshoot()