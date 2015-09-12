'use strict';

// Module dependencies ========================================================
var _ = require('lodash');
var async = require('async');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('Transactions API');
	var Transaction = require('../model').get();
	var Amount = imports.amounts.Amount;
	var crud = require('./crud')(options, imports, emitter);

	var checkInput = function (input) {
		var type = '';
		if (_.isArray(input)) {
			type = 'array';
		} else if (_.isString(input)) {
			type = 'id';
		} else if (input instanceof Transaction) {
			type = 'mongooseObject';
		} else if (_.isObject(input)) {
			type = 'query';
		}
		logger.debug('Input of type', type);
		return type;
	};

	var getAmountByObject = function (accountID, transaction, callback) {

		if (!_.isNull(transaction)) {
			var transactionID = transaction.id;
			logger.info('Getting amount of transaction', transactionID, 'for account', accountID);

			var transactionAmount = new Amount();

			_.forEach(transaction.splits, function (split) {
				if (split.account + '' === accountID + '') {
					var splitAmount = new Amount();
					splitAmount.value = split.amount[0].value;
					splitAmount.scale = split.amount[0].scale;
					splitAmount.currency = split.currency;
					try {
						transactionAmount.add(splitAmount);
					} catch (err) {
						logger.error('Error while adding the splitAmount to transactionAmount for transaction', transactionID);
						logger.error(err);
					}
				}
			});
			logger.debug('Computed amount of transaction (' + transactionID + '):', transactionAmount);
			callback(null, transactionAmount);
		} else {
			logger.error('');
			callback(new Error(''));
		}
	};

	var getAmountById = function (accountID, transactionID, callback) {

		logger.debug('Getting amount by id(' + transactionID + ') for account', accountID);

		var query = {
			conditions: null,
			selection: null,
			order: null
		};
		crud.get(transactionID, query, function (err, transaction) {
			if (err) {
				logger.error('Error while the transaction by id (' + transactionID + ')');
				callback(err);
			} else {
				getAmountByObject(accountID, transaction, callback);
			}
		});
	};

	var getAmountByArray = function (accountID, transactionArray, callback) {

		logger.debug('Getting the amount by array for account', accountID);

		var type;

		if (_.isEmpty(transactionArray)) {
			logger.warn('The transaction array is empty for account', accountID);
		} else {
			type = checkInput(transactionArray[0]);

			if (type !== 'id' && type !== 'mongooseObject') {
				logger.debug('Invalid argument, the array\'s items should be id or mongoose object for account', accountID);
				callback(new Error('Invalid arguments'));
				return;
			}
		}

		var amount = new Amount();
		async.each(
			transactionArray,
			function (transaction, asyncCallback) {

				var transactionCallback = function (err, transactionAmount) {
					if (err) {
						logger.error(''); // TODO Log error
						asyncCallback(err);
					} else {
						try {
							amount.add(transactionAmount);
						} catch (err) {
							logger.error('Error while adding the transactionAmount to amount');
							logger.error(err);
						}
						asyncCallback(null);
					}
				};

				if (type === 'id') {
					getAmountById(accountID, transaction, transactionCallback);
				} else if (type === 'mongooseObject') {
					getAmountByObject(accountID, transaction, transactionCallback);
				} else {
					asyncCallback(null);
				}

			},
			function (err) {
				if (err) {
					logger.error('Error while getting and computing the amount of an array of transactions');
					callback(err);
				} else {
					callback(null, amount);
				}
			}
		);

	};

	var getAmountByQuery = function (accountID, query, callback) {

		logger.debug('Getting the amount by query for account', accountID);

		crud.list(query, function (err, transactions) {
			if (err) {
				logger.error('Error while listing transactions from query');
				callback(err);
			} else {
				getAmountByArray(accountID, transactions, callback);
			}
		});
	};

	var getAmount = function (accountID, transaction, callback) {

		logger.debug('Getting the amount of transaction(s) for account', accountID);

		if (_.isFunction(transaction)) {
			callback = transaction;
		}
		if (!_.isString(accountID)) {
			logger.error('Invalid arguments, accountID shall be a String representing the ID');
			callback(new Error('Invalid arguments'));
			return;
		}
		if (_.isFunction(transaction) || _.isNull(transaction)) {
			transaction = {
				conditions: {
					splits: {
						$elemMatch: {
							account: accountID
						}
					}
				}
			};
		}

		var type = checkInput(transaction);

		switch (type) {

		case 'array':
			getAmountByArray(accountID, transaction, callback);
			break;
		case 'id':
			getAmountById(accountID, transaction, callback);
			break;
		case 'mongooseObject':
			getAmountByObject(accountID, transaction, callback);
			break;
		case 'query':
			getAmountByQuery(accountID, transaction, callback);
			break;
		default:
			callback(new Error('Invalid arguments'));
			break;

		}
	};

	return getAmount;
};