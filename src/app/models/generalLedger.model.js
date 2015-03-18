/** @module General Ledger Model */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('General Ledger Model');
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema definition ==========================================================

/**
 * Definition of the mongoose General Ledger schema.
 *
 * @type {Schema}
 */
var GeneralLedgerSchema = new Schema({

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

	closed: {
		type: Boolean,
		default: false
	},

	settings: {

		defaultCommodity: {
			type: String,
			trim: true,
			default: ''
		}

	},

	meta: {
		creationDate: Date,
		creationUser: String,
		updateDate: Date,
		updatedUser: String
	}

});

// Schema functions ===========================================================

/**
 * Get the net worth of the general ledger.
 *
 * @param  {Function} callback Callback function.
 */
GeneralLedgerSchema.methods.getNetWorth = function (callback) {

	var name = this.name;
	var _id = this._id;
	var netWorth = 0;

	logger.info('Computing the net worth of ' + name + ' (' + _id + ')');

	var conditions = {
		generalLedger: _id,
		$or: [{
			type: 'asset'
		}, {
			type: 'liability'
		}]
	};

	mongoose.model('Account').find(conditions, function (err, accounts) {

		if (err) {

			logger.error('Error while getting the accounts of ' + name + ' (' + _id + ')');

			callback(err);

		} else if (accounts.length) {

			var accountsArray = [];

			_.forIn(accounts, function (account) {
				accountsArray.push(account);
			});

			logger.info('Success of getting searched accounts for ' + name + ' (' + _id + ')');

			async.each(accountsArray, function (account, asyncCallback) {

					var accountObject = account.toObject();
					var type = accountObject.type;

					logger.info('Getting own balance of account ' + account.name + ' (' + _id + ')');

					account.getOwnBalance(function (err, ownBalance) {

						if (err) {

							logger.error('Error while getting the own balance of ' + accountObject.name);

							asyncCallback(err);

						} else {

							if (type === 'asset') {
								netWorth += ownBalance;
							} else if (type === 'liability') {
								netWorth -= ownBalance;
							}

							logger.info('Got the own balance of ' + accountObject.name);

							asyncCallback(null);

						}

					});

				},

				function (err) {

					if (err) {

						logger.error('Error while getting the own balance of one account of ' + name);
						callback(err);

					} else {

						logger.info('Got the net worth of ' + name);

						callback(null, netWorth);

					}

				});

		} else {

			logger.warn('No accounts found for this general ledger ' + name + ' (' + _id + ')');

			callback('No accounts found for this general ledger', null);

		}

	});

};

// Pre processing =============================================================

GeneralLedgerSchema.pre('save', function (next) {

	// meta management --------------------------------------------------------

	var today = new Date();

	if (!this.meta.created) {
		this.meta.created = today;
	}

	this.meta.updated = today;

	// Process the save -------------------------------------------------------

	next();

});

// Post processing ============================================================

GeneralLedgerSchema.post('save', function (generalLedger) {

	logger.info('Saved general ledger ' + generalLedger.name + ' with _id ' + generalLedger._id);

});

// Model export ===============================================================

module.exports = mongoose.model('GeneralLedger', GeneralLedgerSchema);