'use strict';

// EXPORTED OBJECT =============================================================

module.exports = {

	app: {
		title: 'Accounting app - Development environment'
	},

	server: {
		port: process.env.PORT || 8080
	},

	db : {
		url: 'mongodb://localhost/accounting_app-dev'
	}

};


// PRIVATE FUNCTIONS ===========================================================

function setupDB() {

	console.log('Setting up the Dev DB ...');

}


// EXPORTED FUNCTIONS ==========================================================

module.exports.initEnvPreDBConnection = function() {

	console.log('Pre-DB connection configuration initialization of development environment');

};

module.exports.initEnvPostDBConnection = function() {

	console.log('Post-DB connection configuration initialization of development environment');
	setupDB();

};