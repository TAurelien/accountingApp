/** @module API Routes - Accounts*/
'use strict';

var logger = require(global.LOGGER)('Routes API Account');

/**
 *  Define the Accounts API routes.
 *  API V1
 *
 *  @param   {Router}  apiV1Router  The API v1 router of the express app
 */
module.exports = function(apiV1Router) {

	logger.info('Defining the API routes for accounts');

	// Accounts ---------------------------------------------------------------

	apiV1Router.route('/accounts')

		.get(function(req, res, next) {
			// TODO Define the GET /accounts
			next(new Error('GET /accounts not yet implemented'));
		})

		.post(function(req, res, next) {
			// TODO Define the POST /accounts
			next(new Error('POST /accounts not yet implemented'));
		});


	apiV1Router.route('/accounts/:id')

		.get(function(req, res, next) {
			// TODO Define the GET /accounts/:id
			next(new Error('GET /accounts/:id not yet implemented'));
		})

		.put(function(req, res, next) {
			// TODO Define the POST /accounts/:id
			next(new Error('POST /accounts/:id not yet implemented'));
		})

		.delete(function(req, res, next) {
			// TODO Define the DELETE /accounts/:id
			next(new Error('DELETE /accounts/:id not yet implemented'));
		});


};