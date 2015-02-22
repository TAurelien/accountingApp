/** @module Config */
'use strict';

var logger   = require(process.env.LOGGER)('Config');

// MODULES ====================================================================
var _        = require('lodash');
var path     = require('path');
var mongoose = require('mongoose');


// EXPORT =====================================================================

// Export objects from environment definitions --------------------------------
module.exports = _.extend(

	require('./env/all'),
	require('./env/' + process.env.NODE_ENV) || {}

);


/**
 * Run the initialization of the application, running required task for
 * the launch
 */
module.exports.init = function() {

	logger.info('Global initialization of configuration');

	process.env.UTILS     = path.join(__dirname, '/utils');

	process.env.CONSTANTS = path.join(__dirname, '/constants');

	process.env.CONFIG    = __filename;

	this.initAll();
	this.initEnv();

};


/**
 * Run the post db connection tasks
 */
module.exports.initPostDBConnection = function() {

	logger.info('Post DB connection initialization of configuration');

	this.initAllPostDBConnection();
	this.initEnvPostDBConnection();

};


/**
 * Connect to the database
 *
 *  @return  {Object}  The mongoose database
 */
module.exports.connectDB = function() {

	var dbUrl = this.db.url;

	logger.info('Connecting to db ' + dbUrl + ' ...');

	var db = mongoose.connect(dbUrl, function(err) {

		if (err) {

			logger.error('Could not connect to database : ' + dbUrl);
			logger.error( { error: err } );

		} else {

			logger.info('Successful connection to db ' + dbUrl);

		}

	});

	this.db.mongoose = db;
	return db;

};