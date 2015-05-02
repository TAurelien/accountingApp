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
var modelName = 'Transaction';

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

	var accountModelName = options.accountModelName || 'Account';

	// Schema definition ======================================================

	// Split schema definition ------------------------------------------------
	var SplitSchema = new Schema({

		account: {
			type: Schema.ObjectId,
			ref: accountModelName
		},

		amount: [AmountSchema],

		currency: {
			type: String,
			trim: true,
			default: '',
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

	// Pre processing =========================================================

	TransactionSchema.pre('save', function (next) {

		// meta management ----------------------------------------------------
		var today = new Date();
		if (!this.meta.creationDate) {
			this.meta.creationDate = today;
		}
		this.meta.updateDate = today;

		// Process the save ---------------------------------------------------
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