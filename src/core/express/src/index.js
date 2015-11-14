/** @module Express App */
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');

module.exports = function setup(options, imports, register) {
	console.log();
	console.log('Registering the Express core module ...');

	var logger = imports.logger.get('Express App');

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

		if (_.isFunction(port)) {
			callback = port;
			port = options.port || 8080;
			logger.warn('No port defined to start the app, using', port, 'by default');
		}

		server.listen(port, callback());
	};

	var addPublicFolder = function (path, mountPath) {
		if (mountPath) {
			app.use(mountPath, express.static(path));
		} else {
			app.use(express.static(path));
		}
	};

	var routes = [];

	var addRoute = function (route, router, order) {
		if (!order) {
			order = 0;
		}
		routes.push({
			route: route,
			router: router,
			order: order
		});
	};

	var registerRoutes = function () {
		_.map(_.sortByOrder(routes, ['order'], ['asc']), function (item) {
			app.use(item.route, item.router);
		});
	};

	// Register --------------

	register(null, {

		express: {
			addPublicFolder: addPublicFolder,
			addRoute: addRoute,
			app: app,
			express: express,
			server: server,
			start: start,
			postSuccessDBConnectionConfig: registerRoutes,
			postFailureDBConnectionConfig: registerRoutes
		}

	});

};