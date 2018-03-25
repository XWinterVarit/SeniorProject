const CircularJSON = require('circular-json')
/*
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
*/
var io = require('socket.io')(3000);
var chat = io
    .of('/chat')
    .on('connection', function (socket) {
        console.log("peer connect to chat ")
        console.log(CircularJSON.stringify(socket, null, 4))
        socket.emit('a message', {
            that: 'only'
            , '/chat': 'will get'
        });
        chat.emit('a message', {
            everyone: 'in'
            , '/chat': 'will get'
        });
    })
    .on('disconnection', () => {
        console.log("peer disconnection to chat")
    })

var news = io
    .of('/news')
    .on('connection', function (socket) {
        console.log("peers connect to news")
        socket.emit('item', { news: 'item' });
    })
    .on('disconnection', () => {
        console.log("peer disconnection to chat")
    })