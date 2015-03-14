/** @module API Routes - General Ledger*/
'use strict';


// Module dependencies ========================================================
var logger = require(global.app.logger)('Routes API General Ledger');
var path   = require('path');
var generalLedger = require(path.join(global.app.paths.controllersDir, './generalLedgers/generalLedgers.controller'));


// Module export ==============================================================

/**
 *  Define the General Ledger API routes.
 *  API V1
 *
 *  @param   {Router}  apiV1Router  The API v1 router of the express app
 */
module.exports = function(apiV1Router) {

	logger.info('Defining the API routes for general ledger');

	// General ledger ---------------------------------------------------------

	apiV1Router.route('/generalLedgers')

		// To get a list of all general ledger
		.get(
			generalLedger.list
		)

		// To create a new general ledger
		.post(
			generalLedger.create
		);


	apiV1Router.route('/generalLedgers/:id')

		// To get a specific general ledger
		.get(
			generalLedger.get
		)

		// To update a specific general ledger
		.put(
			generalLedger.update
		)

		// To delete a specific general ledger
		.delete(
			generalLedger.delete
		);

};