/**
 *  @module   Amount Model
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

module.exports = function (options, imports) {

	var logger = imports.logger.get('Amount Model');

	var nomenclatures = imports.nomenclatures;
	var currencies = nomenclatures.getIds('currencies');

	// TODO Deal with nomenclatures update

	var defaultCurrency = options.defaultCurrency || currencies[0];
	var defaultScale = options.defaultScale || 100;

	// Schema definition ======================================================

	var AmountSchema = new Schema({

		quantity: {
			type: Number,
			default: 1
		},

		unitary: {
			type: Number
		},

		value: {
			type: Number,
			required: true,
			default: 0
		},

		scale: {
			type: Number,
			required: true,
			default: defaultScale
		},

		currency: {
			type: String,
			trim: true,
			default: defaultCurrency,
			enum: currencies
		}

	}, {
		id: false,
		_id: false,
		versionKey: false
	});

	// Pre processing =========================================================

	AmountSchema.pre('save', function (next) {

		if (this.quantity === 0) {
			this.unitary = 0;
			this.value = 0;
		} else {
			if (!this.unitary) {
				this.unitary = this.value / this.quantity;
			}
		}

		next();

	});

	// Model export ===========================================================

	return AmountSchema;

};