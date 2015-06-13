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
		create: function (account, callback) {
			crud.create(account, callback);
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
			crud.get(accountID, query, callback);
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
			crud.list(query, callback);
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
			crud.update(accountID, update, callback);
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
			crud.delete(query, callback);
		},

		// TODO Update the doc
		/**
		 *  Get the balance of a specific account.
		 *
		 *  @param    {String}    account        The id of the account.
		 *  @param    {Boolean}   includeChilds  Whether child balances are included or not. Default false.
		 *  @param    {Function}  callback       The callback function.
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-01
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		getBalance: function (account, includeChilds, callback) {
			var getBalance = require('./getBalance')(options, imports, emitter);
			getBalance(account, includeChilds, callback);
		}

	};

};