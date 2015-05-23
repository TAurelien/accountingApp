/**
 *  @module   Account types
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
	console.log('Registering the accountTypes component module ...    [Not completely operationnal]');

	var AccountTypes = new events.EventEmitter();

	var emitter = require('./events')(options, imports, AccountTypes);

	var model = require('./model');
	model.define(options, imports, emitter);

	require('./controller')(options, imports, emitter);

	var api = require('./api')(options, imports, emitter);

	AccountTypes.model = model.get();
	AccountTypes.api = api;

	// Add the accountTypes to the global nomenclatures
	var nomenclatures = imports.nomenclatures;
	nomenclatures.addNomenclature('accountTypes', [], [], AccountTypes, 'accountTypes.update');

	var logger = imports.logger.get('Account types');

	AccountTypes.postSuccessDBConnectionConfig = function () {
		logger.info('Configuring the accountTypes module after successful db connection');

		api.getNomenclatureData(function (err, data) {
			if (err) {
				logger.error('Getting nomenclature data failed');
			} else if (_.isEmpty(data)) {
				logger.warn('No nomenclature data has been found');
			} else {
				// Update the accountTypes nomenclature
				var idArray = api.extractId(data);
				emitter.emitUpdate(data, idArray);
			}
		});

	};

	// Register --------------

	register(null, {
		accountTypes: AccountTypes
	});

};