/**
 * @module REST API
 */
'use strict';

var _ = require("lodash");

module.exports = function setup(options, imports, register) {
	console.log();
	console.log('Registering the REST API core module ...');

	var logger = imports.logger.get('REST API');

	var server = imports.express;
	var express = server.express;

	var apiRouter = express.Router();

	apiRouter.use(function (req, res, next) {
		// TODO Deal with authentication
		next();
	});

	var sendResponse = function (res, status, success, message, data) {
		res.status(status).json({
			success: success,
			message: message,
			data: data
		});
	};

	var addRoute = function (route, callback) {
		if (!_.startsWith(route, '/')) {
			route = '/' + route;
		}
		var newRoute = apiRouter.route(route);
		callback(newRoute);
	};

	var registerAPIRoutes = function () {
		logger.info('Registering REST API routes');
		server.addRoute('/api', apiRouter);
	};

	// Register --------------

	register(null, {

		restApi: {
			addRoute: addRoute,
			sendResponse: sendResponse,
			preDBConnectionConfig: registerAPIRoutes
		}

	});
};