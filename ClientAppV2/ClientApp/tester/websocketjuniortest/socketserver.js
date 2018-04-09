const CircularJSON = require('circular-json')
/*
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
*/
var io = require('socket.io')(40000);
var chat = io
    .of('/chat')
    .on('connection',  (socket) => {
        console.log("peer connect to chat ")
        console.log(CircularJSON.stringify(socket, null, 4))
        socket.on('disconnect', () => {
            console.log("user disconnect")
        })
    })



let intervalSent = () => {
    setInterval(
        () => {
            chat.emit('rum_channal', {
                name: 'david',
                age: 20
            })
        },2000
    )
}
intervalSent()