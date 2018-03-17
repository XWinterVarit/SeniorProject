const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const junior = require('./routes/junior');
const cors = require('cors')
const app = express();


const mongodb = require('./config/MongoDB')
const redis = require('./config/Redis')


app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/junior', junior);

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

let PORT = 3001;
const HOST = '127.0.0.1'

const dgram = require('dgram')

const server = dgram.createSocket('udp4')
console.log("Server start listen udp on port " + PORT)
server.on ('message', (message, remote) => {
    console.log(remote.address + ':' + remote.port +' - ');
})
server.bind(PORT, HOST)




module.exports = app;
