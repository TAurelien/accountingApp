/** @module Env Dev */
'use strict';

var logger = require(process.env.LOGGER)('Env Dev');


// EXPORTED OBJECT ============================================================

/**
 *  [exports description]
 *
 *  @type  {Object}
 */
module.exports = {

	app: {
		title: 'Accounting app - Development environment'
	},

	server: {
		port: process.env.PORT || 8080
	},

	db : {
		url: 'mongodb://localhost/accounting_app-dev' // TODO extract url to a private file
	}

};


// PRIVATE FUNCTIONS ==========================================================

/**
 * [setupDB description]
 */
function setupDB() {

	logger.debug('Setting up the Dev DB ...');

}



// EXPORTED FUNCTIONS =========================================================

/**
 * [initEnv description]
 */
module.exports.initEnv = function() {

	logger.debug('Configuration initialization of development environment');

};


/**
 * [initEnvPostDBConnection description]
 */
module.exports.initEnvPostDBConnection = function() {

	logger.debug('Post-DB connection configuration initialization of development environment');
	setupDB();

};