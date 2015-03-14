/** @module Utils */
'use strict';


// Module dependencies ========================================================
var logger   = require(global.app.logger)('Utils');
var _        = require('lodash');
var glob     = require('glob');


// Exported functions =========================================================

/**
 * Get filenames according to an input pattern
 *
 * @param   {String}  globPatterns  Pattern to be matched
 * @param   {String}  removeRoot    String to remove from the filenames
 *
 * @return  {Array}                 Array of all found filenames
 */
module.exports.getFiles = function(globPatterns, removeRoot) {

	logger.info('Getting files for pattern: ' + globPatterns);

	var _this = this;

	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

	var output = [];

	// If glob pattern is array so we use each pattern in a recursive way,
	// otherwise we use glob 
	if (_.isArray(globPatterns)) {

		globPatterns.forEach(function(globPattern) {

			output = _.union(output, _this.searchFiles(globPattern, removeRoot));

		});

	} else if (_.isString(globPatterns)) {

		if (urlRegex.test(globPatterns)) {

			output.push(globPatterns);

		} else {

			var files = glob.sync(globPatterns);

			if (removeRoot) {
				files = files.map(function(file) {
					return file.replace(removeRoot, '');
				});
			}

			output = _.union(output, files);

		}

	}

	return output;

};