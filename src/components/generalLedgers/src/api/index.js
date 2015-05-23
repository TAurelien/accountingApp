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
	var GeneralLedger = require('../model').get();

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
		create: function (generalLedger, callback) {
			logger.info('Creating a new general ledger');

			if (!generalLedger) {
				callback(new Error('generalLedger is not defined'));
				return;
			}

			var newGeneralLedger = new GeneralLedger();
			_.merge(newGeneralLedger, generalLedger);

			newGeneralLedger.save(function (err) {
				if (err) {
					// TODO Check error type
					logger.error('General ledger creation failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('General ledger creation successful');
					callback(null);
					emitter.emitCreate();
				}
			});
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
		get: function (generalLedgerID, query, callback) {
			logger.info('Getting a specific general ledger');
			GeneralLedger
				.findById(generalLedgerID)
				.select(query.selection)
				.exec(function (err, generalLedger) {
					if (err) {
						// TODO Check error type
						logger.error('Getting the general ledger', generalLedgerID, 'failed');
						logger.error(err);
						callback(err);
					} else {
						if (_.isNull(generalLedger)) {
							logger.warn('No general ledger has been found for id', generalLedgerID);
						} else {
							logger.info('Success of getting the general ledger', generalLedgerID);
						}
						callback(null, generalLedger);
					}
				});
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
		list: function (query, callback) {
			logger.info('Getting a list of general ledgers');
			GeneralLedger
				.find(query.conditions)
				.sort(query.order)
				.select(query.selection)
				.exec(function (err, generalLedgers) {
					if (err) {
						// TODO Check error type
						logger.error('Getting general ledgers failed');
						logger.error(err);
						callback(err);
					} else {
						if (_.isEmpty(generalLedgers)) {
							logger.warn('No general ledger has been found');
						} else {
							logger.info('Success of getting general ledgers');
						}
						callback(null, generalLedgers);
					}
				});
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
		update: function (generalLedgerID, update, callback) {
			logger.info('Updating a specific general ledger');
			GeneralLedger
				.findByIdAndUpdate(generalLedgerID, update)
				.exec(function (err, updatedGeneralLedger) {
					if (err) {
						// TODO Check error type
						logger.error('Updating general ledger', generalLedgerID, 'failed');
						logger.error(err);
						callback(err);
					} else {
						logger.info('The general ledger', generalLedgerID, 'has been successfully updated');
						callback(null, updatedGeneralLedger);
						emitter.emitUpdate();
					}
				});
		},

		/**
		 *  Delete specific general ledger.
		 *
		 *  @param    {Object}    query     The query to find the general ledgers to delete. Only the query.conditions is used and is mandatory.
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
		delete: function (query, callback) {
			logger.info('Deleting a specific general ledger');

			if (!query.conditions) {
				callback(new Error('Conditions are not defined'));
				return;
			}

			GeneralLedger
				.remove(query.conditions)
				.exec(function (err) {
					if (err) {
						// TODO Check error type
						logger.error('General ledger deletion failed');
						logger.error(err);
						callback(err);
					} else {
						logger.info('General ledger deletion successful');
						callback(null);
						emitter.emitDelete();
					}
				});
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
		getNetWorth: function (generalLedgerID, callback) {
			// TODO Optimize by passing the mongoose object or an array of ids/mongoose objects
			logger.info('Getting the net worth of the general ledger', generalLedgerID);

			callback(new Error('Not yet implemented'));
			return;
			// TODO Implement the getNetWorth function

			// TODO Test function arguments

			var netWorth = new imports.amounts.Amount(0, 100, 'EUR');
			// TODO Deal with initialization of Amount object

			// TODO Find a way to ease the query defintion
			var query = {};
			query.conditions = {
				generalLedger: generalLedgerID,
				$or: [{
					type: 'asset'
				}, {
					type: 'liability'
				}]
			};
			query.order = null;
			query.selection = {
				type: 1
			};

			var Account = imports.accounts.model;

			Account.list(query, function (err, accounts) {

				if (err) {

					logger.error('Getting the accounts of the general ledger', generalLedgerID, 'failed');
					callback(err);

				} else if (_.isEmpty(accounts)) {

					logger.info('No account found for the general ledger', generalLedgerID);
					callback({
						message: 'No accounts found for this general ledger'
					});

				} else {

					logger.info('Success of getting the accounts of the general ledger', generalLedgerID);

					async.each(
						_.toArray(accounts),

						function (account, asyncCallback) {

							var accountID = account._id;
							var type = account.type;

							Account.getBalanceById(accountID, false, function (err, balance) {

								if (err) {

									logger.error('Computing the balance of', accountID, 'failed');
									asyncCallback(err);

								} else {

									try {

										if (type === 'asset') {
											netWorth.add(balance);
										} else if (type === 'liability') {
											netWorth.subtract(balance);
										}
										asyncCallback(null);

									} catch (err) {

										logger.error('There was an error while adding the balance of the account', accountID, 'to the net worth of the general ledger', generalLedgerID);
										asyncCallback(err);

									}

								}

							});

						},

						function (err) {

							if (err) {

								logger.error('Computing the net worth of the general ledger', generalLedgerID, 'failed');
								callback(err);

							} else {

								logger.info('The net worth of the general ledger', generalLedgerID, 'has been computed successfully');
								callback(null, netWorth);

							}

						});
				}

			});
		}

	};

};