/** @module Transaction Model */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('Transaction Model');
var constants = require(global.app.constants);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AmountSchema = require('./amount.schema');

// Split schema definition ====================================================
var SplitSchema = new Schema({

	account: {
		type: Schema.ObjectId,
		ref: 'Account'
	},

	amount: [AmountSchema],

	currency: {
		type: String,
		trim: true,
		default: '',
		required: true,
		enum: constants.commoditiesAsArray
	},

	thirdParty: {
		type: String,
		trim: true
	},

	description: {
		type: String,
		trim: true
	},

	reconciliationState: {
		type: String,
		trim: true,
		default: ''
	},

	reconciliationDate: Date,

	accountDate: Date

});

// Transaction schema definition ==============================================
var TransactionSchema = new Schema({

	description: {
		type: String,
		trim: true
	},

	valueDate: Date,

	splits: [SplitSchema],

	meta: {
		creationDate: Date,
		creationUser: String,
		updateDate: Date,
		updateUser: String
	}

});

// Pre processing =============================================================

TransactionSchema.pre('save', function (next) {

	// meta dates management --------------------------------------------------

	var today = new Date();

	if (!this.meta.creationDate) {
		this.meta.creationDate = today;
	}

	this.meta.updateDate = today;

	next();

});

// Post processing ============================================================

TransactionSchema.post('save', function (transaction) {

	logger.info('Saved transaction with _id : ' + transaction._id);

});

// Model export ===============================================================

module.exports = mongoose.model('Transaction', TransactionSchema);