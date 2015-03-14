/** @module API Routes - Transactions*/
'use strict';


// Module dependencies ========================================================
var logger = require(global.app.logger)('Routes API transaction');
var path = require('path');
var transactions = require(path.join(global.app.paths.controllersDir, './transactions/transactions.controller'));


// Module export ==============================================================

/**
 *  Define the Transactions API routes.
 *  API V1
 *
 *  @param   {Router}  apiV1Router  The API v1 router of the express app
 */
module.exports = function (apiV1Router) {

	logger.info('Defining the API routes for transactions');

	apiV1Router.route('/transactions')
		.get(
			transactions.list // To get a list of all transactions
		)
		.post(
			transactions.create // To create a new transaction
		);


	apiV1Router.route('/transactions/:id')
		.get(
			transactions.get // To get a specific transaction
		)
		.put(
			transactions.update // To update a specific transaction
		)
		.delete(
			transactions.delete // To delete a specific transaction
		);

};