/** @module Routes */
'use strict';


// Module dependencies ========================================================
var logger = require(global.app.logger)('Routes');
var path   = require('path');


// Module export ==============================================================

/**
 *  Call the definition of the different routes of the express application.
 *
 *  @param   {app}     app      The express application
 *  @param   {express} express  The express module
 */
module.exports = function(app, express) {

	logger.info('Defining the app routes');

	// API routes -------------------------------------------------------------
	require(path.join(global.app.paths.apiRoutesDir, './api.route'))(app, express);

	// CORE routes ------------------------------------------------------------
	require(path.join(global.app.paths.coreRoutesDir, './core.route'))(app, express);

};