'use strict';

// Module dependencies ========================================================
var _ = require('lodash');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('Transactions API');
	var Transaction = require('../model').get();

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
			if (object.splits) {
				var splits = [];
				for (var i = 0; i < object.splits.length; i++) {
					var split = object.splits[i];
					var itemSplit;
					if (split.toObject) {
						itemSplit = split.toObject();
					} else {
						itemSplit = split;
					}
					if (split.account.toString) {
						itemSplit.account = split.account.toString();
					}
					delete itemSplit._id;
					delete itemSplit.__v;
					if (split.amount) {
						if (split.amount[0].toObject) {
							itemSplit.amount = split.amount[0].toObject();
						} else {
							itemSplit.amount = split.amount[0];
						}
						delete itemSplit.amount._id;
						delete itemSplit.amount.__v;
					}
					splits.push(itemSplit);
				}
				item.splits = splits;
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
			// TODO Transform transaction
			if (object.splits) {
				for (var split in object.splits) {
					if (split.amount && !_.isArray(split.amount)) {
						split.amount = [split.amount];
					}
				}
			}
		}
		return object;
	}

	// ------------------------------------------------------------------------

	var create = function (data, callback, lean) {
		logger.info('Creating a new transaction');

		if (!data) {
			callback(new Error('transaction is not defined'));
			return;
		}

		lean = lean || false;
		data = transformObject(data);
		var transaction = new Transaction(data);
		transaction.save(function (err, createdItem) {
			if (err) {
				// TODO Check error type
				logger.error('Transaction creation failed');
				logger.error(err);
				callback(err);
			} else {
				logger.info('Transaction creation successful');
				if (lean) {
					createdItem = transformToPlainObject(createdItem);
				}
				callback(null, createdItem);
				emitter.emitCreated(createdItem);
			}
		});
	};

	var get = function (id, query, callback, lean) {
		logger.info('Getting a specific transaction');

		lean = lean || false;
		Transaction
			.findById(id)
			.select(query.selection)
			.lean(lean)
			.exec(function (err, item) {
				if (err) {
					// TODO Check error type
					logger.error('Getting the transaction', id, 'failed');
					logger.error(err);
					callback(err);
				} else {
					if (_.isNull(item)) {
						logger.warn('No transaction has been found for id', id);
					} else {
						logger.info('Success of getting the transaction', id);
					}
					if (lean) {
						item = transformToPlainObject(item);
					}
					callback(null, item);
				}
			});
	};

	var list = function (query, callback, lean) {
		logger.info('Getting a list of transactions');

		lean = lean || false;
		Transaction
			.find(query.conditions)
			.sort(query.order)
			.select(query.selection)
			.lean(lean)
			.exec(function (err, items) {
				if (err) {
					// TODO Check error type
					logger.error('Getting transactions failed');
					logger.error(err);
					callback(err);
				} else {
					if (_.isEmpty(items)) {
						logger.warn('No transaction has been found');
					} else {
						logger.info('Success of getting transactions');
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
		logger.info('Updating a specific transaction');

		lean = lean || false;
		data = transformObject(data);
		Transaction
			.findByIdAndUpdate(id, data)
			.exec(function (err, updatedItem) {
				if (err) {
					// TODO Check error type
					logger.error('Updating transaction', id, 'failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('The transaction', id, 'has been successfully updated');
					if (lean) {
						updatedItem = transformToPlainObject(updatedItem);
					}
					callback(null, updatedItem);
					emitter.emitUpdated(updatedItem);
				}
			});
	};

	var deleteTransactions = function (query, callback, lean) {
		logger.info('Deleting a specific transaction');

		if (!query.conditions) {
			callback(new Error('Conditions are not defined'));
			return;
		}

		lean = lean || false;
		Transaction
			.remove(query.conditions)
			.exec(function (err, deletedItem) {
				if (err) {
					// TODO Check error type
					logger.error('Transaction deletion failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('Transaction deletion successful');
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
		delete: deleteTransactions
	};

};