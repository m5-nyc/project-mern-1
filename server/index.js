const express = require('express');
const app = express();
const logger = require('morgan');
const config = require('./config/main');

// start the server
const server = app.listen(config.port);
console.log('Your server is running on port ' + config.port + '.');

// basic middleware for all Express request
app.use(logger('dev'));

// Enable CORS from client-side
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

