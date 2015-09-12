'use strict';

// Module dependencies ========================================================
var _ = require('lodash');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('Transactions API');
	var Transaction = require('../model').get();

	var create = function (transaction, callback) {
		logger.info('Creating a new transaction');

		if (!transaction) {
			callback(new Error('transaction is not defined'));
			return;
		}

		var newTransaction = new Transaction();
		_.merge(newTransaction, transaction);

		newTransaction.save(function (err) {
			if (err) {
				// TODO Check error type
				logger.error('Transaction creation failed');
				logger.error(err);
				callback(err);
			} else {
				logger.info('Transaction creation successful');
				callback(null);
				emitter.emitCreate();
			}
		});
	};

	var get = function (transactionID, query, callback) {
		logger.info('Getting a specific transaction');
		Transaction
			.findById(transactionID)
			.select(query.selection)
			.exec(function (err, transaction) {
				if (err) {
					// TODO Check error type
					logger.error('Getting the transaction', transactionID, 'failed');
					logger.error(err);
					callback(err);
				} else {
					if (_.isNull(transaction)) {
						logger.warn('No transaction has been found for id', transactionID);
					} else {
						logger.info('Success of getting the transaction', transactionID);
					}
					callback(null, transaction);
				}
			});
	};

	var list = function (query, callback) {
		logger.info('Getting a list of transactions');
		Transaction
			.find(query.conditions)
			.sort(query.order)
			.select(query.selection)
			.exec(function (err, transactions) {
				if (err) {
					// TODO Check error type
					logger.error('Getting transactions failed');
					logger.error(err);
					callback(err);
				} else {
					if (_.isEmpty(transactions)) {
						logger.warn('No transaction has been found');
					} else {
						logger.info('Success of getting transactions');
					}
					callback(null, transactions);
				}
			});
	};

	var update = function (transactionID, update, callback) {
		logger.info('Updating a specific transaction');
		Transaction
			.findByIdAndUpdate(transactionID, update)
			.exec(function (err, updatedTransaction) {
				if (err) {
					// TODO Check error type
					logger.error('Updating transaction', transactionID, 'failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('The transaction', transactionID, 'has been successfully updated');
					callback(null, updatedTransaction);
					emitter.emitUpdate();
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
			.exec(function (err) {
				if (err) {
					// TODO Check error type
					logger.error('Transaction deletion failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('Transaction deletion successful');
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
		delete: deleteTransactions
	};

};