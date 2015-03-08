/** @module Server */
'use strict';

var path = require('path');

// Define the logger path in gobal variable
global.LOGGER = path.join(__dirname, '/config/logger');


// Initialization of the environment
require('./config/init')();


// Get the logger
var logger = require(global.LOGGER)('Server');


// Configure the application
var config = require('./config/config');
config.init();


// Define the express application
var app = require('./config/express')();


// Start the app
app.listen(config.server.port);
logger.info(config.app.title + ' started on port ' + config.server.port);