/** @module Account Model */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('Account Model');
var constants = require(global.app.constants);
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var path = require('path');
var Amount = require(path.join(global.app.paths.controllersDir, './amount/amount.controller'));

// Schema definition ==========================================================

/**
 * Definition of the mongoose Account schema.
 *
 * @type {Schema}
 */
var AccountSchema = new Schema({

	generalLedger: {
		type: Schema.ObjectId,
		ref: 'GeneralLedger',
		required: true
	},

	name: {
		type: String,
		trim: true,
		default: '',
		required: true
	},

	description: {
		type: String,
		trim: true,
		default: ''
	},

	type: {
		type: String,
		trim: true,
		default: '',
		required: true,
		enum: constants.accountTypeAsArray
	},

	code: {
		type: String,
		trim: true,
		default: ''
	},

	commodity: {
		type: String,
		trim: true,
		default: '',
		required: true,
		enum: constants.commoditiesAsArray
	},

	balance: {

		own: {
			type: Number,
			default: 0
		}

	},

	placeholder: {
		type: Boolean,
		default: false
	},

	closed: {
		type: Boolean,
		default: false
	},

	parent: {
		type: Schema.ObjectId,
		ref: 'Account'
	},

	level: {
		type: Number,
		default: 0,
		min: 0
	},

	meta: {
		creationDate: Date,
		creationUser: String,
		updateDate: Date,
		updateUser: String
	}

});

// Private functions ==========================================================

/**
 * Compute the balance of an account based on his transactions.
 * The balance is provided in the callback function.
 *
 * @param  {String}   accountID The id of the account to compute balance.
 * @param  {Function} callback   Callback function.
 */
function computeOwnBalance(accountID, callback) {

	logger.info('computeOwnBalance - Getting the transactions balance');

	var conditions = {};
	conditions.splits = {
		$elemMatch: {
			account: accountID
		}
	};

	mongoose.model('Transaction')
		.find(conditions)
		.exec(function (err, transactions) {

			if (err) {

				logger.error('Getting transactions failed');
				callback(err);

			} else {

				if (_.isNull(transactions)) {

					logger.warn('No transaction has been found');
					callback(null, 0);

				} else {

					logger.info('Success of getting account\'s transactions');

					var transactionsArray = [];

					_.forIn(transactions, function (child) {
						transactionsArray.push(child);
					});

					async.map(
						transactionsArray,

						function (transaction, asyncCallback) {

							var transactionAmount = Object.create(Amount);
							// TODO Deal with initialization of Amount object
							transactionAmount.init(0, 100, 'EUR');

							try {
								_.forEach(transaction.splits, function (split) {
									if (split.account + '' === accountID + '') {
										var splitAmount = Object.create(Amount);
										splitAmount.preciseValue = split.amount[0].value;
										splitAmount.scale = split.amount[0].scaleFactor;
										splitAmount.currency = split.currency;
										transactionAmount.add(splitAmount);
									}
								});
							} catch (err) {
								logger.error('There was an error getting the amount of the transaction ' + transaction._id);
								logger.error(err);
								asyncCallback(err);
								return;
							}

							asyncCallback(null, transactionAmount);

						},

						function (err, transactionAmounts) {

							if (err) {

								// TODO Log the error
								logger.error('');
								callback(err);

							} else {

								var ownBalance = Object.create(Amount);
								// TODO Deal with initialization of Amount object
								ownBalance.init(0, 100, 'EUR');

								_.forEach(transactionAmounts, function (amount) {

									try {
										ownBalance.add(amount);
									} catch (err) {
										logger.error('There was an error computing the own balance of the account ' + accountID);
										logger.error(err);
										callback(err);
										return;
									}

								});

								callback(null, ownBalance);

							}

						}

					);

				}

			}
		});

}

/**
 * Compute the global balance of all childs of the specified account.
 * A callback function is then executed with the childs' balance.
 *
 * @param  {String}   accountID The id of the account to compute balance.
 * @param  {Function} callback  Callback function.
 */
function computeChildBalance(accountID, callback) {

	logger.info('computeChildBalance - Getting the childs balance');

	var conditions = {
		parent: accountID
	};

	mongoose.model('Account')
		.find(conditions)
		.exec(function (err, childs) {

			if (err) {

				logger.error('Getting accounts failed!');
				callback(err);

			} else {

				if (_.isEmpty(childs)) {

					logger.warn('No account has been found');
					callback(null, 0);

				} else {

					var childArray = [];

					_.forIn(childs, function (child) {
						childArray.push(child);
					});

					async.map(
						childArray,

						function (child, asyncCallback) {

							child.getBalance(function (err, balance) {
								asyncCallback(err, balance);
							});

						},

						function (err, results) {

							if (err) {

								logger.error('Getting balance of child accounts failed!');
								callback(err);

							} else {

								var globalChildBalance = Object.create(Amount);
								// TODO Deal with initialization of Amount object
								globalChildBalance.init(0, 100, 'EUR');

								// TODO Is that a correct forEach implementation?
								_(results).forEach(function (childBalance) {
									globalChildBalance.add(childBalance);
								});

								callback(null, globalChildBalance);

							}

						}

					);

				}

			}

		});

}

// Schema functions ===========================================================

/**
 * Get the balance of an account by getting its childs' balance and its own transaction balance.
 *
 * @param  {Function} callback Callback function.
 */
AccountSchema.methods.getBalance = function (callback) {

	var accountID = this._id;
	var name = this.name;

	logger.info('getBalance - Computing the account balance of ' + name);

	async.parallel([

			function (asyncCallback) {

				computeOwnBalance(accountID, function (err, transactionsBalance) {

					if (err) {

						logger.error('Computing the own balance of the account failed!');
						asyncCallback(err);

					} else {

						logger.info('Transaction balance for ' + name + ' = ' + transactionsBalance);
						asyncCallback(null, transactionsBalance);

					}

				});

			},

			function (asyncCallback) {

				computeChildBalance(accountID, function (err, childBbalance) {

					if (err) {

						logger.error('Computing the child balance of the account failed!');
						asyncCallback(err);

					} else {

						logger.info('Child balance for ' + name + ' = ' + childBbalance);
						asyncCallback(null, childBbalance);

					}

				});

			}

		],

		function (err, results) {

			if (err) {

				logger.error('Getting the balance of the account failed!');
				callback(err);

			} else {

				var globalBalance = Object.create(Amount);
				// TODO Deal with initialization of Amount object
				globalBalance.init(0, 100, 'EUR');

				// TODO Is that a correct forEach implementation?
				_.forIn(results, function (childAndOwnBalance) {
					globalBalance.add(childAndOwnBalance);
				});
				logger.info('Global balance for ' + name + ' = ' + globalBalance);
				callback(null, globalBalance);

			}

		});

};

/**
 * Get the balance of an account based on its transactions.
 *
 * @param  {Function} callback Callback function.
 */
AccountSchema.methods.getOwnBalance = function (callback) {

	logger.info('getOwnBalance - Getting the transactions balance');
	computeOwnBalance(this._id, callback);

};

/**
 * Get the total balance of all childs of the account.
 *
 * @param  {Function} callback Callback function.
 */
AccountSchema.methods.getChildBalance = function (callback) {

	logger.info('getChildBalance - Getting the childs balance');
	computeChildBalance(this._id, callback);

};

// Pre processing =============================================================

AccountSchema.pre('save', function (next) {

	// meta dates management --------------------------------------------------

	var today = new Date();

	if (!this.meta.creationDate) {
		this.meta.creationDate = today;
	}

	this.meta.updateDate = today;

	// level management -------------------------------------------------------

	// TODO (2) Rework the level management while pre-saving an account

	var accountId = this._id;

	if (this.parent) {

		mongoose.model('Account')
			.findById(this.parent)
			.exec(function (err, parent) {

				if (err) {

					logger.error('Getting the parent of account while pre-saving failed!');
					logger.error(err);

				} else {

					if (accountId && parent) {

						var update = {
							level: parent.level + 1
						}
						var options = {
							new: true
						}

						mongoose.model('Account')
							.findByIdAndUpdate(accountId, update, options)
							.exec(function (err) {

								if (err) {
									logger.error('Error while updating myself!');
									logger.error(err);
								}

							});

					}

				}

			});
	}

	// ------------------------------------------------------------------------

	next();

});

// Post processing ============================================================

AccountSchema.post('save', function (account) {

	logger.info('Saved account ' + account.name + ' with _id : ' + account._id);

});

// Model export ===============================================================

module.exports = mongoose.model('Account', AccountSchema);