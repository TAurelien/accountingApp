'use strict';

// Module dependencies ========================================================
var _ = require('lodash');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('General Ledgers API');
	var GeneralLedger = require('../model').get();

	var create = function (data, callback) {
		logger.info('Creating a new general ledger');

		if (!data) {
			callback(new Error('generalLedger is not defined'));
			return;
		}

		var generalLedger = new GeneralLedger(data);
		generalLedger.save(function (err, createdItem) {
			if (err) {
				// TODO Check error type
				logger.error('General ledger creation failed');
				logger.error(err);
				callback(err);
			} else {
				logger.info('General ledger creation successful');
				callback(null, createdItem);
				emitter.emitCreated(createdItem);
			}
		});
	};

	var get = function (id, query, callback) {
		logger.info('Getting a specific general ledger');
		GeneralLedger
			.findById(id)
			.select(query.selection)
			.exec(function (err, item) {
				if (err) {
					// TODO Check error type
					logger.error('Getting the general ledger', id, 'failed');
					logger.error(err);
					callback(err);
				} else {
					if (_.isNull(item)) {
						logger.warn('No general ledger has been found for id', id);
					} else {
						logger.info('Success of getting the general ledger', id);
					}
					callback(null, item);
				}
			});
	};

	var list = function (query, callback) {
		logger.info('Getting a list of general ledgers');
		GeneralLedger
			.find(query.conditions)
			.sort(query.order)
			.select(query.selection)
			.exec(function (err, items) {
				if (err) {
					// TODO Check error type
					logger.error('Getting general ledgers failed');
					logger.error(err);
					callback(err);
				} else {
					if (_.isEmpty(items)) {
						logger.warn('No general ledger has been found');
					} else {
						logger.info('Success of getting general ledgers');
					}
					callback(null, items);
				}
			});
	};

	var update = function (id, data, callback) {
		logger.info('Updating a specific general ledger');
		GeneralLedger
			.findByIdAndUpdate(id, data)
			.exec(function (err, updatedItem) {
				if (err) {
					// TODO Check error type
					logger.error('Updating general ledger', id, 'failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('The general ledger', id, 'has been successfully updated');
					callback(null, updatedItem);
					emitter.emitUpdated(updatedItem);
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
			.exec(function (err, deletedItem) {
				if (err) {
					// TODO Check error type
					logger.error('General ledger deletion failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('General ledger deletion successful');
					callback(null, deletedItem);
					emitter.emitDeleted(deletedItem);
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