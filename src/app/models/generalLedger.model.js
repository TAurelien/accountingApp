/** @module General Ledger Model */
'use strict';

var logger = require(process.env.LOGGER)('General Ledger Model');

var _ = require('lodash');
var async = require('async');

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var GeneralLedgerSchema = new Schema({

	name: {
		type: String,
		trim: true,
		default: '',
		required : true
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

	meta: {
		created: Date,
		creationUser : String,
		updated: Date,
		updatedUser : String
	}

});


GeneralLedgerSchema.methods.getNetWorth = function(callback) {

	var name = this.name;
	var _id = this._id;

	logger.debug('Computing the net worth of ' + name);

	var netWorth = 0;

	var conditions = {
		generalLedger : _id,
		$or : [
			{ type : 'asset' },
			{ type : 'liability' }
		]
	};

	mongoose.model('Account').find(conditions, function(err, accounts) {

		if (err) {

			logger.error('Error while getting the accounts of ' + name);
			callback(err);

		} else if (accounts.length){

			var accountsArray = [];

			_.forIn(accounts, function(account) {
				accountsArray.push(account);
			});

			async.each(accountsArray, function(account, asyncCallback) {

				var accountObject = account.toObject();
				var type = accountObject.type;

				account.getOwnBalance(function(err, ownBalance) {

					if (err) {

						logger.error('Error while getting the own balance of ' + accountObject.name);
						asyncCallback(err);

					} else {

						if (type === 'asset'){
							netWorth += ownBalance;
						} else if (type === 'liability') {
							netWorth -= ownBalance;
						}

						asyncCallback(null);

					}

				});

			}, function(err){

				if (err) {

					logger.error('Error while getting the own balance of one account of ' + name);
					callback(err);

				} else {

					callback(null, netWorth);

				}

			});

		} else {

			callback('No accounts found for this general ledger', null);

		}

	});

};

// Pre processing methods =====================================================

GeneralLedgerSchema.pre('save', function(next) {

	// meta dates management --------------------------------------------------

	var today = new Date();

	if (!this.meta.created) {
		this.meta.created = today;
	}

	this.meta.updated = today;

	next();

});

// Post processing methods ====================================================

GeneralLedgerSchema.post('save', function(generalLedger) {

	logger.debug('Saved general ledger ' + generalLedger.name + ' with _id ' + generalLedger._id);

});


// Model export ===============================================================

module.exports = mongoose.model('GeneralLedger', GeneralLedgerSchema);