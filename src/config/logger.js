/** @module logger.js */
'use strict';

// MODULES ====================================================================
var winston = require('winston');

/**
 * Define and return the relevant logger 
 *
 * @param   {String}  label  The label to be used in the logger, usually the
 *                           name of the module.
 *
 * @return  {Logger}         The relevant logger according to the environment.
 */
module.exports = function(label) {

	// Choose the relevant logger according to the environment ----------------
	switch (process.env.NODE_ENV){

	case 'development': // ----------------------------------------------------

		return new (winston.Logger)({
			transports: [
				new (winston.transports.Console)({
					level: 'silly',
					colorize: true,
					timestamp: true,
					label : label,
					prettyPrint: true,
					depth: 0
				})
			]
		});

	case 'production': // -----------------------------------------------------

		return new (winston.Logger)({
			transports: [
				new (winston.transports.Console)({
					level: 'info',
					colorize: true,
					timestamp: true,
					label : label,
					prettyPrint: true,
					depth: 0
				})
			]
		});

	case 'test': // -----------------------------------------------------------

		return new (winston.Logger)({
			transports: [
				new (winston.transports.Console)({
					level: 'info',
					colorize: true,
					timestamp: false,
					label : label,
					prettyPrint: true,
					depth: 0
				})
			]
		});

	default: // ---------------------------------------------------------------

		return new (winston.Logger)({
			transports: [
				new (winston.transports.Console)({
					level: 'silly',
					colorize: true,
					timestamp: true,
					label : label,
					prettyPrint: true,
					depth: 0
				})
			]
		});

	}

};