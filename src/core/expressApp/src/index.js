/** @module Express App */
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');

module.exports = function setup(options, imports, register) {
	console.log('Setting up the Express App core module ...');

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

	app.disable('x-powered-by');

	var server = require('http').Server(app);

	var start = function (port, callback) {

		var logger = imports.logger.get('Express App');

		if (_.isFunction(port)){
			callback = port;
			port = options.port;
			logger.warn('No port defined to start the app, using', port, 'by default');
		}

		server.listen(port, callback());
	};

	// Register --------------

	register(null, {

		expressApp: {
			app: app,
			server: server,
			start: start
		}

	});

};