'use strict';

var _        = require('lodash');
var glob     = require('glob');
var mongoose = require('mongoose');


module.exports = _.extend(

	require('./env/all'),
	require('./env/' + process.env.NODE_ENV) || {}

);

module.exports.init = function() {

	console.log('Global initialization of configuration');

	this.initPreDBConnection();
	this.connectDB();
	this.initPostDBConnection();

};


module.exports.initPreDBConnection = function() {

	console.log('Pre DB connection scripts');

	this.initAllPreDBConnection();
	this.initEnvPreDBConnection();

};

module.exports.connectDB = function() {

	console.log('Connecting to db ' + this.db.url + ' ...');
	var db = mongoose.connect(this.db.url, function(err) {
		if (err) {
			console.error('\x1b[31m', 'Could not connect to database : ' + this.db.url);
			console.log(err);
		} else {
			console.log('Database connection successful');
		}
	});

	this.db.mongoose = db;

};

module.exports.initPostDBConnection = function() {

	console.log('Post db connection scripts');

	this.initAllPostDBConnection();
	this.initEnvPostDBConnection();

};

module.exports.getGlobbedFiles = function(globPatterns, removeRoot) {

	var _this = this;

	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

	var output = [];

	// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob 
	if (_.isArray(globPatterns)) {

		globPatterns.forEach(function(globPattern) {

			output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));

		});

	} else if (_.isString(globPatterns)) {

		if (urlRegex.test(globPatterns)) {

			output.push(globPatterns);

		} else {

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