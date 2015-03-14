/** @module API Routes - Transactions*/
'use strict';


// Module dependencies ========================================================
var logger       = require(global.app.logger)('Routes API transaction');
var path         = require('path');
var transactions = require(path.join(global.app.paths.controllersDir, './transactions/transactions.controller'));


// Module export ==============================================================

/**
 *  Define the Transactions API routes.
 *  API V1
 *
 *  @param   {Router}  apiV1Router  The API v1 router of the express app
 */
module.exports = function(apiV1Router) {

	logger.info('Defining the API routes for transactions');

	apiV1Router.route('/transactions')

		// To get a list of all transactions
		.get(
			transactions.list
		)

		// To create a new transaction
		.post(
			transactions.create
		);


	apiV1Router.route('/transactions/:id')

		// To get a specific transaction
		.get(
			transactions.get
		)

		// To update a specific transaction
		.put(
			transactions.update
		)

		// To delete a specific transaction
		.delete(
			transactions.delete
		);

};