/** @module Env Dev */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('Prod Dev');

// Exported functions =========================================================

/**
 * Pre DB connection configuration of the environment.
 */
module.exports.preDBConnectionConfig = function () {

	logger.info('Configuration initialization of the prod environment');

};
/**
 * Post success DB connection configuration of the environment.
 */
module.exports.postSuccessDBConnectionConfig = function () {

	logger.info('Post success DB connection configuration of the prod environment');

};

/**
 * Post failure DB connection configuration of the environment.
 */
module.exports.postFailureDBConnectionConfig = function () {

	logger.info('Post failure DB connection configuration of the prod environment');

};