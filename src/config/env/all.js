/** @module Env All */
'use strict';


// Module dependencies ========================================================
var logger = require(global.app.logger)('Env All');


// Exported object ============================================================

/**
 *  [exports description]
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
 *  [initAll description]
 */
module.exports.initAll = function() {

	logger.info('Configuration initialization of all environments');

};


/**
 *  [initAllPostDBConnection description]
 */
module.exports.initAllPostDBConnection = function() {

	logger.info('Post-DB connection configuration initialization of all environments');

};