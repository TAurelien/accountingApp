/** @module Env All */
'use strict';

// Module dependencies ========================================================

// Export =====================================================================

module.exports = function(appServices) {

	var logger = appServices.logger.get('Env all');

	return {

		/**
		 * Pre DB connection configuration of the environment.
		 */
		preDBConnectionConfig: function () {
			logger.info('Configuration initialization of all environments');
		},

		/**
		 * Post success DB connection configuration of the environment.
		 */
		postSuccessDBConnectionConfig: function () {
			logger.info('Post success DB connection configuration of all environments');
		},

		/**
		 * Post failure DB connection configuration of the environment.
		 */
		postFailureDBConnectionConfig: function () {
			logger.info('Post failure DB connection configuration of all environments');
		}

	};

};