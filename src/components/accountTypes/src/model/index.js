/**
 *  @module   Account types Model
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
var modelName = 'accounttypes';

/**
 *  Define the mongoose schema and model of Account Types.
 *
 *  @param    {Object}    options  The options of the module.
 *  @param    {Object}    imports  The imports of the module.
 *  @param    {Object}    emitter  The emitter of AccountTypes.
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-14
 *  @version  1.0.0
 *  @since    1.0.0
 */
module.exports.define = function (options, imports, emitter) {

	var logger = imports.logger.get('Account types Model');

	var AccountTypesSchema = new Schema({

		code: {
			type: String,
			trim: true,
			required: true
		}

	});

	// Post processing ========================================================

	AccountTypesSchema.post('save', function (accountType) {
		logger.info('Account type', accountType.code, '(' + accountType._id + ') successfully saved');
	});

	mongoose.model(modelName, AccountTypesSchema);

};

/**
 *  Get the mongoose model of Account types.
 *
 *  @return   {Model}    The mongoose model of Account types.
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