/** @module Account Model */
'use strict';

var logger = require(process.env.LOGGER)('Account Model');

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var _ = require('lodash');
var async = require('async');

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


// Private methods ============================================================

function computeOwnBalance(ownBalance, cb) {

	logger.debug('computeOwnBalance - Getting the transactions balance');

	return cb(null, ownBalance);

}

function computeChildBalance(accountID, cb) {

	logger.debug('computeChildBalance - Getting the childs balance');

	var conditions = { parent : accountID };

	mongoose.model('Account').find(conditions, function(err, childs) {

		var childArray = [];

		_.forIn(childs, function(child){
			childArray.push(child);
		});

		async.map(
			childArray,

			function(child, callback){

				child.getBalance(function(err, balance) {
					callback(err, balance);
				});

			},

			function(err, results) {

				var globalChildBalance = 0;

				_(results).forEach(function(childBalance){
					globalChildBalance += childBalance;
				});

				return cb(err, globalChildBalance);

			}

		);

	});

}

// Methods ====================================================================

AccountSchema.methods.getBalance = function(cb) {

	var ownBalance = this.balance.own;
	var accountID = this._id;
	var name = this.name;

	logger.debug('getBalance - Computing the account balance of ' + name);

	async.parallel([

		function(callback){

			computeOwnBalance(ownBalance, function(err, transactionsBalance) {
				logger.debug('Transaction balance for ' + name + ' = ' + transactionsBalance);
				callback(err, transactionsBalance);
			});

		},

		function(callback){

			computeChildBalance(accountID, function(err, childBbalance){
				logger.debug('Child balance for ' + name + ' = ' + childBbalance);
				callback(err, childBbalance);
			});

		}

	],

	function(err, results){

		var globalBalance = 0;

		_.forIn(results, function(childAndOwnBalance){
			globalBalance += childAndOwnBalance;
		});
		logger.debug('Global balance for ' + name + ' = ' + globalBalance);
		return cb(err, globalBalance);

	});

};

AccountSchema.methods.getOwnBalance = function(cb) {

	logger.debug('getOwnBalance - Getting the transactions balance');

	return computeOwnBalance(this.balance.own, cb);

};

AccountSchema.methods.getChildBalance = function(cb) {

	logger.debug('getChildBalance - Getting the childs balance');

	return computeChildBalance(this._id, cb);

};


// Pre processing methods =====================================================

AccountSchema.pre('save', function(next) {

	// meta dates management --------------------------------------------------

	var today = new Date();

	if (!this.meta.created) {
		this.meta.created = today;
	}

	this.meta.updated = today;

	// level management -------------------------------------------------------

	var accountId = this._id;

	if (this.parent) {
		mongoose.model('Account').findById(this.parent, function(err, parent) {
			if(!err && accountId && parent){
				var newLevel = parent.level + 1;
				mongoose.model('Account').findByIdAndUpdate(accountId, { level: newLevel }, { new : true }).exec();
			}
		});
	}

	// ------------------------------------------------------------------------

	next();

});


// Post processing methods ====================================================

AccountSchema.post('save', function(account) {

	logger.debug('Saved account ' + account.name + ' with _id : ' + account._id);

});


// Model export ===============================================================

module.exports = mongoose.model('Account', AccountSchema);