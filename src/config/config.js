/** @module Config */
'use strict';


// Module dependencies ========================================================
var logger   = require(global.app.logger)('Config');
var _        = require('lodash');
var path     = require('path');
var mongoose = require('mongoose');


// Module export ==============================================================

// Export objects from environment definitions --------------------------------
var envDef = _.extend(

	require('./env/all'),
	require('./env/' + process.env.NODE_ENV) || {}

);

module.exports = envDef;


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
			logger.error(err);
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

	global.app.utils     = path.join(__dirname, '/utils');
	global.app.config    = __filename;
	global.app.constants = path.join(__dirname, '/constants');
	global.app.status    = {};

	// Paths declaration
	global.app.paths = {};
	global.app.paths.configDir    = __dirname;
	global.app.paths.pluginsDir   = path.join(__dirname, '../plugins');
	global.app.paths.publicDir    = path.join(__dirname, '../public');
	global.app.paths.routesDir    = path.join(__dirname, '../app/routes');
	global.app.paths.coreRoutesDir= path.join(__dirname, '../app/routes/core');
	global.app.paths.apiRoutesDir = path.join(__dirname, '../app/routes/api');
	global.app.paths.modelsDir    = path.join(__dirname, '../app/models');
	global.app.paths.controllersDir= path.join(__dirname, '../app/controllers');

	// Application environnement configuration --------------------------------

	envDef.initAll();

	envDef.initEnv();

	// Database connection ----------------------------------------------------


	connectDB(envDef.db.url, function(err){

			// Post DB connection configuration -------------------------------

		if (!err) {

			logger.info('Post DB connection configuration after success');

			envDef.initAllPostDBConnection();

			envDef.initEnvPostDBConnection();

			// Set the status information
			global.app.status.initialConfig = 'completed';
			global.app.status.dbConnection  = true;

		} else {

			logger.info('Post DB connection configuration after failure');

			// Set the status information
			global.app.status.initialConfig = 'preDBConnection';
			global.app.status.dbConnection  = false;

		}

	});

};