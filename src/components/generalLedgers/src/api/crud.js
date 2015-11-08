'use strict';

// Module dependencies ========================================================
var _ = require('lodash');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('General Ledgers API');
	var GeneralLedger = require('../model').get();

	// ------------------------------------------------------------------------

	function transformToPlainObject(object) {
		var item = null;
		if (object) {
			if (object.toObject) {
				item = object.toObject();
			} else {
				item = object;
			}
			item.id = object._id.toString();
			delete item._id;
			delete item.__v;
			if (object.netWorth) {
				if (object.netWorth[0].toObject) {
					item.netWorth = object.netWorth[0].toObject();
				} else {
					item.netWorth = object.netWorth[0];
				}
			}
		}
		return item;
	}

	function transformObject(item) {
		var object = null;
		if (item) {
			object = item;
			if (item.id && !item._id) {
				object._id = item.id;
				delete object.id;
			}
			if (item.netWorth && !_.isArray(item.netWorth)) {
				object.netWorth = [item.netWorth];
			}
		}
		return object;
	}

	// ------------------------------------------------------------------------

	var create = function (data, callback, lean) {
		logger.info('Creating a new general ledger');

		if (!data) {
			callback(new Error('generalLedger is not defined'));
			return;
		}

		lean = lean || false;
		data = transformObject(data);
		var generalLedger = new GeneralLedger(data);
		generalLedger.save(function (err, createdItem) {
			if (err) {
				// TODO Check error type
				logger.error('General ledger creation failed');
				logger.error(err);
				callback(err);
			} else {
				logger.info('General ledger creation successful');
				if (lean) {
					createdItem = transformToPlainObject(createdItem);
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
			.lean(lean)
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
						item = transformToPlainObject(item);
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
			.lean(lean)
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
							return transformToPlainObject(item);
						});
					}
					callback(null, items);
				}
			});
	};

	var update = function (id, data, callback, lean) {
		logger.info('Updating a specific general ledger');

		lean = lean || false;
		data = transformObject(data);
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
					if (lean) {
						updatedItem = transformToPlainObject(updatedItem);
					}
					callback(null, updatedItem);
					emitter.emitUpdated(updatedItem);
				}
			});
	};

	var deleteGeneralLedger = function (query, callback, lean) {
		logger.info('Deleting a specific general ledger');

		if (!query.conditions) {
			callback(new Error('Conditions are not defined'));
			return;
		}

		lean = lean || false;
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
					if (lean) {
						deletedItem = transformToPlainObject(deletedItem);
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