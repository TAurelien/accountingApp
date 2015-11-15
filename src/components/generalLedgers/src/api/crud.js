'use strict';

// Module dependencies ========================================================
var _ = require('lodash');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('General Ledgers API');
	var GeneralLedger = require('../model').get();

	// ------------------------------------------------------------------------

	var create = function (data, callback, lean) {
		logger.info('Creating a new general ledger');

		if (!data) {
			callback(new Error('generalLedger is not defined'));
			return;
		}

		lean = lean || false;
		GeneralLedger.create(data, function (err, createdItem) {
			if (err) {
				// TODO Check error type
				logger.error('General ledger creation failed');
				logger.error(err);
				callback(err);
			} else {
				logger.info('General ledger creation successful');
				if (lean) {
					createdItem = createdItem.toObject();
				}
				callback(null, createdItem);
				emitter.emitCreated(createdItem);
			}
		});
	};

	var get = function (id, query, callback, lean) {
		logger.info('Getting a specific general ledger');

		lean = lean || false;
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
					if (lean) {
						item = item.toObject();
					}
					callback(null, item);
				}
			});
	};

	var list = function (query, callback, lean) {
		logger.info('Getting a list of general ledgers');

		lean = lean || false;
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
					if (lean) {
						items = items.map(function (item) {
							return item.toObject();
						});
					}
					callback(null, items);
				}
			});
	};

	var update = function (id, data, callback, lean) {
		logger.info('Updating a specific general ledger');

		lean = lean || false;
		GeneralLedger
			.findByIdAndUpdate(id, data, {
				new: true
			})
			.exec(function (err, updatedItem) {
				if (err) {
					// TODO Check error type
					logger.error('Updating general ledger', id, 'failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('The general ledger', id, 'has been successfully updated');
					if (lean) {
						updatedItem = updatedItem.toObject();
					}
					callback(null, updatedItem);
					emitter.emitUpdated(updatedItem);
				}
			});
	};

	var deleteGeneralLedger = function (id, callback, lean) {
		logger.info('Deleting a specific general ledger');

		if (!id) {
			callback(new Error('Id is not defined'));
			return;
		}

		lean = lean || false;
		GeneralLedger
			.findByIdAndRemove(id)
			.exec(function (err, deletedItem) {
				if (err) {
					// TODO Check error type
					logger.error('General ledger deletion failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('General ledger deletion successful');
					if (lean) {
						deletedItem = deletedItem.toObject();
					}
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