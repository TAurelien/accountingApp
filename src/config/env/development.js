'use strict';

// MODULES =====================================================================
var logger = require('../logger');


// EXPORTED OBJECT =============================================================

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


// PRIVATE FUNCTIONS ===========================================================

function setupDB() {

	logger.debug('Setting up the Dev DB ...');

}


// EXPORTED FUNCTIONS ==========================================================

module.exports.initEnvPreDBConnection = function() {

	logger.debug('Pre-DB connection configuration initialization of development environment');

};

module.exports.initEnvPostDBConnection = function() {

	logger.debug('Post-DB connection configuration initialization of development environment');
	setupDB();

};