/** @module Auth */
'use strict';

module.exports = function setup(options, imports, register) {
	console.log('Setting up the Auth core module ...');

	// Register --------------

	register(null, {

		auth: {}

	});

};