/** @module Core Routes  */
'use strict';

var logger = require(global.LOGGER)('Routes Core');

var path = require('path');

/**
 *  Define the core routes of the app.
 *
 *  @param   {app}     app      The express application
 */
module.exports = function(app){
	//  routes to handle all front-end requests

	logger.info('Defining the core routes');

	// TODO add a middleware logging the traffic on core routes

	app.get('*', function(req, res) {
		// load our public/index.html file, the front-end will handle
		// the routing from index.html
		
		var indexFile = path.join(__dirname + '/../../../public/index.html');

		res.sendFile(indexFile);

	});

};