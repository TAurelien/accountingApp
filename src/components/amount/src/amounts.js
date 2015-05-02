/**
 *  @module   Amounts
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 */
'use strict';

// Module dependencies ========================================================
var _ = require('lodash');
var events = require('events');

module.exports = function setup(options, imports, register) {
	console.log();
	console.log('Registering the amounts component module ...');

	/**
	 *  Amount object.
	 *
	 *  @param    {Number}    preciseValue  The precise value of the amount.
	 *  @param    {Number}    scale         The scale of the amount.
	 *  @param    {String}    currency      The currency of the amount.
	 *
	 *  @access   public
	 *  @author   TAurelien
	 *  @date     2015-05-02
	 *  @version  1.0.0
	 *  @since    1.0.0
	 */
	var Amount = function (preciseValue, scale, currency) {

		if (_.isFinite(preciseValue)) {
			this.preciseValue = preciseValue;
		}
		if (_.isFinite(scale)) {
			this.scale = scale;
		}
		if (_.isString(currency)) {
			this.currency = currency;
		}

	};

	require('./api')(options, imports, Amount);

	/**
	 *  Amounts
	 *
	 *  @class  Amounts
	 *
	 *  @type  {events}
	 */
	var Amounts = new events.EventEmitter();

	Amounts.schema = require('./model')(options, imports);
	Amounts.Amount = Amount;

	// Register --------------

	register(null, {
		amounts: Amounts
	});

};