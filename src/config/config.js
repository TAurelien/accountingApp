/** @module Config */
'use strict';

// Module dependencies ========================================================
var _ = require('lodash');
var env = process.env.NODE_ENV;

// Module export ==============================================================

// Export application properties ----------------------------------------------

var properties = {};
try{
	properties = require('../../properties/properties.json');
} catch (err) {
	console.error('No properties.json file found');
}

if (env !== 'production') {
	try {
		var envProperties = require('../../properties/'+ env + '/properties.json');
		_.merge(properties, envProperties);
	} catch (err) {
		console.warn('There is no properties file for the current environment');
	}
}
module.exports.properties = properties;

// Exported functions =========================================================

/**
 * Run the initialization of the application, running required task for
 * the launch.
 */
module.exports.init = function (appServices) {

	var logger = appServices.logger.get('Server');

	logger.info('-----------------------------------------------------------');
	logger.info('ENVIRONMENT');
	logger.info('	', env);
	logger.info();
	logger.info('APPLICATION');
	logger.info('	Title:', properties.app.title);
	logger.info('	Description:', properties.app.description);
	logger.info();
	logger.info('SERVER');
	logger.info('	Host:', properties.server.host);
	logger.info('	Port:', properties.server.port);
	logger.info();
	logger.info('DATABASE');
	logger.info('	Host:', properties.db.host);
	logger.info('	Port:', properties.db.port);
	logger.info('	Database:' , properties.db.database);
	logger.info('	URL:', properties.db.url);
	logger.info();
	logger.info('MODULES');
	_.forEach(appServices, function(service){
		if (service.name){
			logger.info('	', service.name);
		}
	});
	logger.info('-----------------------------------------------------------');
	logger.info();

	var allEnvConfig = null;
	var currentEnvConfig = null;
	try {
		allEnvConfig = require('./env/all')(appServices);
		currentEnvConfig = require('./env/' + env)(appServices);
	} catch (err) {
		logger.error('Environment configuration file missing !');
		logger.error(err);
	}

	// Application environnement configuration --------------------------------

	if (allEnvConfig) {
		allEnvConfig.preDBConnectionConfig();
	} else {
		logger.warn('Cannot run allEnvConfig.preDBConnectionConfig() as file is missing');
	}
	if (currentEnvConfig) {
		currentEnvConfig.preDBConnectionConfig();
	} else {
		logger.warn('Cannot run currentEnvConfig.preDBConnectionConfig() as file is missing');
	}

	// Database connection ----------------------------------------------------

	var db = appServices.db;
	var dbUrl = properties.db.url;

	db.connect(dbUrl, function (err) {

		if (err) {

			logger.info('Post failure DB connection configuration');

			if (allEnvConfig) {
				allEnvConfig.postFailureDBConnectionConfig();
			} else {
				logger.warn('Cannot run allEnvConfig.postFailureDBConnectionConfig() as file is missing');
			}
			if (currentEnvConfig) {
				currentEnvConfig.postFailureDBConnectionConfig();
			} else {
				logger.warn('Cannot run currentEnvConfig.postFailureDBConnectionConfig() as file is missing');
			}

		} else {

			logger.info('Post success DB connection configuration');

			if (allEnvConfig) {
				allEnvConfig.postSuccessDBConnectionConfig();
			} else {
				logger.warn('Cannot run allEnvConfig.postSuccessDBConnectionConfig() as file is missing');
			}
			if (currentEnvConfig) {
				currentEnvConfig.postSuccessDBConnectionConfig();
			} else {
				logger.warn('Cannot run currentEnvConfig.postSuccessDBConnectionConfig() as file is missing');
			}

		}

	});

};