/**
 *  @module   Transactions Model
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 */
'use strict';

// Module dependencies ========================================================
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var modelName = 'transactions';

/**
 *  Define the mongoose schema and model of Transaction.
 *
 *  @param    {Object}    options  The options of the module.
 *  @param    {Object}    imports  The imports of the module.
 *  @param    {Object}    emitter  The emitter of Transactions.
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 *  @since    1.0.0
 */
module.exports.define = function (options, imports, emitter) {

	var logger = imports.logger.get('Transaction Model');

	var nomenclatures = imports.nomenclatures;
	var currencies = nomenclatures.getIds('currencies');

	var AmountSchema = imports.amounts.schema;

	// TODO Deal with nomenclatures update

	var accountModelName = options.accountModelName || 'accounts';
	var defaultCurrency = options.defaultCurrency || currencies[0];

	// Schema definition ======================================================

	// Split schema definition ------------------------------------------------
	var SplitSchema = new Schema({

		account: {
			type: Schema.ObjectId,
			ref: accountModelName
		},

		amount: AmountSchema,

		currency: {
			type: String,
			trim: true,
			default: defaultCurrency,
			required: true,
			enum: currencies
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

	var transformSplit = function (doc, ret, options) {
		delete ret._id;
		if (ret.amount) {
			delete ret.amount._id;
		}
		if (ret.account.toString) {
			ret.account = ret.account.toString();
		}
	};

	SplitSchema.set('toObject', {
		getters: true,
		versionKey: false,
		retainKeyOrder: true,
		transform: transformSplit
	});

	SplitSchema.set('toJSON', {
		getters: true,
		versionKey: false,
		retainKeyOrder: true,
		transform: transformSplit
	});

	// Transaction schema definition ------------------------------------------
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

	var transformTransaction = function (doc, ret, options) {
		delete ret._id;
		if (ret.splits) {
			for (var i = 0; i < ret.splits.length; i++) {
				var split = ret.splits[i];
				if (split.toObject) {
					ret.splits[i] = split.toObject();
				}
			}
		}
	};

	TransactionSchema.set('toJSON', {
		getters: true,
		versionKey: false,
		retainKeyOrder: true,
		transform: transformTransaction
	});

	TransactionSchema.set('toObject', {
		getters: true,
		versionKey: false,
		retainKeyOrder: true,
		transform: transformTransaction
	});

	// Pre processing =========================================================

	TransactionSchema.pre('save', function (next) {
		if (!this.meta) {
			this.meta = {};
		}
		var today = new Date();
		if (!this.meta.creationDate) {
			this.meta.creationDate = today;
		}
		this.meta.updateDate = today;
		next();
	});

	TransactionSchema.pre('update', function (next) {
		var today = new Date();
		this.findOneAndUpdate({}, {
			meta: {
				updateDate: today
			}
		});
		next();
	});

	TransactionSchema.pre('findOneAndUpdate', function (next) {
		var today = new Date();
		this.findOneAndUpdate({}, {
			meta: {
				updateDate: today
			}
		});
		next();
	});

	// Post processing ========================================================

	TransactionSchema.post('save', function (transaction) {

		logger.info('Transaction', transaction._id, 'successfully saved');

	});

	mongoose.model(modelName, TransactionSchema);

};

/**
 *  Get the mongoose model of Transaction.
 *
 *  @return   {Model}    The mongoose model of Transaction.
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 *  @since    1.0.0
 */
module.exports.get = function () {
	return mongoose.model(modelName);
};