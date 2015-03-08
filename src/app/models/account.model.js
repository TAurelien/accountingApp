/** @module Account Model */
'use strict';


// Module dependencies ========================================================
var logger    = require(global.LOGGER)('Account Model');
var constants = require(global.CONSTANTS);
var _         = require('lodash');
var async     = require('async');
var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;


// Schema definition ==========================================================

/**
 * Definition of the mongoose Account schema.
 * 
 * @type {Schema}
 */
var AccountSchema = new Schema({

	generalLedger :{
		type     : Schema.ObjectId,
		ref      : 'GeneralLedger',
		required : true
	},

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

	type: {
		type     : String,
		trim     : true,
		default  : '',
		required : true,
		enum     : constants.accountTypeAsArray
	},

	code: {
		type    : String,
		trim    : true,
		default : ''
	},

	commodity: {
		type     : String,
		trim     : true,
		default  : '',
		required : true,
		enum     : constants.commoditiesAsArray
	},

	balance : {

		own: {
			type    : Number,
			default : 0
		}

	},

	placeholder: {
		type    : Boolean,
		default : false
	},

	closed: {
		type    : Boolean,
		default : false
	},

	parent: {
		type : Schema.ObjectId,
		ref  : 'Account'
	},

	level: {
		type    : Number,
		default : 0,
		min     : 0
	},

	meta: {
		creationDate : Date,
		creationUser : String,
		updateDate   : Date,
		updateUser   : String
	}

});


// Private functions ==========================================================

/**
 * Compute the balance of an account based on his transactions.
 * The balance is provided in the callback function.
 *
 * @param  {Number}   ownBalance TEMPORARY WILL BE REMOVE
 * @param  {Function} callback   Callback function.
 */
function computeOwnBalance(ownBalance, callback) {

	// TODO Remove the ownBalance variable while computation will be possible
	logger.debug('computeOwnBalance - Getting the transactions balance');

	callback(null, ownBalance);

}


/**
 * Compute the global balance of all childs of the specified account.
 * A callback function is then executed with the childs' balance.
 *
 * @param  {String}   accountID [description]
 * @param  {Function} callback  Callback function.
 */
function computeChildBalance(accountID, callback) {

	logger.debug('computeChildBalance - Getting the childs balance');

	var conditions = { parent : accountID };

	mongoose.model('Account').find(conditions, function(err, childs) {

		var childArray = [];

		_.forIn(childs, function(child){
			childArray.push(child);
		});

		async.map(
			childArray,

			function(child, asyncCallback){

				child.getBalance(function(err, balance) {
					asyncCallback(err, balance);
				});

			},

			function(err, results) {

				var globalChildBalance = 0;

				_(results).forEach(function(childBalance){
					globalChildBalance += childBalance;
				});

				callback(err, globalChildBalance);

			}

		);

	});

}


// Schema functions ===========================================================

/**
 * Get the balance of an account by getting its childs' balance and its own transaction balance.
 *
 * @param  {Function} callback Callback function.
 */
AccountSchema.methods.getBalance = function(callback) {

	var ownBalance = this.balance.own;
	var accountID  = this._id;
	var name       = this.name;

	logger.debug('getBalance - Computing the account balance of ' + name);

	async.parallel([

		function(asyncCallback){

			computeOwnBalance(ownBalance, function(err, transactionsBalance) {
				logger.debug('Transaction balance for ' + name + ' = ' + transactionsBalance);
				asyncCallback(err, transactionsBalance);
			});

		},

		function(asyncCallback){

			computeChildBalance(accountID, function(err, childBbalance){
				logger.debug('Child balance for ' + name + ' = ' + childBbalance);
				asyncCallback(err, childBbalance);
			});

		}

	],

	function(err, results){

		var globalBalance = 0;

		_.forIn(results, function(childAndOwnBalance){
			globalBalance += childAndOwnBalance;
		});
		logger.debug('Global balance for ' + name + ' = ' + globalBalance);

		callback(err, globalBalance);

	});

};


/**
 * Get the balance of an account based on its transactions.
 *
 * @param  {Function} callback Callback function.
 */
AccountSchema.methods.getOwnBalance = function(callback) {

	logger.debug('getOwnBalance - Getting the transactions balance');

	computeOwnBalance(this.balance.own, callback);

};


/**
 * Get the total balance of all childs of the account.
 *
 * @param  {Function} callback Callback function.
 */
AccountSchema.methods.getChildBalance = function(callback) {

	logger.debug('getChildBalance - Getting the childs balance');

	computeChildBalance(this._id, callback);

};


// Pre processing =============================================================

AccountSchema.pre('save', function(next) {

	// meta dates management --------------------------------------------------

	var today = new Date();

	if (!this.meta.creationDate) {
		this.meta.creationDate = today;
	}

	this.meta.updateDate = today;

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


// Post processing ============================================================

AccountSchema.post('save', function(account) {

	logger.info('Saved account ' + account.name + ' with _id : ' + account._id);

});


// Model export ===============================================================

module.exports = mongoose.model('Account', AccountSchema);