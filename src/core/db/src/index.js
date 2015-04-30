'use strict';

module.exports = function setup(options, imports, register) {
	console.log('Setting up the db core module ...');

	var db = require('./db')(options, imports);

	// Register --------------

	register(null, {

		db: {
			connect: db.connect
		}

	});

};