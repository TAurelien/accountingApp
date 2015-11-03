'use strict';

// Module dependencies ========================================================
var _ = require('lodash');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('Accounts API');
	var Account = require('../model').get();

	var create = function (data, callback) {
		logger.info('Creating a new account');

		if (!data) {
			callback(new Error('account is not defined'));
			return;
		}

		var account = new Account(data);
		account.save(function (err, createdItem) {
			if (err) {
				// TODO Check error type
				logger.error('Account creation failed');
				logger.error(err);
				callback(err);
			} else {
				logger.info('Account creation successful');
				callback(null, createdItem);
				emitter.emitCreated(createdItem);
			}
		});
	};

	var get = function (id, query, callback) {
		logger.info('Getting a specific account');
		Account
			.findById(id)
			.select(query.selection)
			.exec(function (err, item) {
				if (err) {
					// TODO Check error type
					logger.error('Getting the account', id, 'failed');
					logger.error(err);
					callback(err);
				} else {
					if (_.isNull(item)) {
						logger.warn('No account has been found for id', id);
					} else {
						logger.info('Success of getting the account', id);
					}
					callback(null, item);
				}
			});
	};

	var list = function (query, callback) {
		logger.info('Getting a list of accounts');
		Account
			.find(query.conditions)
			.sort(query.order)
			.select(query.selection)
			.exec(function (err, items) {
				if (err) {
					// TODO Check error type
					logger.error('Getting accounts failed');
					logger.error(err);
					callback(err);
				} else {
					if (_.isEmpty(items)) {
						logger.warn('No account has been found');
					} else {
						logger.info('Success of getting accounts');
					}
					callback(null, items);
				}
			});
	};

	var update = function (id, data, callback) {
		logger.info('Updating a specific account');
		Account
			.findByIdAndUpdate(id, data)
			.exec(function (err, updatedItem) {
				if (err) {
					// TODO Check error type
					logger.error('Updating account', id, 'failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('The account', id, 'has been successfully updated');
					callback(null, updatedItem);
					emitter.emitUpdated(updatedItem);
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
			.exec(function (err, deletedItem) {
				if (err) {
					// TODO Check error type
					logger.error('Account deletion failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('Account deletion successful');
					callback(null, deletedItem);
					emitter.emitDeleted(deletedItem);
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