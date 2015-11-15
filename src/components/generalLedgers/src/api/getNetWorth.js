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

		if (!_.isNull(generalLedger)) {
			var generalLedgerID = generalLedger.id;
			logger.info('Getting net worth by object of general ledger', generalLedgerID);

			var netWorth = new Amount();

			var query = {
				conditions: {
					generalLedger: generalLedgerID,
					$or: [{
						type: 'asset'
					}, {
						type: 'liability'
					}]
				},
				order: null,
				selection: null
			};

			Account.list(query, function (err, accounts) {
				if (err) {
					logger.error('');
					callback(err);
				} else {
					_.forEach(accounts, function (account) {
						try {
							var balance = new Amount();
							balance.value = account.balance.value;
							balance.scale = account.balance.scale;
							balance.currency = account.balance.currency;
							if (account.type === 'asset') {
								netWorth.add(balance);
							} else if (account.type === 'liability') {
								netWorth.subtract(balance);
							}
						} catch (err) {
							logger.error('');
							logger.error(err);
						}
					});
					callback(null, netWorth, generalLedgerID);
				}
			});

		} else {
			logger.error(''); // TODO Log
			callback(new Error('')); // TODO Define error
		}

	};

	var getNetWorthById = function (generalLedgerID, callback) {
		logger.info('Getting net worth by id of general ledger', generalLedgerID);

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
		logger.info('Getting net worth of general ledger');

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