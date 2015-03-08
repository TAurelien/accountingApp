/** @module API Routes */
'use strict';

var logger = require(global.LOGGER)('Routes API');

/**
 *  Define the API routers of the express application.
 *  Manage the different versions of the API, if any.
 *
 *  @param   {app}     app      The express application
 *  @param   {express} express  The express module
 */
module.exports = function(app, express) {

	logger.info('Defining the API routes');

	// API V1 =================================================================
	var apiV1Router = express.Router();

	// TODO Define the authentication

	// Defining the routes
	require('./api.v1.accounts')(apiV1Router);
	require('./api.v1.accountChart')(apiV1Router);

	// Register the api v1 router ---------------------------------------------
	app.use('/api/v1', apiV1Router);

};