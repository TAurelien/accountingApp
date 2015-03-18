/** @module Env All */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('Env All');

// Exported object ============================================================

/**
 *  Export the application main information whatever the environment.
 *
 *  @type  {Object}
 */
module.exports = {

	app: {
		title: 'Accounting app',
		description: 'Double-entry accounting application'
	},

	server: {
		port: process.env.PORT || 8081
	}

};

// Exported functions =========================================================

/**
 * Pre DB connection initialization of the environment.
 */
module.exports.initAll = function () {

	logger.info('Configuration initialization of all environments');

};

/**
 * Post DB connection initialization of the environment.
 */
module.exports.initAllPostDBConnection = function () {

	logger.info('Post-DB connection configuration initialization of all environments');

};