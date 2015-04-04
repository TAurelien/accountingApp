/** @module Account Model */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('Account Model');
var constants = require(global.app.constants);
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

							// TODO Deal with precise amount
							var amount = 0;

							_.forEach(transaction.splits, function (split) {

								if (split.account + '' === accountID + '') {
									// TODO Deal with precise amount
									var value = split.amount[0].value;
									var scaleFactor = split.amount[0].scaleFactor;
									amount += (value / scaleFactor);
								}

							});

							asyncCallback(null, amount);

						},

						function (err, transactionAmounts) {

							if (err) {

								logger.error('');
								callback(err);

							} else {

								var ownBalance = 0;

								_.forEach(transactionAmounts, function (amount) {
									// TODO Deal with precise amount
									ownBalance += amount;
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

	mongoose.model('Account').find(conditions, function (err, childs) {

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

				// TODO Deal with precise amount
				var globalChildBalance = 0;

				_(results).forEach(function (childBalance) {
					// TODO Deal with precise amount
					globalChildBalance += childBalance;
				});

				callback(err, globalChildBalance);

			}

		);

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
					logger.info('Transaction balance for ' + name + ' = ' + transactionsBalance);
					asyncCallback(err, transactionsBalance);
				});

			},

			function (asyncCallback) {

				computeChildBalance(accountID, function (err, childBbalance) {
					logger.info('Child balance for ' + name + ' = ' + childBbalance);
					asyncCallback(err, childBbalance);
				});

			}

		],

		function (err, results) {

			var globalBalance = 0;

			_.forIn(results, function (childAndOwnBalance) {
				// TODO Deal with precise amount
				globalBalance += childAndOwnBalance;
			});
			logger.info('Global balance for ' + name + ' = ' + globalBalance);

			// TODO Deal with precise amount
			callback(err, globalBalance);

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

	var accountId = this._id;

	if (this.parent) {
		mongoose.model('Account').findById(this.parent, function (err, parent) {
			if (!err && accountId && parent) {
				var newLevel = parent.level + 1;
				mongoose.model('Account').findByIdAndUpdate(accountId, {
					level: newLevel
				}, {
					new: true
				}).exec();
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