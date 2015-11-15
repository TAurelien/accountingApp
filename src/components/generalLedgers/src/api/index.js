/**
 *  @module   General ledgers API
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

	var logger = imports.logger.get('General Ledgers API');
	var crud = require('./crud')(options, imports, emitter);

	return {

		/**
		 *  Create a new general ledger.
		 *
		 *  @param    {Object}    generalLedger  The object representing the general ledger to create. Must follow the model.
		 *  @param    {Function}  callback       The callback function.
		 *
		 *  @fires    GeneralLedgers#generalLedgers.create
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-01
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		create: function (generalLedger, callback, lean) {
			generalLedger.netWorth = {
				currency: generalLedger.settings.defaultCurrency || options.defaultCurrency,
				quantity: 1,
				scale: 100,
				value: 0
			};
			crud.create(generalLedger, callback, lean);
		},

		/**
		 *  Get a specific general ledger.
		 *
		 *  @param    {String}    generalLedgerID  The id of the general ledger.
		 *  @param    {Object}    query            The query specifying the returned item.
		 *  @param    {Function}  callback         The callback function.
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-01
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		get: function (generalLedgerID, query, callback, lean) {
			crud.get(generalLedgerID, query, callback, lean);
		},

		/**
		 *  Get a list of general ledgers.
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
		 *  Update a specific general ledger.
		 *
		 *  @param    {String}    generalLedgerID  The id of the general ledger.
		 *  @param    {Object}    update           The object representing the update of the general ledger. Must follow the model.
		 *  @param    {Function}  callback         The callback function.
		 *
		 *  @fires    GeneralLedgers#generalLedgers.update
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-01
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		update: function (generalLedgerID, update, callback, lean) {
			if (update.netWorth) {
				delete update.netWorth;
			}
			crud.update(generalLedgerID, update, callback, lean);
		},

		/**
		 *  Delete specific general ledger.
		 *
		 *  @param    {Object}    id        The id of the general ledgers to delete.
		 *  @param    {Function}  callback  The callback function.
		 *
		 *  @fires    GeneralLedgers#generalLedgers.delete
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

		/**
		 *  Get the net worth of a specific general ledger.
		 *
		 *  @param    {String}    generalLedgerID  The id of the general ledger.
		 *  @param    {Function}  callback         The callback function.
		 *
		 *  @access   public
		 *  @author   TAurelien
		 *  @date     2015-05-01
		 *  @version  1.0.0
		 *  @since    1.0.0
		 */
		getNetWorth: function (generalLedger, callback) {
			var getNetWorth = require('./getNetWorth')(options, imports, emitter);
			getNetWorth(generalLedger, callback);
		},

		updateNetWorth: function (generalLedgerID, callback, lean) {
			logger.info('Updating the net worth of a general ledger');
			var getNetWorth = require('./getNetWorth')(options, imports, emitter);
			getNetWorth(generalLedgerID, function (err, netWorth) {
				if (err) {
					logger.error('Cannot get the net worth of the general ledger', generalLedgerID);
					callback(err);
				} else {
					var update = {
						netWorth: netWorth
					};
					crud.update(generalLedgerID, update, function (err, updatedItem) {
						if (err) {
							logger.error('Cannot update the net worth of the general ledger', generalLedgerID);
							callback(err);
						} else {
							logger.info('Net worth of the general ledger', generalLedgerID, 'updated successfully');
							if (lean) {
								updatedItem = updatedItem.toObject();
							}
							callback(null, updatedItem);
							emitter.emitNetWorthChanged(updatedItem);
						}
					}, lean);
				}
			});
		}

	};

};