/** @module Init */
'use strict';

// MODULES ====================================================================
var glob = require('glob');
var path = require('path');

/**
 * Initialization of the environment variable,
 * by default it is set to development.
 */
module.exports = function() {

	// Look for environment definition ----------------------------------------

	var env = process.env.NODE_ENV;
	var status;

	// Get the environment definition file
	var environmentFiles = glob.sync(path.resolve(__dirname, './env/' + env + '.js'));

	if (!environmentFiles.length) {
		// If no file found, either the file doesn't exist or env is undefined

		if (env) {
			status ='ENV_NotFound';
		} else {
			status ='ENV_Undefined';
		}

		// Whatever the case, set nv to development
		env = process.env.NODE_ENV = 'development';

	} else {
		// If a file has been found, env is ok

		status ='ENV_Found';
	}

	// Defining the logger after env is set -----------------------------------
	var logger = require(process.env.LOGGER)('Init');

	// Log the status
	switch (status){
	case 'ENV_NotFound':

		logger.warn('No configuration file found for "' + env + '" environment using development instead');
		break;

	case 'ENV_Undefined':

		logger.warn('NODE_ENV is not defined! Using default development environment');
		break;

	case 'ENV_Found':

		logger.info('Application loading using the "' + env + '" environment configuration');
		break;

	default:

		logger.error('Issue on initialization of environnement lookup, no status!');
		break;

	}

};