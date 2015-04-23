/** @module Env Dev */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('Env Dev');

// Exported functions =========================================================

/**
 * Pre DB connection configuration of the environment.
 */
module.exports.preDBConnectionConfig = function () {

	logger.info('Configuration initialization of the dev environment');

};
/**
 * Post success DB connection configuration of the environment.
 */
module.exports.postSuccessDBConnectionConfig = function () {

	logger.info('Post success DB connection configuration of the dev environment');

};

/**
 * Post failure DB connection configuration of the environment.
 */
module.exports.postFailureDBConnectionConfig = function () {

	logger.info('Post failure DB connection configuration of the dev environment');

};