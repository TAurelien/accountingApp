'use strict';

module.exports = function setup(options, imports, register) {
	console.log();
	console.log('Registering the db core module ...');

	var db = require('./db')(options, imports);

	// Register --------------

	register(null, {

		db: {
			connect: db.connect
		}

	});

};