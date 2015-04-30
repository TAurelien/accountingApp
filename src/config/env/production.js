/** @module Env Prod */
'use strict';

// Module dependencies ========================================================

// Export =====================================================================

module.exports = function(appServices) {

	var logger = appServices.logger.get('Env Prod');

	return {

		/**
		 * Pre DB connection configuration of the environment.
		 */
		preDBConnectionConfig: function () {
			logger.info('Configuration initialization of the prod environment');
		},

		/**
		 * Post success DB connection configuration of the environment.
		 */
		postSuccessDBConnectionConfig: function () {
			logger.info('Post success DB connection configuration of the prod environment');
		},

		/**
		 * Post failure DB connection configuration of the environment.
		 */
		postFailureDBConnectionConfig: function () {
			logger.info('Post failure DB connection configuration of the prod environment');
		}

	};

};