'use strict';

// Module dependencies ========================================================
var _ = require('lodash');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('Accounts API');
	var Account = require('../model').get();

	// ------------------------------------------------------------------------

	function transformToPlainObject(object) {
		var item = null;
		if (object) {
			if (object.toObject) {
				item = object.toObject();
			} else {
				item = object;
			}
			item.id = object._id.toString();
			delete item._id;
			delete item.__v;
			if (object.generalLedger.toString) {
				item.generalLedger = object.generalLedger.toString();
			}
			if (object.balance) {
				if (object.balance[0].toObject) {
					item.balance = object.balance[0].toObject();
				} else {
					item.balance = object.balance[0];
				}
			}
			if (object.ownBalance) {
				if (object.ownBalance[0].toObject) {
					item.ownBalance = object.ownBalance[0].toObject();
				} else {
					item.ownBalance = object.ownBalance[0];
				}
			}
			if (object.childBalance) {
				if (object.childBalance[0].toObject) {
					item.childBalance = object.childBalance[0].toObject();
				} else {
					item.childBalance = object.childBalance[0];
				}
			}
		}
		return item;
	}

	function transformObject(item) {
		var object = null;
		if (item) {
			object = item;
			if (item.id && !item._id) {
				object._id = item.id;
				delete object.id;
			}
			if (item.balance && !_.isArray(item.balance)) {
				object.balance = [item.balance];
			}
			if (item.ownBalance && !_.isArray(item.ownBalance)) {
				object.ownBalance = [item.ownBalance];
			}
			if (item.childBalance && !_.isArray(item.childBalance)) {
				object.childBalance = [item.childBalance];
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
		var account = new Account(data);
		account.save(function (err, createdItem) {
			if (err) {
				// TODO Check error type
				logger.error('Account creation failed');
				logger.error(err);
				callback(err);
			} else {
				logger.info('Account creation successful');
				if (lean) {
					createdItem = transformToPlainObject(createdItem);
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
			.lean(lean)
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
						item = transformToPlainObject(item);
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
			.lean(lean)
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
							return transformToPlainObject(item);
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
			.findByIdAndUpdate(id, data)
			.exec(function (err, updatedItem) {
				if (err) {
					// TODO Check error type
					logger.error('Updating account', id, 'failed');
					logger.error(err);
					callback(err);
				} else {
					logger.info('The account', id, 'has been successfully updated');
					if (lean) {
						updatedItem = transformToPlainObject(updatedItem);
					}
					callback(null, updatedItem);
					emitter.emitUpdated(updatedItem);
				}
			});
	};

	var deleteAccount = function (query, callback, lean) {
		logger.info('Deleting a specific account');

		if (!query.conditions) {
			callback(new Error('Conditions are not defined'));
			return;
		}

		lean = lean || false;
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
					if (lean) {
						deletedItem = transformToPlainObject(deletedItem);
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