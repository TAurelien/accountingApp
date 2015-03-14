/** @module Server */
'use strict';

var path = require('path');

// Define a global app variable
global.app = {};

// Define the logger path in gobal variable
global.app.logger = path.join(__dirname, '/config/logger');


// Initialization of the environment
require('./config/init')();


// Get the logger
var logger = require(global.app.logger)('Server');


// Configure the application
var config = require('./config/config');
config.init();


// Define the express application
var app = require('./config/express')();


// Start the app
app.listen(config.server.port);
logger.info(config.app.title + ' started on port ' + config.server.port);