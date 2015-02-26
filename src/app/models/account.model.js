/** @module Account Model */
'use strict';

var logger = require(process.env.LOGGER)('Account Model');

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var constants = require(process.env.CONSTANTS);

var AccountSchema = new Schema({

	generalLedger :{
		type: Schema.ObjectId,
		ref: 'GeneralLedger',
		required : true
	},

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

	type: {
		type: String,
		trim: true,
		default: '',
		required : true,
		enum : constants.accountTypeAsArray
	},

	code: {
		type: String,
		trim: true,
		default: ''
	},

	commodity: {
		type: String,
		trim: true,
		default: '',
		required : true,
		enum : constants.commoditiesAsArray
	},

	balance : {

		own: {
			type: Number,
			default: 0
		},

		child: {
			type: Number,
			default: 0
		}

	},

	placeholder: {
		type: Boolean,
		default: false
	},

	closed: {
		type: Boolean,
		default: false
	},

	parent: {
		type: Schema.ObjectId,
		ref: 'Account'
	},

	level: {
		type: Number,
		default: 0,
		min : 0
	},

	meta: {
		created: Date,
		creationUser : String,
		updated: Date,
		updatedUser : String
	}

});

// Virtuals ===================================================================

AccountSchema.virtual('balance.total').get(function() {

	return this.balance.own + this.balance.child;

});

// Pre processing methods =====================================================

AccountSchema.pre('save', function(next) {

	logger.debug('====== New Account saving ================================');

	logger.debug('Name : ' + this.name);

	// meta dates management

	var today = new Date();

	if (!this.meta.created) {
		this.meta.created = today;
	}

	this.meta.updated = today;

	// child balance management



	// level management

	var accountId = this._id;

	if (this.parent) {
		mongoose.model('Account').findById(this.parent, function(err, parent) {
			if(!err && accountId && parent){
				var newLevel = parent.level + 1;
				mongoose.model('Account').findByIdAndUpdate(accountId, { level: newLevel }, { new : true })
				.exec(function(err, account){
					logger.debug('updated level : ' + account.level);
				});
			}
		});
	}

	// ------------------------------------------------------------------------

	logger.debug('');

	next();

});


// Post processing methods ====================================================

AccountSchema.post('save', function(account) {

	logger.debug('====== New Account saved =================================');
	logger.debug('_id : ' + account._id);
	logger.debug('Name : ' + account.name);
	logger.debug('total balance : ' + account.balance.total);
	logger.debug('');

});


// Model export ===============================================================

module.exports = mongoose.model('Account', AccountSchema);