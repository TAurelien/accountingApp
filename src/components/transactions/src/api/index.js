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

	var crud = require('./crud')(options, imports, emitter);

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
		create: function (transaction, callback, lean) {
			crud.create(transaction, callback, lean);
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
		get: function (transactionID, query, callback, lean) {
			crud.get(transactionID, query, callback, lean);
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
		list: function (query, callback, lean) {
			crud.list(query, callback, lean);
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
		update: function (transactionID, update, callback, lean) {
			crud.update(transactionID, update, callback, lean);
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
		delete: function (query, callback, lean) {
			crud.delete(query, callback, lean);
		},

		// TODO Update the doc
		/**
		 *  Get the amount of a specific transaction for an account.
		 *
		 *  @param    {String}    accountID      The id of the account.
		 *  @param    {String}    transaction    The id of the transaction.
		 *  @param    {Function}  callback       The callback function.
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-03
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		getAmount: function (accountID, transaction, callback) {
			var getAmount = require('./getAmount')(options, imports, emitter);
			getAmount(accountID, transaction, callback);
		}

	};

};