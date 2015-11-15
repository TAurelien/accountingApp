'use strict';

// Module dependencies ========================================================
var _ = require('lodash');
var async = require('async');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('Accounts API');
	var Account = require('../model').get();
	var Amount = imports.amounts.Amount;
	var Transaction = imports.transactions.api;
	var crud = require('./crud')(options, imports, emitter);

	var checkInput = function (input) {
		var type = '';
		if (_.isArray(input)) {
			type = 'array';
		} else if (_.isString(input)) {
			type = 'id';
		} else if (input instanceof Account) {
			type = 'mongooseObject';
		} else if (_.isObject(input)) {
			type = 'query';
		}
		return type;
	};

	var getBalanceByObject = function (account, callback) {

		if (!_.isNull(account)) {
			var accountID = account.id;
			var type = account.type;
			logger.info('Getting balance by object of account', accountID);

			Transaction.getAmount(accountID, function (err, amount) {
				if (err) {
					logger.error('Getting the balance of the account', accountID, 'failed');
					callback(err);
				} else {
					if (type === 'asset' | type === 'expense') {
						amount.value = -amount.value;
					}
					callback(null, amount, accountID);
				}
			});

		} else {
			logger.error(''); // TODO Log
			callback(new Error('')); // TODO Define error
		}

	};

	var getBalanceById = function (accountID, callback) {
		logger.info('Getting balance by id of account', accountID);

		var query = {
			conditions: null,
			selection: null,
			order: null
		};
		crud.get(accountID, query, function (err, account) {
			if (err) {
				logger.error(''); // TODO Log error
				callback(err);
			} else {
				getBalanceByObject(account, callback);
			}
		});

	};

	var getBalanceByArray = function (accountArray, callback) {
		logger.info('Getting balance by array of account');

		var type;

		if (_.isEmpty(accountArray)) {
			logger.warn('The acount array is empty');
		} else {
			type = checkInput(accountArray[0]);

			if (type !== 'id' && type !== 'mongooseObject') {
				logger.error('Invalid argument, the array\'s items should be id or mongoose object');
				callback(new Error('Invalid arguments'));
				return;
			}
		}

		var balance = new Amount();
		async.each(
			accountArray,
			function (account, asyncCallback) {

				var accountCallback = function (err, accountBalance) {
					if (err) {
						logger.error(''); // TODO Log error
						asyncCallback(err);
					} else {
						try {
							balance.add(accountBalance);
						} catch (err) {
							logger.error(''); // TODO Log error
							logger.error(err);
						}
						asyncCallback(null);
					}
				};

				if (type === 'id') {
					getBalanceById(account, accountCallback);
				} else if (type === 'mongooseObject') {
					getBalanceByObject(account, accountCallback);
				} else {
					asyncCallback(null);
				}

			},
			function (err) {
				if (err) {
					logger.error(''); // TODO Log error
					callback(err);
				} else {
					callback(null, balance);
				}
			}
		);

	};

	var getBalanceByQuery = function (query, callback) {
		logger.info('Getting balance by query of account');

		crud.list(query, function (err, accounts) {
			if (err) {
				logger.error(''); // TODO Log error
				callback(err);
			} else {
				getBalanceByArray(accounts, callback);
			}
		});

	};

	var getBalance = function (account, callback) {
		logger.info('Getting balance of account');

		var type = checkInput(account);

		switch (type) {

		case 'array':
			getBalanceByArray(account, callback);
			break;
		case 'id':
			getBalanceById(account, callback);
			break;
		case 'mongooseObject':
			getBalanceByObject(account, callback);
			break;
		case 'query':
			getBalanceByQuery(account, callback);
			break;
		default:
			callback(new Error('Invalid arguments'));
			break;

		}

	};

	return getBalance;
};