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
		 *  Get the net worth of a specific account.
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
		getBalance: function (accountID, includeChilds, callback) {
			logger.info('Getting the net worth of a specific account');
			callback(new Error('Not yet implemented'));
			// TODO Implement the getBalance function
		}

	};

};