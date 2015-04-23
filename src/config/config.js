/** @module Config */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('Config');
var _ = require('lodash');
var path = require('path');
var mongoose = require('mongoose');
var env = process.env.NODE_ENV;
var allEnvConfig = require('./env/all');
var currentEnvConfig = require('./env/' + env);

// Module export ==============================================================

// Export application properties ----------------------------------------------

var properties = require('../../properties/properties.json');
if (env !== 'production') {
	var envProperties = require('../../properties/' + env + '/properties.json');
	_.merge(properties, envProperties);
}
module.exports.properties = properties;

// Private functions ==========================================================

/**
 * Connect to the database.
 *
 * @param  {Object}   dbProperties The database properties.
 * @param  {Function} callback     Callback function.
 */
function connectDB(dbProperties, callback) {

	var dbUrl = dbProperties.url;

	logger.info('Connecting to db ' + dbUrl);

	mongoose.connect(dbUrl, function (err) {

		if (err) {

			logger.error('Could not connect to database : ' + dbUrl);
			logger.error(err);
			callback(err);

		} else {

			logger.info('Successful connection to db ' + dbUrl);
			callback(null);

		}

	});

}

// Exported functions =========================================================

/**
 * Run the initialization of the application, running required task for
 * the launch.
 */
module.exports.init = function () {

	logger.info('-----------------------------------------------------------');
	logger.info('ENVIRONMENT');
	logger.info('	' + env);
	logger.info();
	logger.info('APPLICATION');
	logger.info('	Title: ' + properties.app.title);
	logger.info('	Description: ' + properties.app.description);
	logger.info();
	logger.info('SERVER');
	logger.info('	Host: ' + properties.server.host);
	logger.info('	Port: ' + properties.server.port);
	logger.info();
	logger.info('DATABASE');
	logger.info('	Host: ' + properties.db.host);
	logger.info('	Port: ' + properties.db.port);
	logger.info('	Database: ' + properties.db.database);
	logger.info('	URL: ' + properties.db.url);
	logger.info('-----------------------------------------------------------');
	logger.info();

	// TODO Remove global app variables
	// Useful data stored in global variables ---------------------------------

	global.app.utils = path.join(__dirname, '/utils');
	global.app.config = __filename;
	global.app.constants = path.join(__dirname, '/constants');
	global.app.status = {};

	// Paths declaration
	global.app.paths = {};
	global.app.paths.configDir = __dirname;
	global.app.paths.pluginsDir = path.join(__dirname, '../plugins');
	global.app.paths.publicDir = path.join(__dirname, '../public');
	global.app.paths.routesDir = path.join(__dirname, '../app/routes');
	global.app.paths.coreRoutesDir = path.join(__dirname, '../app/routes/core');
	global.app.paths.apiRoutesDir = path.join(__dirname, '../app/routes/api');
	global.app.paths.modelsDir = path.join(__dirname, '../app/models');
	global.app.paths.controllersDir = path.join(__dirname, '../app/controllers');

	// Application environnement configuration --------------------------------

	allEnvConfig.preDBConnectionConfig();
	currentEnvConfig.preDBConnectionConfig();

	// Database connection ----------------------------------------------------

	connectDB(properties.db, function (err) {

		// Post DB connection configuration -------------------------------

		if (!err) {

			logger.info('Post success DB connection configuration');

			allEnvConfig.postSuccessDBConnectionConfig();
			currentEnvConfig.postSuccessDBConnectionConfig();

			// Set the status information
			global.app.status.initialConfig = 'completed';
			global.app.status.dbConnection = true;

		} else {

			logger.info('Post failure DB connection configuration');

			allEnvConfig.postFailureDBConnectionConfig();
			currentEnvConfig.postFailureDBConnectionConfig();

			// Set the status information
			global.app.status.initialConfig = 'preDBConnection';
			global.app.status.dbConnection = false;

		}

	});

};