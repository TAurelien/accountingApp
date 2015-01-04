'use strict';

// EXPORTED OBJECT =============================================================

module.exports = {

	app: {
		title: 'Accounting app',
		description: 'Double-entry accounting application'
	},

	server: {
		port: process.env.PORT || 8080
	}

};


// PRIVATE FUNCTIONS ===========================================================



// EXPORTED FUNCTIONS ==========================================================

module.exports.initAllPreDBConnection = function() {

	console.log('Pre-DB connection configuration initialization of all environments');

};

module.exports.initAllPostDBConnection = function() {

	console.log('Post-DB connection configuration initialization of all environments');

};