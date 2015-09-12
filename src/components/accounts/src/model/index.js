/**
 *  @module   Accounts Model
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-05-01
 *  @version  1.0.0
 */
'use strict';

// Module dependencies ========================================================
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var modelName = 'accounts';

/**
 *  Define the mongoose schema and model of Account.
 *
 *  @param    {Object}    options  The options of the module.
 *  @param    {Object}    imports  The imports of the module.
 *  @param    {Object}    emitter  The emitter of Accounts.
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-01
 *  @version  1.0.0
 *  @since    1.0.0
 */
module.exports.define = function (options, imports, emitter) {

	var logger = imports.logger.get('Accounts Model');

	var AmountSchema = imports.amounts.schema;

	var nomenclatures = imports.nomenclatures;
	var currencies = nomenclatures.getIds('currencies');
	var accountTypes = nomenclatures.getIds('accountTypes');

	// TODO Deal with nomenclatures update

	var defaultCurrency = options.defaultCurrency || currencies[0];
	var generalLedgerModelName = options.generalLedgerModelName || 'generalledgers';

	// Schema definition ======================================================

	var AccountSchema = new Schema({

		generalLedger: {
			type: Schema.ObjectId,
			ref: generalLedgerModelName,
			required: true
		},

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

		type: {
			type: String,
			trim: true,
			default: '',
			required: true,
			enum: accountTypes
		},

		code: {
			type: String,
			trim: true,
			default: ''
		},

		currency: {
			type: String,
			trim: true,
			default: defaultCurrency,
			required: true,
			enum: currencies
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
			ref: modelName
		},

		// TODO: Add the path

		balance: [AmountSchema],

		ownBalance: [AmountSchema],

		childBalance: [AmountSchema],

		level: {
			type: Number,
			default: 0,
			min: 0
		},

		meta: {
			creationDate: Date,
			creationUser: String,
			updateDate: Date,
			updateUser: String
		}

	});

	// Pre processing =========================================================

	AccountSchema.pre('save', function (next) {

		// meta management ----------------------------------------------------
		var today = new Date();
		if (!this.meta.creationDate) {
			this.meta.creationDate = today;
		}
		this.meta.updateDate = today;

		// level management ---------------------------------------------------
		// TODO (2) Define the level management while pre-saving an account

		// Process the save ---------------------------------------------------
		next();
	});

	// Post processing ========================================================

	AccountSchema.post('save', function (account) {
		logger.info('Account', account.name, '(', account._id, ') successfully saved');
	});

	mongoose.model(modelName, AccountSchema);

};

/**
 *  Get the mongoose model of Account.
 *
 *  @return   {Model}    The mongoose model of Account.
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-05-01
 *  @version  1.0.0
 *  @since    1.0.0
 */
module.exports.get = function () {
	return mongoose.model(modelName);
};