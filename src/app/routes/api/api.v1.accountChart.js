/** @module API Routes - Account Chart*/
'use strict';

var logger = require(global.LOGGER)('Routes API Account Chart');

/**
 *  Define the Account Chart API routes.
 *  API V1
 *
 *  @param   {Router}  apiV1Router  The API v1 router of the express app
 */
module.exports = function(apiV1Router) {

	logger.info('Defining the API routes for accountChart');

	// Account chart ----------------------------------------------------------

	apiV1Router.route('/accountChart')

		.get(function(req, res, next) {
			// TODO Define the GET /accountChart
			next(new Error('GET /accountChart not yet implemented'));
		});

};