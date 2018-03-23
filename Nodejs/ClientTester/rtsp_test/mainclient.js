const net = require('net')
const rtsp = require('rtsp-stream')

const server = net.createServer((socket) => {
    let decoder = new rtsp.Decoder()
    let encoder = new rtsp.Encoder()

    decoder.on('request', (req) => {
        console.log(req.method, req.uri)

        // output the request body
        req.pipe(process.stdout)

        req.on('end', function () {
            // prepare a new response to the client
            var res = encoder.response()

            res.setHeader('CSeq', req.headers['cseq'])
            res.end('Hello World!')
        })
    })

    // pipe the data from the client into the decoder
    socket.pipe(decoder)

    // ...and pipe the response back to the client from the encoder
    encoder.pipe(socket)
})

server.listen(5000)