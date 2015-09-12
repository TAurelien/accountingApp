/** @module Env All */
'use strict';

// Module dependencies ========================================================
var _ = require('lodash');

// Export =====================================================================

module.exports = function (appServices) {

	var logger = appServices.logger.get('Env all');

	return {

		/**
		 * Pre DB connection configuration of the environment.
		 */
		preDBConnectionConfig: function () {
			logger.info('Configuration initialization of all environments');

			_.forEach(appServices, function (service) {
				if (service.name) {
					try {
						service.preDBConnectionConfig();
					} catch (err) {
						logger.warn('No preDBConnectionConfig for the module', service.name);
					}
				}
			});

		},

		/**
		 * Post success DB connection configuration of the environment.
		 */
		postSuccessDBConnectionConfig: function () {
			logger.info('Post success DB connection configuration of all environments');

			_.forEach(appServices, function (service) {
				if (service.name) {
					try {
						service.postSuccessDBConnectionConfig();
					} catch (err) {
						logger.warn('No postSuccessDBConnectionConfig for the module', service.name);
					}
				}
			});

		},

		/**
		 * Post failure DB connection configuration of the environment.
		 */
		postFailureDBConnectionConfig: function () {
			logger.info('Post failure DB connection configuration of all environments');


			_.forEach(appServices, function (service) {
				if (service.name) {
					try {
						service.postFailureDBConnectionConfig();
					} catch (err) {
						logger.warn('No postFailureDBConnectionConfig for the module', service.name);
					}
				}
			});

		}

	};

};