'use strict';

// Module dependencies ========================================================
var _ = require('lodash');
var async = require('async');

module.exports = function (options, imports, emitter) {

	var logger = imports.logger.get('General Ledgers API');
	var GeneralLedger = require('../model').get();
	var Amount = imports.amounts.Amount;
	var Account = imports.accounts.api;
	var crud = require('./crud')(options, imports, emitter);

	var getNetWorthByObject = function (generalLedger, callback) {

		var queryAsset = {};
		queryAsset.conditions = {
			generalLedger: generalLedger.id,
			type: 'asset'
		};
		queryAsset.order = null;
		queryAsset.selection = {
			type: 1
		};

		var queryLiability = {};
		queryLiability.conditions = {
			generalLedger: generalLedger.id,
			type: 'liability'
		};
		queryLiability.order = null;
		queryLiability.selection = {
			type: 1
		};

		var netWorth = new Amount();

		async.parallel([
			function (asyncCallback) {
				Account.getBalance(queryAsset, function (err, balance) {
					if (err) {
						logger.error('');
						asyncCallback(err);
					} else {
						try {
							netWorth.add(balance);
						} catch (err) {
							logger.error('');
							logger.error(err);
						}
						asyncCallback(null);
					}
				});
			},
			function (asyncCallback) {
				Account.getBalance(queryLiability, function (err, balance) {
					if (err) {
						logger.error('');
						asyncCallback(err);
					} else {
						try {
							netWorth.subtract(balance);
						} catch (err) {
							logger.error('');
							logger.error(err);
						}
						asyncCallback(null);
					}
				});
			}
		], function (err) {
			if (err) {
				logger.error('');
			} else {
				callback(null, netWorth);
			}
		});

	};

	var getNetWorthById = function (generalLedgerID, callback) {

		logger.debug(''); // TODO Log

		var query = {
			conditions: null,
			selection: null,
			order: null
		};
		crud.get(generalLedgerID, query, function (err, generalLedger) {
			if (err) {
				logger.error(''); // TODO Log error
				callback(err);
			} else {
				getNetWorthByObject(generalLedger, callback);
			}
		});

	};

	var getNetWorth = function (generalLedger, callback) {

		if (_.isString(generalLedger)) {
			getNetWorthById(generalLedger, callback);
		} else if (generalLedger instanceof GeneralLedger) {
			getNetWorthByObject(generalLedger, callback);
		} else {
			callback(new Error('Invalid arguments'));
		}

	};

	return getNetWorth;
};