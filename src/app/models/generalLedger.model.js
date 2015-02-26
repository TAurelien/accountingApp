/** @module General Ledger Model */
'use strict';

var logger = require(process.env.LOGGER)('General Ledger Model');

var _ = require('lodash');

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


// Virtuals ===================================================================

GeneralLedgerSchema.virtual('netWorth').get(function() {

	logger.debug('Computing the net worth');

	var netWorth = 0;

	var conditions = {
		generalLedger : this._id,
		$or : [
			{ type : 'asset' },
			{ type : 'liability' }
		]
	};

	logger.debug('Finding all accounts of the general ledger');

	mongoose.model('Account').find(conditions, function(err, accounts) {

		logger.debug('accounts.length : ' + accounts.length);
		if (!err && accounts.length){

			_.forIn(accounts, function(account) {
				account = account.toObject({ virtuals: true });
				logger.debug('account.balance.own : ' + account.balance.own);
				if (account.type === 'asset') {
					netWorth += account.balance.own;
				} else if (account.type === 'liability') {
					netWorth -= account.balance.own;
				}
			});

		}

		logger.debug('Net worth : ' + netWorth);
		return netWorth;

	});


});

// Pre processing methods =====================================================

GeneralLedgerSchema.pre('save', function(next) {

	logger.debug('====== New General Ledger saving =========================');

	logger.debug('Name : ' + this.name);

	// meta dates management

	var today = new Date();

	if (!this.meta.created) {
		this.meta.created = today;
	}

	this.meta.updated = today;

	logger.debug('');

	next();

});

// Post processing methods ====================================================

GeneralLedgerSchema.post('save', function(account) {

	logger.debug('====== New General Ledger saved ==========================');
	logger.debug('_id : ' + account._id);
	logger.debug('Name : ' + account.name);
	logger.debug('');

});


// Model export ===============================================================

module.exports = mongoose.model('GeneralLedger', GeneralLedgerSchema);