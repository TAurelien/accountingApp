'use strict';

module.exports = function setup(options, imports, register) {
	console.log('Setting up the logger core module ...');

	// Register --------------

	register(null, {

		logger: {
			get: function (label) {
				return require('./logger')(label);
			}
		}

	});

};