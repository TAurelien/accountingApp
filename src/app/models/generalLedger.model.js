/** @module General Ledger Model */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('General Ledger Model');
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var path = require('path');
var Amount = require(path.join(global.app.paths.controllersDir, './amount/amount.controller'));

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

	var _id = this._id;
	var name = this.name;
	var nameRef = name + ' (' + _id + ')';

	var netWorth = Object.create(Amount);
	netWorth.init(0, 100, 'EUR');
	// TODO Deal with initialization of Amount object

	logger.info('getNetWorth - Computing the net worth of the general ledger ' + nameRef);

	var conditions = {
		generalLedger: _id,
		$or: [{
			type: 'asset'
		}, {
			type: 'liability'
		}]
	};

	mongoose.model('Account')
		.find(conditions)
		.exec(function (err, accounts) {

			if (err) {

				logger.error('Getting the accounts of the general ledger ' + nameRef + ' failed!');
				callback(err);

			} else if (_.isEmpty(accounts)) {

				logger.warn('No account found for the general ledger ' + nameRef);
				callback({
					message: 'No accounts found for this general ledger'
				});

			} else {

				logger.info('Success of getting the accounts of the general ledger ' + nameRef);

				async.each(
					_.toArray(accounts),

					function (account, asyncCallback) {

						var accountID = account._id;
						var accountName = account.name;
						var accountNameRef = accountName + ' (' + accountID + ')';
						var type = account.type;

						account.getOwnBalance(function (err, ownBalance) {

							if (err) {

								logger.error('computing the own balance of ' + accountNameRef + ' failed!');
								asyncCallback(err);

							} else {

								try {

									if (type === 'asset') {
										netWorth.add(ownBalance);
									} else if (type === 'liability') {
										netWorth.subtract(ownBalance);
									}

								} catch (err) {

									logger.error('There was an error while adding the balance of the account ' + accountNameRef + ' to the net worth of the general ledger ' + nameRef);
									asyncCallback(err);
									return;

								}

								asyncCallback(null);

							}

						});

					},

					function (err) {

						if (err) {

							logger.error('computing the net worth of the general ledger ' + nameRef + ' failed!');
							callback(err);

						} else {

							logger.info('The net worth of the general ledger ' + nameRef + ' = ' + netWorth);
							callback(null, netWorth);

						}

					});

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