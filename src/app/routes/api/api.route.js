/** @module API Routes */
'use strict';


// Module dependencies ========================================================
var logger = require(global.app.logger)('Routes API');


// Module export ==============================================================

/**
 *  Define the API routers of the express application.
 *  Manage the different versions of the API, if any.
 *
 *  @param   {app}     app      The express application
 *  @param   {express} express  The express module
 */
module.exports = function (app, express) {

	logger.info('Defining the API routes');

	// API V1 =================================================================
	var apiV1Router = express.Router();

	// TODO Define the authentication

	// TODO add a middleware logging the traffic on api routes

	// Defining the routes
	require('./api.v1.generalLedgers.route')(apiV1Router);
	require('./api.v1.accounts.route')(apiV1Router);
	require('./api.v1.transactions.route')(apiV1Router);

	// Register the api v1 router ---------------------------------------------
	app.use('/api/v1', apiV1Router);

};