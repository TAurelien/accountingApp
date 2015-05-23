/**
 *  @module   Currencies
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 */
'use strict';

var _ = require('lodash');
var events = require('events');

module.exports = function setup(options, imports, register) {
	console.log();
	console.log('Registering the currencies component module ...      [Not completely operationnal]');

	var Currencies = new events.EventEmitter();

	var emitter = require('./events')(options, imports, Currencies);

	var model = require('./model');
	model.define(options, imports, emitter);

	require('./controller')(options, imports, emitter);

	var api = require('./api')(options, imports, emitter);

	Currencies.model = model.get();
	Currencies.api = api;

	// Add the currencies to the global nomenclatures
	var nomenclatures = imports.nomenclatures;
	nomenclatures.addNomenclature('currencies', [], [], Currencies, 'currencies.update');

	var logger = imports.logger.get('Currencies');

	Currencies.postSuccessDBConnectionConfig = function () {
		logger.info('Configuring the currencies module after successful db connection');

		api.getNomenclatureData(function (err, data) {
			if (err) {
				logger.error('Getting nomenclature data failed');
			} else if (_.isEmpty(data)) {
				logger.warn('No nomenclature data has been found');
			} else {
				// Update the currencies nomenclature
				var idArray = api.extractId(data);
				emitter.emitUpdate(data, idArray);
			}
		});

	};

	// Register --------------

	register(null, {
		currencies: Currencies
	});

};