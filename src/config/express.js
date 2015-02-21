/** @module Express */
'use strict';

var logger = require(process.env.LOGGER)('Server');

// MODULES ====================================================================
var express        = require('express');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var morgan         = require('morgan');
// TODO remove morgan and set a custom middleware using the logger

/**
 *  Create and define the express application.
 *
 *  @return  {app}  The express application
 */
module.exports = function() {

	logger.info('Define the express application');

	var app = express();

	// Environment dependent middleware
	if (process.env.NODE_ENV === 'development') {

		// Enable logger (morgan)
		app.use(morgan('dev'));

	} else {

		app.use(morgan('combined'));

	}

	// get all data/stuff of the body (POST) parameters
	// --- parse application/json
	app.use(bodyParser.json());

	// --- parse application/vnd.api+json as json
	app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

	// --- parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: true }));

	// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
	app.use(methodOverride('X-HTTP-Method-Override'));

	// set the static files location
	app.use(express.static(__dirname + '../public'));

	app.disable('x-powered-by');

	// ROUTES =================================================================
	require('../app/routes/routes')(app, express);

	return app;

};