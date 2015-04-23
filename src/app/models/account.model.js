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

	currency: {
		type: String,
		trim: true,
		default: '',
		required: true,
		enum: constants.currenciesAsArray
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
function computeOwnBalance(accountID, nameRef, callback) {

	// Check arguments
	if ((_.isNull(callback) || !_.isFunction(callback)) && _.isFunction(nameRef)) {
		callback = nameRef;
	}

	if (!_.isString(nameRef)) {
		nameRef = accountID;
	}

	logger.info('computeOwnBalance - Getting the transactions balance of the account ' + nameRef);

	var ownBalance = Object.create(Amount);
	ownBalance.init(0, 100, 'EUR');
	// TODO Deal with initialization of Amount object

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

				logger.error('Getting the transactions of the account ' + nameRef + ' failed');
				callback(err);

			} else if (_.isEmpty(transactions)) {

				logger.warn('No transaction has been found for the account ' +
					nameRef);
				callback(null, ownBalance);

			} else {

				logger.info('Success of getting the transactions of the account ' + nameRef);

				async.each(
					_.toArray(transactions),

					function (transaction, asyncCallback) {

						var transactionID = transaction._id;

						try {

							_.forEach(transaction.splits, function (split) {
								if (split.account + '' === accountID + '') {

									var splitAmount = Object.create(Amount);
									splitAmount.preciseValue = split.amount[0].value;
									splitAmount.scale = split.amount[0].scaleFactor;
									splitAmount.currency = split.currency;

									ownBalance.add(splitAmount);

								}
							});

						} catch (err) {

							logger.error('There was an error while adding the amount of the transaction ' + transactionID + ' to the balance of the account ' + nameRef);
							asyncCallback(err);
							return;

						}

						asyncCallback(null);

					},

					function (err) {

						if (err) {

							logger.error('Getting the own balance for the account ' + nameRef + ' failed!');
							callback(err);

						} else {

							logger.info('Own balance for the account ' + nameRef + ' = ' + ownBalance);
							callback(null, ownBalance);

						}

					}

				);

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
function computeChildBalance(accountID, nameRef, callback) {

	// Check arguments
	if ((_.isNull(callback) || !_.isFunction(callback)) && _.isFunction(nameRef)) {
		callback = nameRef;
	}

	if (!_.isString(nameRef)) {
		nameRef = accountID;
	}

	logger.info('computeChildBalance - Getting the childs balance of the account ' + nameRef);

	var globalChildBalance = Object.create(Amount);
	globalChildBalance.init(0, 100, 'EUR');
	// TODO Deal with initialization of Amount object

	var conditions = {
		parent: accountID
	};

	mongoose.model('Account')
		.find(conditions)
		.exec(function (err, childs) {

			if (err) {

				logger.error('Getting the child accounts of the account ' + nameRef + ' failed!');
				callback(err);

			} else if (_.isEmpty(childs)) {

				logger.warn('No child account has been found for the account ' + nameRef);
				callback(null, globalChildBalance);

			} else {

				logger.info('Success of getting the child accounts of the account ' + nameRef);

				async.each(
					_.toArray(childs),

					function (child, asyncCallback) {

						var childID = child._id;
						var childName = child.name;
						var childNameRef = childName + ' (' + childID + ')';

						child.getBalance(function (err, childBalance) {

							if (err) {

								logger.error('Computing the balance of the child account ' + childNameRef + ' of ' + nameRef + ' failed!');
								asyncCallback(err);

							} else {

								logger.info('The balance for the child account ' + childNameRef + ' of ' + nameRef + ' = ' + childBalance);

								try {

									globalChildBalance.add(childBalance);

								} catch (err) {

									logger.error('There was an error while adding the balance of the child account ' + childNameRef + ' of ' + nameRef + ' to its global child balance');
									asyncCallback(err);
									return;

								}

								asyncCallback(null);

							}

						});

					},

					function (err) {

						if (err) {

							logger.error('Getting the global child balance for the account ' + nameRef + ' failed!');
							callback(err);

						} else {

							logger.info('Global child balance for the account ' + nameRef + ' = ' + globalChildBalance);
							callback(null, globalChildBalance);

						}

					}

				);

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
	var nameRef = name + ' (' + accountID + ')';

	logger.info('getBalance - Computing the balance of the account ' + nameRef);

	var globalBalance = Object.create(Amount);
	globalBalance.init(0, 100, 'EUR');
	// TODO Deal with initialization of Amount object

	async.parallel([

			function (asyncCallback) {

				computeOwnBalance(accountID, nameRef, function (err, ownBalance) {

					if (err) {

						logger.error('Computing the transaction balance of the account ' + nameRef + ' failed!');
						asyncCallback(err);

					} else {

						logger.info('Transaction balance for the account ' + nameRef + ' = ' + ownBalance);

						try {

							globalBalance.add(ownBalance);

						} catch (err) {

							logger.error('There was an error while adding the transaction balance of the account ' + nameRef + ' to its global balance');
							asyncCallback(err);
							return;

						}

						asyncCallback(null);

					}

				});

			},

			function (asyncCallback) {

				computeChildBalance(accountID, nameRef, function (err, childBalance) {

					if (err) {

						logger.error('Computing the child balance of the account ' + nameRef + ' failed!');
						asyncCallback(err);

					} else {

						logger.info('Child balance for the account ' + nameRef + ' = ' + childBalance);

						try {

							globalBalance.add(childBalance);

						} catch (err) {

							logger.error('There was an error while adding the own balance of the account ' + nameRef + ' to its global balance');
							asyncCallback(err);
							return;

						}

						asyncCallback(null);

					}

				});

			}

		],

		function (err) {

			if (err) {

				logger.error('Computing the balance of the account ' + nameRef + ' failed!');
				callback(err);

			} else {

				logger.info('Global balance for the account ' + nameRef + ' = ' + globalBalance);
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

	var accountID = this._id;
	var name = this.name;
	var nameRef = name + ' (' + accountID + ')';

	logger.info('getOwnBalance - Getting the transactions balance of the account ' + nameRef);
	computeOwnBalance(accountID, nameRef, callback);

};

/**
 * Get the total balance of all childs of the account.
 *
 * @param  {Function} callback Callback function.
 */
AccountSchema.methods.getChildBalance = function (callback) {

	var accountID = this._id;
	var name = this.name;
	var nameRef = name + ' (' + accountID + ')';

	logger.info('getChildBalance - Getting the childs balance of the account ' + nameRef);
	computeChildBalance(accountID, nameRef, callback);

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
						};
						var options = {
							new: true
						};

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