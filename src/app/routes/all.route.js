/** @module Routes */
'use strict';

var logger = require(global.LOGGER)('Routes');

/**
 *  Call the definition of the different routes of the express application.
 *
 *  @param   {app}     app      The express application
 *  @param   {express} express  The express module
 */
module.exports = function(app, express) {

	logger.info('Defining the app routes');

	// API ROUTES -------------------------------------------------------------
	require('./api/api.route')(app, express);

	// CORE ROUTES ------------------------------------------------------------
	require('./core/core.route')(app);

};