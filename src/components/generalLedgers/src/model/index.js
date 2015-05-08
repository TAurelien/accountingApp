/**
 *  @module   General ledgers Model
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
var modelName = 'generalledgers';

/**
 *  Define the mongoose schema and model of General Ledger.
 *
 *  @param    {Object}    options  The options of the module.
 *  @param    {Object}    imports  The imports of the module.
 *  @param    {Object}    emitter  The emitter of GeneralLedgers.
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-01
 *  @version  1.0.0
 *  @since    1.0.0
 */
module.exports.define = function (options, imports, emitter) {

	var logger = imports.logger.get('General Ledgers Model');

	var nomenclatures = imports.nomenclatures;
	var currencies = nomenclatures.getIds('currencies');
	// TODO Deal with nomenclatures update

	var defaultCurrency = options.defaultCurrency || currencies[0];

	// Schema definition ======================================================

	/**
	 * Mongoose General Ledger schema.
	 *
	 * @type {Schema}
	 */
	var GeneralLedgerSchema = new Schema({

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

		closed: {
			type: Boolean,
			default: false
		},

		settings: {

			defaultCurrency: {
				type: String,
				trim: true,
				default: defaultCurrency,
				required: true,
				enum: currencies
			}

		},

		meta: {
			creationDate: Date,
			creationUser: String,
			updateDate: Date,
			updatedUser: String
		}

	});

	// Pre processing =========================================================

	GeneralLedgerSchema.pre('save', function (next) {

		// meta management ----------------------------------------------------
		var today = new Date();
		if (!this.meta.created) {
			this.meta.created = today;
		}
		this.meta.updated = today;

		// Process the save ---------------------------------------------------
		next();
	});

	// Post processing ========================================================

	GeneralLedgerSchema.post('save', function (generalLedger) {
		logger.info('General ledger', generalLedger.name, '(' + generalLedger._id + ') successfully saved');
	});

	mongoose.model(modelName, GeneralLedgerSchema);

};

/**
 *  Get the mongoose model of General Ledger.
 *
 *  @return   {Model}    The mongoose model of General Ledger.
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