/** @module Core Routes  */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('Routes Core');
var path = require('path');
var core = require(path.join(global.app.paths.controllersDir, './core/core.controller'));

// Module export ==============================================================

/**
 *  Define the core routes of the app.
 *
 *  @param   {Express.App} app      The express application.
 */
module.exports = function (app) {
	//  routes to handle all front-end requests

	logger.info('Defining the core routes');

	app.use('*', function (req, res, next) {

		logger.info('Core route requested');

		next();

	});

	app.route('*')
		.get(
			core.getIndexPage // load our public/index.html file, the front-end will handle the routing from index.html
		);

};