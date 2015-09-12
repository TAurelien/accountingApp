'use strict';

// Module dependencies ========================================================
var _ = require('lodash');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('General Ledgers API');
	var GeneralLedger = require('../model').get();

	var create = function (generalLedger, callback) {
		logger.info('Creating a new general ledger');

		if (!generalLedger) {
			callback(new Error('generalLedger is not defined'));
			return;
		}

		var newGeneralLedger = new GeneralLedger();
		_.merge(newGeneralLedger, generalLedger);

		newGeneralLedger.save(function (err) {
			if (err) {
				// TODO Check error type
				logger.error('General ledger creation failed');
				logger.error(err);
				callback(err);
			} else {
				logger.info('General ledger creation successful');
				callback(null);
				emitter.emitCreate();
			}
		});
	};

	var get = function (generalLedgerID, query, callback) {
		logger.info('Getting a specific general ledger');
		GeneralLedger
			.findById(generalLedgerID)
			.select(query.selection)
			.exec(function (err, generalLedger) {
				if (err) {
					// TODO Check error type
					logger.error('Getting the general ledger', generalLedgerID, 'failed');
					logger.error(err);
					callback(err);
				} else {
					if (_.isNull(generalLedger)) {
						logger.warn('No general ledger has been found for id', generalLedgerID);
					} else {
						logger.info('Success of getting the general ledger', generalLedgerID);
					}
					callback(null, generalLedger);
				}
			});
	};

	var list = function (query, callback) {
		logger.info('Getting a list of general ledgers');
		GeneralLedger
			.find(query.conditions)
			.sort(query.order)
			.select(query.selection)
			.exec(function (err, generalLedgers) {
				if (err) {
					// TODO Check error type
					logger.error('Getting general ledgers failed');
					logger.error(err);
					callback(err);
				} else {
					if (_.isEmpty(generalLedgers)) {
						logger.warn('No general ledger has been found');
					} else {
						logger.info('Success of getting general ledgers');
					}
					callback(null, generalLedgers);
				}
			});
	};

	var update = function (generalLedgerID, update, callback) {
		logger.info('Updating a specific general ledger');
		GeneralLedger
			.findByIdAndUpdate(generalLedgerID, update)
			.exec(function (err, updatedGeneralLedger) {
				if (err) {
					// TODO Check error type
					logger.error('Updating general ledger', generalLedgerID, 'failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('The general ledger', generalLedgerID, 'has been successfully updated');
					callback(null, updatedGeneralLedger);
					emitter.emitUpdate();
				}
			});
	};

	var deleteGeneralLedger = function (query, callback) {
		logger.info('Deleting a specific general ledger');

		if (!query.conditions) {
			callback(new Error('Conditions are not defined'));
			return;
		}

		GeneralLedger
			.remove(query.conditions)
			.exec(function (err) {
				if (err) {
					// TODO Check error type
					logger.error('General ledger deletion failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('General ledger deletion successful');
					callback(null);
					emitter.emitDelete();
				}
			});
	};

	// ========================================================================

	return {
		create: create,
		get: get,
		list: list,
		update: update,
		delete: deleteGeneralLedger
	};

};