/** @module Env All */
'use strict';

var logger = require(process.env.LOGGER)('Env All');


// EXPORTED OBJECT ============================================================

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


// PRIVATE FUNCTIONS ==========================================================



// EXPORTED FUNCTIONS =========================================================

/**
 *  [initAll description]
 */
module.exports.initAll = function() {

	logger.debug('Configuration initialization of all environments');

};


/**
 *  [initAllPostDBConnection description]
 */
module.exports.initAllPostDBConnection = function() {

	logger.debug('Post-DB connection configuration initialization of all environments');

};