/**
 *  @module   Currencies
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
	console.log('Registering the currencies component module ...      [Not completely operationnal]');

	var Currencies = new events.EventEmitter();

	var emitter = require('./events')(options, imports, Currencies);

	var nomenclatures = imports.nomenclatures;

	// TODO Define the currencies module controller, model and api

	// Test -------------------------------------------------------------------
	var path = require('path');
	var _ = require('lodash');
	var data = require(path.join(process.cwd(), './data/development/currencies.json'));
	var idArray = _.map(data, function (item) {
		return item.code;
	});
	// ------------------------------------------------------------------------

	// Add the currencies to the global nomenclatures
	nomenclatures.addNomenclature('currencies', data, idArray, Currencies, 'currencies.update');

	// Register --------------

	register(null, {
		currencies: Currencies
	});

};