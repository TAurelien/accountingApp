/**
 *  @module   Amount API
 *
 *  @access   public
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 */
'use strict';

// Module dependencies ========================================================
var _ = require('lodash');

module.exports = function (options, imports, Amount) {

	var logger = imports.logger.get('Amount API');
	var privateApi = require('./private');

	Amount.prototype.isAmountObject = true;

	/**
	 *  Make the addition of the Amount passed in argument to the current Amount.
	 *
	 *  @param    {Amount}    amount  The Amount object to add to the current one.
	 *  @return   {Amount}            The current Amount after operation for chaining.
	 *
	 *  @throws   {Error}             If something is wrong on the Amount object passed in argument.
	 *  @throws   {Error}             If the currency of both Amount object are not similar.
	 *
	 *
	 *  @access   public
	 *  @author   TAurelien
	 *  @date     2015-05-02
	 *  @version  1.0.0
	 *  @since    1.0.0
	 */
	Amount.prototype.add = function (amount) {
		return privateApi.makeAddOrSub(this, amount, 'Add');
	};

	/**
	 *  Make the subtraction of the Amount passed in argument to the current Amount.
	 *
	 *  @param    {Amount}    amount  The Amount object to subtract to the current one.
	 *  @return   {Amount}            The current Amount after operation for chaining.
	 *
	 *  @throws   {Error}             If something is wrong on the Amount object passed in argument.
	 *  @throws   {Error}             If the currency of both Amount object are not similar.
	 *
	 *
	 *  @access   public
	 *  @author   TAurelien
	 *  @date     2015-05-02
	 *  @version  1.0.0
	 *  @since    1.0.0
	 */
	Amount.prototype.subtract = function (amount) {
		return privateApi.makeAddOrSub(this, amount, 'Sub');
	};

	/**
	 *  Make a multiplication of the Amount by a number.
	 *
	 *  @param    {Number}    number  The number to multiply the Amount by.
	 *  @return   {Amount}            The current Amount after operation for chaining.
	 *
	 *  @throws   {Error}             If the precise value is not defined.
	 *  @throws   {Error}             If the argument is not a number.
	 *
	 *  @access   public
	 *  @author   TAurelien
	 *  @date     2015-05-02
	 *  @version  1.0.0
	 *  @since    1.0.0
	 */
	Amount.prototype.multiply = function (number) {

		if (_.isNull(this.value)) {
			throw new Error('The value must be defined');
		}

		if (!_.isFinite(number)) {
			throw new Error('The argument must be a number');
		}

		this.value = Math.round(this.value * number);
		return this;

	};

	/**
	 *  Make a division of the Amount by a number.
	 *
	 *  @param    {Number}    number  The number to divide the Amount by.
	 *  @return   {Amount}            The current Amount after operation for chaining.
	 *
	 *  @access   public
	 *  @author   TAurelien
	 *  @date     2015-05-02
	 *  @version  1.0.0
	 *  @since    1.0.0
	 */
	Amount.prototype.divide = function (number) {

		if (_.isNull(this.value)) {
			throw new Error('The value must be defined');
		}

		if (!_.isFinite(number)) {
			throw new Error('The argument must be a number');
		}

		if (number === 0) {
			throw new Error('The argument must be different than 0');
		}

		this.value = Math.round(this.value / number);
		return this;

	};

	/**
	 *  Return the exact value after applying the scale.
	 *
	 *  @return   {Number}    The exact value of the amount.
	 *
	 *  @throws   {Error}     If something is wrong on the current Amount object.
	 *
	 *  @access   public
	 *  @author   TAurelien
	 *  @date     2015-05-02
	 *  @version  1.0.0
	 *  @since    1.0.0
	 */
	Amount.prototype.getValue = function () {

		try {
			privateApi.checkObject(this);
		} catch (err) {
			throw err;
		}

		var exactValue = this.value / this.scale;
		return exactValue;

	};

	/**
	 *  Compare two Amount object.
	 *
	 *  @param    {Amount}    amount  The amount to compare with the current one.
	 *  @return   {Number}            Returns 0 if both Amount (exact value after applying scale and currency) are equals. Returns 1 if the current object is greater and -1 instead.
	 *
	 *  @throws   {Error}             If something is wrong on the current Amount object.
	 *  @throws   {Error}             If something is wrong on the Amount object passed in argument.
	 *  @throws   {Error}             If the currency of both Amount object are not similar.
	 *
	 *  @access   public
	 *  @author   TAurelien
	 *  @date     2015-05-02
	 *  @version  1.0.0
	 *  @since    1.0.0
	 */
	Amount.prototype.compareTo = function (amount) {

		try {
			privateApi.checkObject(this);
		} catch (err) {
			throw err;
		}

		try {
			privateApi.checkObject(amount);
		} catch (err) {
			throw err;
		}

		// TODO Currency to take into account while comparing amounts.
		if (this.currency !== amount.currency) {
			throw new Error('The currency of both amount must be similar.');
		}

		var thisValue = this.getValue();
		var comparedValue = amount.getValue();

		if (thisValue === comparedValue) {
			return 0;
		} else if (thisValue > comparedValue) {
			return 1;
		} else {
			return -1;
		}

	};

	/**
	 *  Returns the string representation of the Amount object.
	 *
	 *  @return   {String}    The String representation of the Amount object.
	 *
	 *  @throws   {Error}     If something is wrong on the current Amount object.
	 *
	 *  @access   public
	 *  @author   TAurelien
	 *  @date     2015-05-02
	 *  @version  1.0.0
	 *  @since    1.0.0
	 */
	Amount.prototype.toString = function () {
		return this.getValue() + ' ' + this.currency + ' (' + this.value + ' / ' + this.scale + ')';
	};

	/**
	 *  A string representation of the Amount object for debugging purpose.
	 *
	 *  @return   {String}    The string representation.
	 *
	 *  @access   private
	 *  @author   TAurelien
	 *  @date     2015-05-02
	 *  @version  1.0.0
	 *  @since    1.0.0
	 */
	Amount.prototype.debug = function () {
		return 'Value: ' + this.value + ' | Scale: ' + this.scale + ' | currency: ' + this.currency;
	};

};