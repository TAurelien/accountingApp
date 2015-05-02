/** @module Utils */
'use strict';

module.exports = function setup(options, imports, register) {
	console.log('Setting up the Utils core module ...');

	var api = require('./api')(options, imports);

	// Register --------------

	register(null, {

		utils: api

	});

};