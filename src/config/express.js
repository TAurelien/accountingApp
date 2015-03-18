/** @module Express */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('Server');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// Exported functions =========================================================

/**
 *  Create and define the express application.
 *
 *  @return  {Express.App}  The express application.
 */
module.exports = function () {

	logger.info('Define the express application');

	var app = express();

	// get all data/stuff of the body (POST) parameters
	// --- parse application/json
	app.use(bodyParser.json());

	// --- parse application/vnd.api+json as json
	app.use(bodyParser.json({
		type: 'application/vnd.api+json'
	}));

	// --- parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
	app.use(methodOverride('X-HTTP-Method-Override'));

	// set the static files location
	app.use(express.static(__dirname + '../public'));

	app.disable('x-powered-by');

	// Routes -----------------------------------------------------------------
	require(path.join(global.app.paths.routesDir, './all.route'))(app, express);

	return app;

};