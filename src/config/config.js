'use strict';

// MODULES =====================================================================
var logger   = require('./logger');
var _        = require('lodash');
var glob     = require('glob');
var mongoose = require('mongoose');


// EXPORT ======================================================================

// Export objects from environment definitions ---------------------------------
module.exports = _.extend(

	require('./env/all'),
	require('./env/' + process.env.NODE_ENV) || {}

);


module.exports.init = function() {

	logger.debug('Global initialization of configuration');

	this.initPreDBConnection();
	this.connectDB();
	this.initPostDBConnection();

};


module.exports.initPreDBConnection = function() {

	logger.debug('Pre DB connection scripts');

	this.initAllPreDBConnection();
	this.initEnvPreDBConnection();

};

module.exports.connectDB = function() {

	var dbUrl = this.db.url;

	logger.debug('Connecting to db ' + dbUrl + ' ...');
	var db = mongoose.connect(dbUrl, function(err) {
		if (err) {
			logger.error('Could not connect to database : ' + dbUrl);
			logger.error( { error: err } );
		} else {
			logger.info('Successful connection to db ' + dbUrl);
		}
	});

	this.db.mongoose = db;

};

module.exports.initPostDBConnection = function() {

	logger.debug('Post db connection scripts');

	this.initAllPostDBConnection();
	this.initEnvPostDBConnection();

};


module.exports.searchFiles = function(globPatterns, removeRoot) {

	var _this = this;

	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

	var output = [];

	// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob 
	if (_.isArray(globPatterns)) {

		globPatterns.forEach(function(globPattern) {

			output = _.union(output, _this.searchFiles(globPattern, removeRoot));

		});

	} else if (_.isString(globPatterns)) {

		if (urlRegex.test(globPatterns)) {

			output.push(globPatterns);

		} else {

			// TODO Change to the sync function of glob
			glob(globPatterns, {
				sync: true
			}, function(err, files) {
				if (removeRoot) {
					files = files.map(function(file) {
						return file.replace(removeRoot, '');
					});
				}

				output = _.union(output, files);

			});

		}

	}

	return output;

};