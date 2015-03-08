/** @module Config */
'use strict';


// Module dependencies ========================================================
var logger   = require(global.LOGGER)('Config');
var _        = require('lodash');
var path     = require('path');
var mongoose = require('mongoose');

// Get environnement definition
var allEnv     = require('./env/all');
var currentEnv = require('./env/' + process.env.NODE_ENV);

// Module export ==============================================================

// Export objects from environment definitions --------------------------------
module.exports = _.extend(

	allEnv,
	currentEnv || {}

);


// Private functions ==========================================================

/**
 * Connect to the database.
 *
 * @param  {String}   dbUrl    The database url.
 * @param  {Function} callback Callback function.
 */
function connectDB(dbUrl, callback) {

	logger.info('Connecting to db ' + dbUrl);

	mongoose.connect(dbUrl, function(err) {

		if (err) {

			logger.error('Could not connect to database : ' + dbUrl);
			logger.error( { error: err } );
			callback(err);

		} else {

			logger.info('Successful connection to db ' + dbUrl);
			callback(null);

		}

	});

}


// Exported functions =========================================================

/**
 * Run the initialization of the application, running required task for
 * the launch.
 */
module.exports.init = function() {

	logger.info('Global initialization of configuration');

	// Useful data stored in global variables ---------------------------------

	global.UTILS  = path.join(__dirname, '/utils');
	global.CONFIG = __filename;

	// Paths declaration
	global.APP_PATHS = {};
	global.APP_PATHS.public      = path.join(__dirname, '../public');
	global.APP_PATHS.coreRoutes  = path.join(__dirname, '../app/routes/api');
	global.APP_PATHS.apiRoutes   = path.join(__dirname, '../app/routes/core');
	global.APP_PATHS.models      = path.join(__dirname, '../app/controllers');
	global.APP_PATHS.controllers = path.join(__dirname, '../app/models');

	// Application environnement configuration --------------------------------

	allEnv.initAll();

	currentEnv.initEnv();

	// Database connection ----------------------------------------------------

	connectDB(this.db.url, function(err){

		if (!err) {

			// Post DB connection configuration -------------------------------

			logger.info('Post DB connection configuration');

			allEnv.initAllPostDBConnection();

			currentEnv.initEnvPostDBConnection();

			global.configDone = true;

		}

	});

};