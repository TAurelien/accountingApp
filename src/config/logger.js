'use strict';

// MODULES =====================================================================
var winston = require('winston');


// LOGGER DEFINITION ===========================================================

// For Development environment -------------------------------------------------
var devLogger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			level: 'silly',
			colorize: true,
			timestamp: true,
			prettyPrint: true,
			depth: 0
		})
	]
});

// For Testing environment -----------------------------------------------------
var testLogger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			level: 'info',
			colorize: true,
			timestamp: false,
			prettyPrint: true,
			depth: 0
		})
	]
});

// For Production environment --------------------------------------------------
var prodLogger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			level: 'info',
			colorize: true,
			timestamp: true,
			prettyPrint: true,
			depth: 0
		})
	]
});


// EXPORT LOGGER ===============================================================
var exportedLogger;

// Choose the relevant logger according to the environment ---------------------
switch (process.env.NODE_ENV){
case 'development':
	exportedLogger = devLogger;
	break;
case 'production':
	exportedLogger = prodLogger;
	break;
case 'test':
	exportedLogger = testLogger;
	break;
default:
	exportedLogger = devLogger;
	break;
}

module.exports = exportedLogger;
