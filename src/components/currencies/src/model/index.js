/**
 *  @module   Currencies Model
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-05-14
 *  @version  1.0.0
 */
'use strict';

// Module dependencies ========================================================
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var modelName = 'currencies';

/**
 *  Define the mongoose schema and model of Currencies.
 *
 *  @param    {Object}    options  The options of the module.
 *  @param    {Object}    imports  The imports of the module.
 *  @param    {Object}    emitter  The emitter of Currencies.
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-14
 *  @version  1.0.0
 *  @since    1.0.0
 */
module.exports.define = function (options, imports, emitter) {

	var logger = imports.logger.get('Currencies Model');

	var CurrenciesSchema = new Schema({

		code: {
			type: String,
			trim: true,
			required: true
		},

		symbol: {
			type: String,
			trim: true,
			required: true
		}

	});

	// Post processing ========================================================

	CurrenciesSchema.post('save', function (currency) {
		logger.info('Currency', currency.code, '(' + currency._id + ') successfully saved');
	});

	mongoose.model(modelName, CurrenciesSchema);

};

/**
 *  Get the mongoose model of Currencies.
 *
 *  @return   {Model}    The mongoose model of Currencies.
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-05-14
 *  @version  1.0.0
 *  @since    1.0.0
 */
module.exports.get = function () {
	return mongoose.model(modelName);
};