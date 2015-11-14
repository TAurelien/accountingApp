'use strict';

// Module dependencies ========================================================
var _ = require('lodash');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('Accounts API');
	var Account = require('../model').get();

	// ------------------------------------------------------------------------

	function transformObject(item) {
		var object = null;
		if (item) {
			object = item;
			if (item.id && !item._id) {
				object._id = item.id;
				delete object.id;
			}
		}
		return object;
	}

	// ------------------------------------------------------------------------

	var create = function (data, callback, lean) {
		logger.info('Creating a new account');

		if (!data) {
			callback(new Error('account is not defined'));
			return;
		}

		lean = lean || false;
		data = transformObject(data);
		Account.create(data, function (err, createdItem) {
			if (err) {
				// TODO Check error type
				logger.error('Account creation failed');
				logger.error(err);
				callback(err);
			} else {
				logger.info('Account creation successful');
				if (lean) {
					createdItem = createdItem.toObject();
				}
				callback(null, createdItem);
				emitter.emitCreated(createdItem);
			}
		});
	};

	var get = function (id, query, callback, lean) {
		logger.info('Getting a specific account');

		lean = lean || false;
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
					if (lean) {
						item = item.toObject();
					}
					callback(null, item);
				}
			});
	};

	var list = function (query, callback, lean) {
		logger.info('Getting a list of accounts');

		lean = lean || false;
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
					if (lean) {
						items = items.map(function (item) {
							return item.toObject();
						});
					}
					callback(null, items);
				}
			});
	};

	var update = function (id, data, callback, lean) {
		logger.info('Updating a specific account');

		lean = lean || false;
		data = transformObject(data);
		Account
			.findByIdAndUpdate(id, data, {
				new: true
			})
			.exec(function (err, updatedItem) {
				if (err) {
					// TODO Check error type
					logger.error('Updating account', id, 'failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('The account', id, 'has been successfully updated');
					if (lean) {
						updatedItem = updatedItem.toObject();
					}
					callback(null, updatedItem);
					emitter.emitUpdated(updatedItem);
				}
			});
	};

	var deleteAccount = function (id, callback, lean) {
		logger.info('Deleting a specific account');

		if (!id) {
			callback(new Error('Id is not defined'));
			return;
		}

		lean = lean || false;
		Account
			.findByIdAndRemove(id)
			.exec(function (err, deletedItem) {
				if (err) {
					// TODO Check error type
					logger.error('Account deletion failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('Account deletion successful');
					if (lean) {
						deletedItem = deletedItem.toObject();
					}
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