/** @module API Routes - Accounts*/
'use strict';


// Module dependencies ========================================================
var logger = require(global.app.logger)('Routes API Account');
var path   = require('path');
var accounts = require(path.join(global.app.paths.controllersDir, './accounts/accounts.controller'));


// Module export ==============================================================

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

		// To get a list of all accounts
		.get(
			accounts.list
		)

		// To create a new account
		.post(
			accounts.create
		);


	apiV1Router.route('/accounts/:id')

		/**
		 * To get a specific account
		 */
		.get(
			accounts.get
		)

		// To update a specific account
		.put(
			accounts.update
		)

		// To delete a specific account
		.delete(
			accounts.delete
		);

	// Account chart ----------------------------------------------------------

	apiV1Router.route('/accountChart')

		.get(function(req, res, next) {
			// TODO Define the GET /accountChart
			next(new Error('GET /accountChart not yet implemented'));
		});

};