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
	var crud = require('./crud')(options, imports, emitter);

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
		create: function (account, callback, lean) {
			account.balance = {
				currency: account.currency || options.defaultCurrency,
				quantity: 1,
				scale: 100,
				value: 0
			};
			crud.create(account, callback, lean);
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
		get: function (accountID, query, callback, lean) {
			crud.get(accountID, query, callback, lean);
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
		list: function (query, callback, lean) {
			crud.list(query, callback, lean);
		},

		/**
		 *  Update a specific account. Does not uppdate the balance of the account.
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
		update: function (accountID, update, callback, lean) {
			if (update.balance) {
				delete update.balance;
			}
			crud.update(accountID, update, callback, lean);
		},

		/**
		 *  Delete specific account.
		 *
		 *  @param    {Object}    id        The id of the accounts to delete.
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
		delete: function (id, callback, lean) {
			crud.delete(id, callback, lean);
		},

		// TODO Update the doc
		/**
		 *  Get the balance of a specific account.
		 *
		 *  @param    {String}    account        The id of the account.
		 *  @param    {Function}  callback       The callback function.
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-01
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		getBalance: function (account, callback) {
			var getBalance = require('./getBalance')(options, imports, emitter);
			getBalance(account, callback);
		},

		updateBalance: function (accountID, callback, lean) {
			logger.info('Updating the balance of an account');
			var getBalance = require('./getBalance')(options, imports, emitter);
			getBalance(accountID, function (err, balance) {
				if (err) {
					logger.error('Cannot get the balance of the account', accountID);
					callback(err);
				} else {
					var update = {
						balance: balance
					};
					crud.update(accountID, update, function (err, updatedItem) {
						if (err) {
							logger.error('Cannot update the balance of the account', accountID);
							callback(err);
						} else {
							logger.info('Balance of the account', accountID, 'updated successfully');
							if (lean) {
								updatedItem = updatedItem.toObject();
							}
							callback(null, updatedItem);
							emitter.emitBalanceChanged(updatedItem);
						}
					}, lean);
				}
			});
		}

	};

};