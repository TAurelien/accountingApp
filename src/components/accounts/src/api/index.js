/**
 *  @module   Accounts API
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-05-01
 *  @version  1.0.0
 */
'use strict';

// Module dependencies ========================================================
var _ = require('lodash');
var async = require('async');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('Accounts API');
	var Account = require('../model').get();

	return {

		/**
		 *  Create a new account.
		 *
		 *  @param    {Object}    account   The object representing the account to create. Must follow the model.
		 *  @param    {Function}  callback  The callback function.
		 *
		 *  @fires    Accounts#accounts.create
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-01
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		create: function (account, callback) {
			logger.info('Creating a new account');

			if (!account) {
				callback(new Error('account is not defined'));
				return;
			}

			var newAccount = new Account();
			_.merge(newAccount, account);

			newAccount.save(function (err) {
				if (err) {
					// TODO Check error type
					logger.error('Account creation failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('Account creation successful');
					callback(null);
					emitter.emitCreate();
				}
			});
		},

		/**
		 *  Get a specific account.
		 *
		 *  @param    {String}    accountID  The id of the account.
		 *  @param    {Object}    query      The query specifying the returned item.
		 *  @param    {Function}  callback   The callback function.
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-01
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		get: function (accountID, query, callback) {
			logger.info('Getting a specific account');
			Account
				.findById(accountID)
				.select(query.selection)
				.exec(function (err, account) {
					if (err) {
						// TODO Check error type
						logger.error('Getting the account', accountID, 'failed');
						logger.error(err);
						callback(err);
					} else {
						if (_.isNull(account)) {
							logger.warn('No account has been found for id', accountID);
						} else {
							logger.info('Success of getting the account', accountID);
						}
						callback(null, account);
					}
				});
		},

		/**
		 *  Get a list of accounts.
		 *
		 *  @param    {Object}    query     The query specifying the returned items.
		 *  @param    {Function}  callback  The callback function.
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-01
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		list: function (query, callback) {
			logger.info('Getting a list of accounts');
			Account
				.find(query.conditions)
				.sort(query.order)
				.select(query.selection)
				.exec(function (err, accounts) {
					if (err) {
						// TODO Check error type
						logger.error('Getting accounts failed');
						logger.error(err);
						callback(err);
					} else {
						if (_.isEmpty(accounts)) {
							logger.warn('No account has been found');
						} else {
							logger.info('Success of getting accounts');
						}
						callback(null, accounts);
					}
				});
		},

		/**
		 *  Update a specific account.
		 *
		 *  @param    {String}    accountID  The id of the account.
		 *  @param    {Object}    update     The object representing the update of the account. Must follow the model.
		 *  @param    {Function}  callback   The callback function.
		 *
		 *  @fires    Accounts#accounts.update
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-01
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		update: function (accountID, update, callback) {
			logger.info('Updating a specific account');
			Account
				.findByIdAndUpdate(accountID, update)
				.exec(function (err, updatedAccount) {
					if (err) {
						// TODO Check error type
						logger.error('Updating account', accountID, 'failed');
						logger.error(err);
						callback(err);
					} else {
						logger.info('The account', accountID, 'has been successfully updated');
						callback(null, updatedAccount);
						emitter.emitUpdate();
					}
				});
		},

		/**
		 *  Delete specific account.
		 *
		 *  @param    {Object}    query     The query to find the accounts to delete. Only the query.conditions is used and is mandatory.
		 *  @param    {Function}  callback  The callback function.
		 *
		 *  @fires    Accounts#accounts.delete
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-01
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		delete: function (query, callback) {
			logger.info('Deleting a specific account');

			if (!query.conditions) {
				callback(new Error('Conditions are not defined'));
				return;
			}

			Account
				.remove(query.conditions)
				.exec(function (err) {
					if (err) {
						// TODO Check error type
						logger.error('Account deletion failed');
						logger.error(err);
						callback(err);
					} else {
						logger.info('Account deletion successful');
						callback(null);
						emitter.emitDelete();
					}
				});
		},

		/**
		 *  Get the balance of a specific account.
		 *
		 *  @param    {String}    accountID      The id of the account.
		 *  @param    {Boolean}   includeChilds  Whether child balances are included or not. Default true.
		 *  @param    {Function}  callback       The callback function.
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-01
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		getBalanceById: function (accountID, includeChilds, callback) {
			// TODO Optimize by passing the mongoose object or an array of ids/mongoose objects
			logger.info('Getting the balance of the account', accountID);

			callback(new Error('Not yet implemented'));
			return;
			// TODO Implement the getBalanceById function

			// TODO Test function arguments

			var balance = new imports.amounts.Amount(0, 100, 'EUR');
			// TODO Deal with initialization of Amount object

			var asyncFunctions = [
				function (asyncCallback) {

					// Own transactions

					// TODO Find a way to ease the query defintion
					var query = {};
					query.conditions = {
						splits: {
							$elemMatch: {
								account: accountID
							}
						}
					};
					query.order = null;
					query.selection = null;

					var Transaction = imports.transactions.model;

					Transaction.list(query, function (err, transactions) {

						if (err) {

							logger.error('Getting the transactions of the account', accountID, 'failed');
							asyncCallback(err);

						} else if (_.isEmpty(transactions)) {

							logger.warn('No transaction has been found for the account', accountID);
							asyncCallback(null);

						} else {

							logger.info('Success of getting the transactions of the account', accountID);

							async.each(
								_.toArray(transactions),

								function (transaction, asyncCallback) {

									var transactionID = transaction._id;

									Transaction.getAmountById(transactionID, accountID, function (err, amount) {

										if (err) {

											logger.error('Getting the amount of the transaction', transactionID, 'for the account', accountID, 'failed');
											asyncCallback(err);

										} else {

											try {

												balance.add(amount);

											} catch (err) {

												logger.error('Error while adding the amount of the transaction', transactionID, 'to the balance of the account', accountID);
												asyncCallback(err);
												return;

											}
											asyncCallback(null);

										}

									});

								},

								function (err) {

									if (err) {

										logger.error('Getting the balance for the account', accountID, 'failed');
										asyncCallback(err);

									} else {

										logger.info('The balance of the account', accountID, 'has been computed successfully');
										asyncCallback(null);

									}

								}

							);

						}

					});

				},

				function (asyncCallback) {

					// Child balances

					if (includeChilds) {

						// TODO Implement Child balance computation
						asyncCallback(new Error('Getting child account balances is not yet implemented'));

					} else {

						asyncCallback(null);

					}

				}

			];

			async.parallel(asyncFunctions, function (err) {

				if (err) {

					logger.error('Computing the balance of the account', accountID, 'failed');
					callback(err);

				} else {

					logger.info('The balance of the account', accountID, 'has been computed successfully');
					callback(null, balance);

				}

			});

		}

	};

};