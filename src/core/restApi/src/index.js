/**
 * @module REST API
 */
'use strict';

module.exports = function setup(options, imports, register) {
	console.log();
	console.log('Registering the REST API core module ...');

	var logger = imports.logger.get('REST API');

	var app = imports.express.app;
	var express = imports.express.express;

	var apiRouter = express.Router();

	apiRouter.use(function (req, res, next) {
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
		logger.debug('Defining a new route for', route);
		// TODO Deal with missing /
		var newRoute = apiRouter.route(route);
		callback(newRoute);
	};

	var registerAPIRoutes = function () {
		logger.info('Registering REST API routes');
		app.use('/api', apiRouter);
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