'use strict';

// Module dependencies ========================================================
var _ = require('lodash');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('Transactions API');
	var Transaction = require('../model').get();

	var create = function (data, callback) {
		logger.info('Creating a new transaction');

		if (!data) {
			callback(new Error('transaction is not defined'));
			return;
		}

		var transaction = new Transaction(data);
		transaction.save(function (err, createdItem) {
			if (err) {
				// TODO Check error type
				logger.error('Transaction creation failed');
				logger.error(err);
				callback(err);
			} else {
				logger.info('Transaction creation successful');
				callback(null, createdItem);
				emitter.emitCreated(createdItem);
			}
		});
	};

	var get = function (id, query, callback) {
		logger.info('Getting a specific transaction');
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
					callback(null, item);
				}
			});
	};

	var list = function (query, callback) {
		logger.info('Getting a list of transactions');
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
					callback(null, items);
				}
			});
	};

	var update = function (id, data, callback) {
		logger.info('Updating a specific transaction');
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
					callback(null, updatedItem);
					emitter.emitUpdated(updatedItem);
				}
			});
	};

	var deleteTransactions = function (query, callback) {
		logger.info('Deleting a specific transaction');

		if (!query.conditions) {
			callback(new Error('Conditions are not defined'));
			return;
		}

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