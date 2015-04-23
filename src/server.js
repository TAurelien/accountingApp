/** @module Server */
'use strict';

// Module dependencies ========================================================
var path = require('path');

// Server definition ==========================================================

// TODO Remove use of global app variable
// Define a global app variable
global.app = {};
global.app.logger = path.join(__dirname, '/config/logger');

// Initialization of the environment if missing
var env = process.env.NODE_ENV;
if (!env) {
	env = process.env.NODE_ENV = 'production';
}

var logger = require(global.app.logger)('Server');
logger.info('Starting application');
logger.info();
logger.info('-----------------------------------------------------------');
logger.info('Application loading as a "' + env + '" environment');
logger.info('-----------------------------------------------------------');
logger.info();

// Configure the application --------------------------------------------------
var config = require('./config/config');
var properties = config.properties;
config.init();

// Define the express application ---------------------------------------------
var app = require('./config/express')();

// Start the app --------------------------------------------------------------
app.listen(properties.server.port);

logger.info();
logger.info('-----------------------------------------------------------');
logger.info(properties.app.title + ' started on port ' + properties.server.port);
logger.info('-----------------------------------------------------------');
logger.info();