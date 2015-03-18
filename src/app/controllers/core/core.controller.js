/** @module Core controller */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('Routes');
var path = require('path');

// Exported functions =========================================================
/**
 * Send the index page of the website
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.getIndexPage = function (req, res) {

	var indexFile = path.join(global.app.paths.publicDir, './index.html');

	res.sendFile(indexFile, function (err) {

		if (err) {

			logger.error('Something went wrong while sending the index page!');

			res.status(err.status).end();

		}

	});

};