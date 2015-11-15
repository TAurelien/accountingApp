'use strict';

var _ = require('lodash');
var async = require('async');

module.exports = function (options, imports, api) {

	var logger = imports.logger.get('Accounts ctrl - Events');
	var Transactions = imports.transactions;

	var delay = options.updateDelay || 50;

	var updateBalance = _.wrap(
		_.memoize(
			function () {
				return _.debounce(function (accountID, callback) {
					api.updateBalance(accountID, function (err) {
						if (err) {
							logger.error('The update of the balance of the account (' + accountID + ') impacted by the transaction has failed');
						} else {
							logger.info('The balance of the account (' + accountID + ') impacted by the transaction has been successfully updated');
						}
						callback(err);
					});
				}, delay);
			}
		),
		function (func, accountID, callback) {
			return func(accountID)(accountID, callback);
		}
	);

	var handleTransaction = function (transaction) {
		var accounts = [];
		if (transaction && transaction.splits) {
			_.forEach(transaction.splits, function (split) {
				var accountID = split.account.toString();
				if (_.indexOf(accounts, accountID) < 0) {
					accounts.push(accountID);
				}
			});
		}
		async.each(
			accounts,
			function (accountID, asyncCallback) {
				updateBalance(accountID, asyncCallback);
			},
			function (err) {
				if (err) {
					logger.error('The update of all account balances impacted by the transaction has failed');
				} else {
					logger.info('All account balances impacted by the transaction have been updated accordingly');
				}
			}
		);
	};

	Transactions.on(Transactions.events.CREATED, function (createdItem) {
		logger.info('Handling a', Transactions.events.CREATED, 'event');
		handleTransaction(createdItem);
	});

	Transactions.on(Transactions.events.UPDATED, function (updatedItem) {
		logger.info('Handling a', Transactions.events.UPDATED, 'event');
		handleTransaction(updatedItem);
	});

	Transactions.on(Transactions.events.DELETED, function (deletedItem) {
		logger.info('Handling a', Transactions.events.DELETED, 'event');
		handleTransaction(deletedItem);
	});

};