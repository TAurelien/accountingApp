'use strict';

// MODULES =====================================================================
var glob = require('glob');
var path = require('path');


module.exports = function() {

	// Look for environment definition -----------------------------------------

	var env = process.env.NODE_ENV;
	var status;

	var environmentFiles = glob.sync(path.resolve(__dirname, './env/' + env + '.js'));

	if (!environmentFiles.length) {

		if (env) {
			status ='ENV_NotFound';
		} else {
			status ='ENV_Undefined';
		}

		env = process.env.NODE_ENV = 'development';

	} else {
		status ='ENV_Found';
	}

	var logger = require('./logger');

	switch (status){
	case 'ENV_NotFound':

		logger.warn('No configuration file found for "' + env + '" environment using development instead');
		break;

	case 'ENV_Undefined':

		logger.warn('NODE_ENV is not defined! Using default development environment');
		break;

	case 'ENV_Found':

		logger.info('Application loaded using the "' + env + '" environment configuration');
		break;

	default:

		logger.error('Issue on initialization of environnement lookup, no status!');
		break;

	}

};