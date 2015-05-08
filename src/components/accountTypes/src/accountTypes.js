/**
 *  @module   Account types
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 */
'use strict';

var events = require('events');

module.exports = function setup(options, imports, register) {
	console.log();
	console.log('Registering the accountTypes component module ...    [Not completely operationnal]');

	var AccountTypes = new events.EventEmitter();

	var emitter = require('./events')(options, imports, AccountTypes);

	var nomenclatures = imports.nomenclatures;

	// TODO Define the accountTypes module controller, model and api

	// Test -------------------------------------------------------------------
	var path = require('path');
	var _ = require('lodash');
	var data = require(path.join(process.cwd(), './data/development/accountTypes.json'));
	var idArray = _.map(data, function (item) {
		return item.code;
	});
	// ------------------------------------------------------------------------

	// Add the accountTypes to the global nomenclatures
	nomenclatures.addNomenclature('accountTypes', data, idArray, AccountTypes, 'accountTypes.update');

	// Register --------------

	register(null, {
		accountTypes: AccountTypes
	});

};