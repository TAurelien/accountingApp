/** @module General Ledger Model */
'use strict';


// Module dependencies ========================================================
var logger   = require(global.LOGGER)('General Ledger Model');
var _        = require('lodash');
var async    = require('async');
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


// Schema definition ==========================================================

/**
 * Definition of the mongoose General Ledger schema.
 *
 * @type {Schema}
 */
var GeneralLedgerSchema = new Schema({

	name: {
		type     : String,
		trim     : true,
		default  : '',
		required : true
	},

	description: {
		type    : String,
		trim    : true,
		default : ''
	},

	closed: {
		type    : Boolean,
		default : false
	},

	settings: {

		defaultCommodity : {
			type    : String,
			trim    : true,
			default : ''
		}

	},

	meta: {
		creationDate : Date,
		creationUser : String,
		updateDate   : Date,
		updatedUser  : String
	}

});


// Schema functions ===========================================================

/**
 * Get the net worth of the general ledger.
 *
 * @param  {Function} callback Callback function.
 */
GeneralLedgerSchema.methods.getNetWorth = function(callback) {

	var name     = this.name;
	var _id      = this._id;
	var netWorth = 0;

	logger.debug('Computing the net worth of ' + name);

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

			// TODO Add a logger
			async.each(accountsArray, function(account, asyncCallback) {

				var accountObject = account.toObject();
				var type = accountObject.type;

				// TODO Add a logger
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

						// TODO Add a logger
						asyncCallback(null);

					}

				});

			},

			function(err){

				if (err) {

					logger.error('Error while getting the own balance of one account of ' + name);
					callback(err);

				} else {

					// TODO Add a logger
					callback(null, netWorth);

				}

			});

		} else {

			// TODO Add a logger
			callback('No accounts found for this general ledger', null);

		}

	});

};


// Pre processing =============================================================

GeneralLedgerSchema.pre('save', function(next) {

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

GeneralLedgerSchema.post('save', function(generalLedger) {

	logger.info('Saved general ledger ' + generalLedger.name + ' with _id ' + generalLedger._id);

});


// Model export ===============================================================

module.exports = mongoose.model('GeneralLedger', GeneralLedgerSchema);