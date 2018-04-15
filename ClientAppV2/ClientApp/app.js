var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var users = require('./routes/users');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/*
app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
*/

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(logger('dev')); // move to this for disable log

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});

const fs = require('fs')
let fsport = fs.readFileSync('./PORT_SET.txt')
console.log("UDP PORT read from file : " + fsport)

let PORT = 50000;
const HOST = '127.0.0.1'

if (fsport) {
    if (fsport !== "") {
        PORT = Number(fsport)
    }
}

const dgram = require('dgram')
const globalConfigs = require('./config/GlobalConfigs')
const messagesController = require(globalConfigs.mpath1.messagesController)

const server = dgram.createSocket('udp4')
console.log("start listen udp on port " + PORT)
let count = 0
server.on ('message', (message, remote) => {
    count++
    if (count <= 2) {
        console.log(remote.address + ':' + remote.port +' - ');
        messagesController.messagesGlobalMethods.udpInput(message)
    }
})
server.bind(PORT, HOST)



const socketIO = require('./config/socketIOConfig')(String(Number(PORT)+10000))




module.exports = app;
