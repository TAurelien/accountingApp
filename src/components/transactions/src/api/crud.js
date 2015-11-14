'use strict';

// Module dependencies ========================================================
var _ = require('lodash');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('Transactions API');
	var Transaction = require('../model').get();

	// ------------------------------------------------------------------------

	function transformObject(item) {
		var object = null;
		if (item) {
			object = item;
			if (item.id && !item._id) {
				object._id = item.id;
				delete object.id;
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
		Transaction.create(data, function (err, createdItem) {
			if (err) {
				// TODO Check error type
				logger.error('Transaction creation failed');
				logger.error(err);
				callback(err);
			} else {
				logger.info('Transaction creation successful');
				if (lean) {
					createdItem = createdItem.toObject();
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
						item = item.toObject();
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
							return item.toObject();
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
			.findByIdAndUpdate(id, data, {
				new: true
			})
			.exec(function (err, updatedItem) {
				if (err) {
					// TODO Check error type
					logger.error('Updating transaction', id, 'failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('The transaction', id, 'has been successfully updated');
					if (lean) {
						updatedItem = updatedItem.toObject();
					}
					callback(null, updatedItem);
					emitter.emitUpdated(updatedItem);
				}
			});
	};

	var deleteTransactions = function (id, callback, lean) {
		logger.info('Deleting a specific transaction');

		if (!id) {
			callback(new Error('Id is not defined'));
			return;
		}

		lean = lean || false;
		Transaction
			.findByIdAndRemove(id)
			.exec(function (err, deletedItem) {
				if (err) {
					// TODO Check error type
					logger.error('Transaction deletion failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('Transaction deletion successful');
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
		delete: deleteTransactions
	};

};