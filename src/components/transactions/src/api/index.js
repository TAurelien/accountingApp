/**
 *  @module   Transactions API
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 */
'use strict';

// Module dependencies ========================================================
var _ = require('lodash');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('Transactions API');
	var Transaction = require('../model').get();

	return {

		/**
		 *  Create a new transaction.
		 *
		 *  @param    {Object}    transaction   The object representing the transaction to create. Must follow the model.
		 *  @param    {Function}  callback      The callback function.
		 *
		 *  @fires    Transactions#transactions.create
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-02
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		create: function (transaction, callback) {
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
		},

		/**
		 *  Get a specific transaction.
		 *
		 *  @param    {String}    transactionID  The id of the transaction.
		 *  @param    {Object}    query          The query specifying the returned item.
		 *  @param    {Function}  callback       The callback function.
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-02
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		get: function (transactionID, query, callback) {
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
		},

		/**
		 *  Get a list of transactions.
		 *
		 *  @param    {Object}    query     The query specifying the returned items.
		 *  @param    {Function}  callback  The callback function.
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-02
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		list: function (query, callback) {
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
		},

		/**
		 *  Update a specific transaction.
		 *
		 *  @param    {String}    transactionID  The id of the transaction.
		 *  @param    {Object}    update         The object representing the update of the transaction. Must follow the model.
		 *  @param    {Function}  callback       The callback function.
		 *
		 *  @fires    Transactions#transactions.update
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-02
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		update: function (transactionID, update, callback) {
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
		},

		/**
		 *  Delete specific transaction.
		 *
		 *  @param    {Object}    query     The query to find the transactions to delete. Only the query.conditions is used and is mandatory.
		 *  @param    {Function}  callback  The callback function.
		 *
		 *  @fires    Transactions#transactions.delete
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-02
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		delete: function (query, callback) {
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
		},

		/**
		 *  Get the amount of a specific transaction for an account.
		 *
		 *  @param    {String}    transactionID  The id of the transaction.
		 *  @param    {String}    accountID      The id of the account.
		 *  @param    {Function}  callback       The callback function.
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-03
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		getAmountById: function (transactionID, accountID, callback) {
			// TODO Optimize by passing the mongoose object or an array of ids/mongoose objects
			logger.info('Getting the amount of a specific transaction for an account');
			callback(new Error('Not yet implemented'));
			// TODO Implement the getAmount function

			// TODO Test function arguments

			//var amount = new imports.amounts.Amount(0, 100, 'EUR');
		}

	};

};