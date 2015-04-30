/** @module App */
'use strict';

// Module dependencies ========================================================
var path = require('path');
var architect = require('architect');

// Application definition =====================================================

console.log();
console.log('-----------------------------------------------------------');
console.log('	Configuring application ...');
console.log('-----------------------------------------------------------');
console.log();

// Initialization of the environment, if missing
var env = process.env.NODE_ENV;
if (!env) {
	env = process.env.NODE_ENV = 'production';
}

architect.loadConfig(path.resolve(__dirname, './config/moduleConfig'), function (err, architectConfig) {

	if (err) {

		console.error('The configuration of the application modules is invalid');
		throw err;

	} else {

		console.log();
		console.log('-----------------------------------------------------------');
		console.log('	Registering modules ...');
		console.log('-----------------------------------------------------------');
		console.log();

		architect.createApp(architectConfig, function(err, architectApp) {

			if (err) {

				console.error('Error while registering the application modules and creating the app');
				throw err;

			} else {

				console.log();
				console.log('-----------------------------------------------------------');
				console.log('	Modules registered');
				console.log('-----------------------------------------------------------');
				console.log();

				// Configure the application ----------------------------------
				var config = require('./config/config');
				var properties = config.properties;
				config.init(architectApp.services);

				console.log();
				console.log('-----------------------------------------------------------');
				console.log('	Application configured');
				console.log('-----------------------------------------------------------');
				console.log();

				var logger = architectApp.services.logger.get('Server');

				logger.info();
				logger.info('-----------------------------------------------------------');
				logger.info('Application loading as a "' + env + '" environment');
				logger.info('-----------------------------------------------------------');
				logger.info();


				// Start the app ----------------------------------------------
				var port = properties.server.port;
				var title = properties.app.title;
				var server = architectApp.services.expressApp;

				server.start(properties.server.port, function(){
					logger.info();
					logger.info('-----------------------------------------------------------');
					logger.info(title, 'started on port', port);
					logger.info('-----------------------------------------------------------');
					logger.info();
				});

			}

		});

	}

});










