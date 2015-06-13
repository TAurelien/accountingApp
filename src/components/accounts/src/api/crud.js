'use strict';

// Module dependencies ========================================================
var _ = require('lodash');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('Accounts API');
	var Account = require('../model').get();

	var create = function (account, callback) {
		logger.info('Creating a new account');

		if (!account) {
			callback(new Error('account is not defined'));
			return;
		}

		var newAccount = new Account();
		_.merge(newAccount, account);

		newAccount.save(function (err) {
			if (err) {
				// TODO Check error type
				logger.error('Account creation failed');
				logger.error(err);
				callback(err);
			} else {
				logger.info('Account creation successful');
				callback(null);
				emitter.emitCreate();
			}
		});
	};

	var get = function (accountID, query, callback) {
		logger.info('Getting a specific account');
		Account
			.findById(accountID)
			.select(query.selection)
			.exec(function (err, account) {
				if (err) {
					// TODO Check error type
					logger.error('Getting the account', accountID, 'failed');
					logger.error(err);
					callback(err);
				} else {
					if (_.isNull(account)) {
						logger.warn('No account has been found for id', accountID);
					} else {
						logger.info('Success of getting the account', accountID);
					}
					callback(null, account);
				}
			});
	};

	var list = function (query, callback) {
		logger.info('Getting a list of accounts');
		Account
			.find(query.conditions)
			.sort(query.order)
			.select(query.selection)
			.exec(function (err, accounts) {
				if (err) {
					// TODO Check error type
					logger.error('Getting accounts failed');
					logger.error(err);
					callback(err);
				} else {
					if (_.isEmpty(accounts)) {
						logger.warn('No account has been found');
					} else {
						logger.info('Success of getting accounts');
					}
					callback(null, accounts);
				}
			});
	};

	var update = function (accountID, update, callback) {
		logger.info('Updating a specific account');
		Account
			.findByIdAndUpdate(accountID, update)
			.exec(function (err, updatedAccount) {
				if (err) {
					// TODO Check error type
					logger.error('Updating account', accountID, 'failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('The account', accountID, 'has been successfully updated');
					callback(null, updatedAccount);
					emitter.emitUpdate();
				}
			});
	};

	var deleteAccount = function (query, callback) {
		logger.info('Deleting a specific account');

		if (!query.conditions) {
			callback(new Error('Conditions are not defined'));
			return;
		}

		Account
			.remove(query.conditions)
			.exec(function (err) {
				if (err) {
					// TODO Check error type
					logger.error('Account deletion failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('Account deletion successful');
					callback(null);
					emitter.emitDelete();
				}
			});
	};

	// ========================================================================

	return {
		create: create,
		get: get,
		list: list,
		update: update,
		delete: deleteAccount
	};

};