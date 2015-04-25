/** @module Env All */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('Env All');

// Exported functions =========================================================

/**
 * Pre DB connection initialization of the environment.
 */
module.exports.preDBConnectionConfig = function () {

	logger.info('Configuration initialization of all environments');

};

/**
 * Post success DB connection configuration of the environment.
 */
module.exports.postSuccessDBConnectionConfig = function () {

	logger.info('Post success DB connection configuration of all environments');

};

/**
 * Post failure DB connection configuration of the environment.
 */
module.exports.postFailureDBConnectionConfig = function () {

	logger.info('Post failure DB connection configuration of all environments');

};