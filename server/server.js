const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/main');
const router = require('./router');
const socketEvents = require('./socketEvents');

// database connection
mongoose.connect(config.database);

// start the server
const server = app.listen(config.port);
console.log('Your server is running on port ' + config.port + '.');
const io = require('socket.io').listen(server);
socketEvents(io);

// basic middleware for all Express request
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS from client-side
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.get('/', function(req, res){
    res.send('homepage');
});

router(app);