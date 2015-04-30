/** @module Env Dev */
'use strict';

// Module dependencies ========================================================

// Export =====================================================================

module.exports = function(appServices) {

	var logger = appServices.logger.get('Env Dev');

	return {

		/**
		 * Pre DB connection configuration of the environment.
		 */
		preDBConnectionConfig: function () {
			logger.info('Configuration initialization of the dev environment');
		},

		/**
		 * Post success DB connection configuration of the environment.
		 */
		postSuccessDBConnectionConfig: function () {
			logger.info('Post success DB connection configuration of the dev environment');
		},

		/**
		 * Post failure DB connection configuration of the environment.
		 */
		postFailureDBConnectionConfig: function () {
			logger.info('Post failure DB connection configuration of the dev environment');
		}

	};

};