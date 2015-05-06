/** @module Module Config */
'use strict';

// Module dependencies ========================================================
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

// Properties =================================================================

// Get the properties defined at app level (global)
var config = require('./config');
var globalProperties = config.properties;

// Secure the options and plugins properties
if (!globalProperties.options) {
	globalProperties.options = {};
}
if (!globalProperties.plugins) {
	globalProperties.plugins = {
		paths: []
	};
}

// Private functions ==========================================================

/**
 * Get all directories of a specified path
 *
 * @param  {String} srcPath the path of the directory to look inside.
 *
 * @return {Array}          An array of all directory names within the specified path.
 */
function getDirectories(srcPath) {
	srcPath = path.resolve(process.cwd(), srcPath);
	try {
		return fs.readdirSync(srcPath).filter(function (file) {
			return fs.statSync(path.join(srcPath, file)).isDirectory();
		});
	} catch (err) {
		console.error('The path "' + srcPath + '" does not exist but is specified in properties.');
		return [];
	}
}

/**
 * Get the options of the module from the properties files and set them in the module definition.
 *
 * @param {String} modulePath       The directory path of the module.
 * @param {Object} moduleDefinition The module definition object to set the options in.
 */
function setModuleOptions(modulePath, moduleDefinition) {
	var moduleName = null;

	// Get the name of the module from the package.json
	try {
		var pkg = require(path.join(modulePath, './package.json'));
		moduleName = pkg.name;
	} catch (err) {
		console.error('No package.json found in', modulePath);
		console.error(err);
		return;
	}

	// Get the options from the properties defined at module level (local)
	try {
		var moduleProperties = require(path.join(modulePath, './properties.json'));
		_.merge(moduleDefinition, moduleProperties.options);
	} catch (err) {
		console.warn('No options for', moduleName, 'in the local module properties');
	}

	// Get the options from the properties defined at app level (global), overwriting the local ones
	// The name of the module (from the package.json of the module) must be used to set the options in the global properties
	try {
		_.merge(moduleDefinition, globalProperties.options[moduleName]);
	} catch (err) {
		console.warn('No options for', moduleName, 'in the global app properties');
	}
}

/**
 * Build the definition of a module from its directory.
 * A object representing the modume definition will be returned containing at least the packagePath property.
 *
 * @param  {String} modulePath The absolute directory path of the module to deal with.
 *
 * @return {Object}            The object representing the module definition.
 */
function getModuleDefinition(modulePath) {
	var moduleDefinition = {};
	moduleDefinition.packagePath = modulePath;
	setModuleOptions(modulePath, moduleDefinition);
	return moduleDefinition;
}

/**
 * Build the array of module definitions.
 *
 * @return {Array} An array of all module definitions.
 */
function setAppModules() {

	// Array of directories modules belong to
	var moduleDirs = [];

	// Array of all module definitions
	var appModules = [];

	// The core and components directories of the app
	moduleDirs.push('./bin/core');
	moduleDirs.push('./bin/components');

	// The plugins directories are defined in properties
	var pluginPaths = globalProperties.plugins.paths;
	if (_.isArray(pluginPaths)) {
		moduleDirs = _.union(moduleDirs, globalProperties.plugins.paths);
	} else if (_.isString(pluginPaths)) {
		moduleDirs.push(pluginPaths);
	}

	// Dive into all directories to find modules, get the definition and push to the appModules array
	_.forEach(moduleDirs, function (moduleDirPath) {
		_.forEach(getDirectories(moduleDirPath), function (modulePath) {
			appModules.push(getModuleDefinition(path.resolve(moduleDirPath, modulePath)));
		});
	});

	return appModules;
}

var appModules = setAppModules();

// Module export ==============================================================

module.exports = appModules;