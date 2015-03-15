/** @module Routes */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('Routes');
var path = require('path');
var onFinished = require('on-finished');

// Private functions ==========================================================

// TODO Write the documentation
/**
 * [analyzeTraffic description]
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
function analyzeTraffic(req, res, callback) {

	function analyze() {

		var method = req.method;
		var url = req.originalUrl || req.url;
		var status = res._header ? res.statusCode : '';
		var responseTime;
		if (!res._header || !req._startAt) {
			responseTime = '';
		} else {
			var diff = process.hrtime(req._startAt);
			var ms = diff[0] * 1e3 + diff[1] * 1e-6;
			responseTime = ms.toFixed(3);
		}

		var output = '\x1b[0m';

		// Set the method
		if (method && method !== '') {
			output += method;
		}

		// Set the url
		if (url && url !== '') {
			output += ' ' + url;
		}

		// Set the status
		if (status && status !== '') {
			var color = 32; // green
			if (status >= 500) color = 31; // red
			else if (status >= 400) color = 33; // yellow
			else if (status >= 300) color = 36; // cyan
			output += ' ' + '\x1b[' + color + 'm' + status + '\x1b[0m';
		}

		// Set the response time
		if (responseTime && responseTime !== '') {
			output += ' ' + responseTime;
		}

		output += '\x1b[0m';

		callback(output);

	}

	onFinished(res, analyze);

}

// Module export ==============================================================

/**
 *  Call the definition of the different routes of the express application.
 *
 *  @param   {Express.App} app      The express application.
 *  @param   {Express}     express  The express module.
 */
module.exports = function (app, express) {

	logger.info('Defining the app routes');

	app.use('*', function (req, res, next) {

		analyzeTraffic(req, res, function (result) {

			if (result && result !== '') {
				logger.info(result);
			}

		});

		next();

	});

	// API routes -------------------------------------------------------------
	require(path.join(global.app.paths.apiRoutesDir, './api.route'))(app, express);

	// CORE routes ------------------------------------------------------------
	require(path.join(global.app.paths.coreRoutesDir, './core.route'))(app, express);

};