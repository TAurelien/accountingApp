/** @module Server */
'use strict';

var path = require('path');

// Define the logger path in gobal variable
process.env.LOGGER = path.join(__dirname, '/config/logger');


// Initialization of the environment
require('./config/init')();


// Get the logger
var logger = require(process.env.LOGGER)('Server');


// Configure the application
var config = require('./config/config');
config.init();

// Connect to the database
var db = config.connectDB();

// Configure the application, post db connection
db.connection.on('open', function() {
	config.initPostDBConnection();
});


// Define the express application
var app = require('./config/express')();


// Start the app
app.listen(config.server.port);
logger.info(config.app.title + ' started on port ' + config.server.port);