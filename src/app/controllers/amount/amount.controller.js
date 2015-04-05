/** @module Amount object */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('Amount Ctrl');
var _ = require('lodash');

// Private functions ==========================================================

/**
 * Check an Amount object before using it.
 *
 * @param  {Amount} amount The Amount object to check.
 *
 * @throws {Error}         If this is not an Amount object.
 * @throws {Error}         If the precise value is not defined.
 * @throws {Error}         If the scale is not defined.
 * @throws {Error}         If the currency is not defined.
 */
function checkObject(amountObject) {

	if (!amountObject.isAmountObject) {
		throw new Error('An amount object is required!');
	}

	if (_.isNull(amountObject.preciseValue)) {
		throw new Error('The precise value must be defined!');
	}

	if (_.isNull(amountObject.scale)) {
		throw new Error('The scale must be defined!');
	}

	if (amountObject.scale === 0) {
		throw new Error('The scale must be different than 0!');
	}

	if (_.isNull(amountObject.currency)) {
		throw new Error('The currency must be defined!');
	}

}

/**
 * Compare the scale of the 2 Amount object argument and align to the most restricting one.
 *
 * @param  {Amount} a The first Amount to compare the scale.
 * @param  {Amount} b The second Amount to compare the scale.
 */
function alignScale(a, b) {

	var scaleDiff = 1;

	checkObject(a);
	checkObject(b);

	if (b.scale > a.scale) {

		scaleDiff = b.scale / a.scale;
		a.preciseValue = a.preciseValue * scaleDiff;
		a.scale = b.scale;

	} else if (a.scale > b.scale) {

		scaleDiff = a.scale / b.scale;
		b.preciseValue = b.preciseValue * scaleDiff;
		b.scale = a.scale;

	}

}

// Definition of the exported object ==========================================

/**
 * Definition of the Amount object.
 *
 * @type {Object}
 */
var Amount = {

	// Variable definition ====================================================

	isAmountObject: true,
	preciseValue: null,
	scale: null,
	currency: null,

	// Exported functions =====================================================

	/**
	 * Initialize the main properties of the object.
	 *
	 * @param  {Number} preciseValue The precise value of the amount.
	 * @param  {Number} scale        The scale of the amount.
	 * @param  {String} currency     The currency of the object
	 */
	init: function (preciseValue, scale, currency) {

		if (_.isFinite(preciseValue)) {
			this.preciseValue = preciseValue;
		}
		if (_.isFinite(scale)) {
			this.scale = scale;
		}
		if (_.isString(currency)) {
			this.currency = currency;
		}

	},

	/**
	 * Make an addition between two Amount objects.
	 *
	 * @param  {Amount} amount The Amount object that will be added to the current Amount object.
	 *
	 * @throws {Error}         If something is wrong on the current Amount object.
	 * @throws {Error}         If something is wrong on the Amount object passed in argument.
	 * @throws {Error}         If the currency of both Amount object are not similar.
	 * @throws {Error}         If the scale of both Amount object are not similar.
	 *
	 * @return {Amount}        The current Amount object for chaining.
	 */
	add: function (amount) {

		try {
			checkObject(amount);
		} catch (err) {
			throw err;
		}

		if (_.isNull(this.currency)) {
			this.currency = amount.currency;
		}

		if (this.currency !== amount.currency) {
			throw new Error('The currency of both amount must be similar.');
		}

		if (_.isNull(this.preciseValue)) {
			this.preciseValue = 0;
		}

		if (_.isNull(this.scale)) {
			this.scale = amount.scale;
		}

		// TODO Find how to clone the object
		//var addedAmount = _.clone(amount);
		var addedAmount = {
			isAmountObject: true,
			preciseValue: amount.preciseValue,
			scale: amount.scale,
			currency: amount.currency
		};

		alignScale(this, addedAmount);

		this.preciseValue = Math.round(this.preciseValue + addedAmount.preciseValue);
		return this;
	},

	/**
	 * Make a subtraction between two Amount objects.
	 *
	 * @param  {Amount} amount The Amount object that will be subtract to the current Amount object.
	 *
	 * @throws {Error}         If something is wrong on the current Amount object.
	 * @throws {Error}         If something is wrong on the Amount object passed in argument.
	 * @throws {Error}         If the currency of both Amount object are not similar.
	 * @throws {Error}         If the scale of both Amount object are not similar.
	 *
	 * @return {Amount}        The current Amount object for chaining.
	 */
	subtract: function (amount) {

		try {
			checkObject(amount);
		} catch (err) {
			throw err;
		}

		if (_.isNull(this.currency)) {
			this.currency = amount.currency;
		}

		if (this.currency !== amount.currency) {
			throw new Error('The currency of both amount must be similar.');
		}

		if (_.isNull(this.preciseValue)) {
			this.preciseValue = 0;
		}

		if (_.isNull(this.scale)) {
			this.scale = amount.scale;
		}

		// TODO Find how to clone the object
		//var subtractedAmount = _.clone(amount, true);
		var subtractedAmount = {
			isAmountObject: true,
			preciseValue: amount.preciseValue,
			scale: amount.scale,
			currency: amount.currency
		};

		alignScale(this, subtractedAmount);

		this.preciseValue = Math.round(this.preciseValue - subtractedAmount.preciseValue);
		return this;
	},

	/**
	 * Make a multiplication of the Amount object by a number.
	 *
	 * @param  {Number} number The number to multiply the Amount object by.
	 *
	 * @throws {Error}         If the precise value is not defined.
	 * @throws {Error}         If the argument is not a number.
	 *
	 * @return {Amount}        The current Amount object for chaining.
	 */
	multiply: function (number) {

		if (_.isNull(this.preciseValue)) {
			throw new Error('The precise value must be defined!');
		}

		if (!_.isFinite(number)) {
			throw new Error('The argument must be a number!');
		}

		this.preciseValue = Math.round(this.preciseValue * number);
		return this;
	},

	/**
	 * Make a division of the Amount object by a number.
	 *
	 * @param  {Number} number The number to divide the Amount object by.
	 *
	 * @throws {Error}         If the precise value is not defined.
	 * @throws {Error}         If the argument is not a number.
	 * @throws {Error}         If the argument is equals to 0.
	 *
	 * @return {Amount}        The current Amount object for chaining.
	 */
	divide: function (number) {

		if (_.isNull(this.preciseValue)) {
			throw new Error('The precise value must be defined!');
		}

		if (!_.isFinite(number)) {
			throw new Error('The argument must be a number!');
		}

		if (number === 0) {
			throw new Error('Divide by 0 is forbidden.');
		}

		this.preciseValue = Math.round(this.preciseValue / number);
		return this;
	},

	/**
	 * Return the exact value after applying the scale.
	 *
	 * @throws {Error}         If something is wrong on the current Amount object.
	 * @throws {Error}         If the scale is 0.
	 *
	 * @return {Number}        The exact value of the amount.
	 */
	getValue: function () {

		try {
			checkObject(this);
		} catch (err) {
			throw err;
		}

		if (this.scale === 0) {
			throw new Error('The amount scale must be different than 0');
		}

		var value = this.preciseValue / this.scale;
		return value;
	},

	/**
	 * Compare two Amount objects.
	 *
	 * @param  {Amount} amount The Amount object that will be compared to the current Amount object.
	 *
	 * @throws {Error}         If something is wrong on the current Amount object.
	 * @throws {Error}         If something is wrong on the Amount object passed in argument.
	 * @throws {Error}         If the currency of both Amount object are not similar.
	 *
	 * @return {Number}        Returns 0 if both Amount (exact value after applying scale and currency) are equals. Returns 1 if the current object is greater and -1 instead.
	 */
	compareTo: function (amount) {

		try {
			checkObject(this);
		} catch (err) {
			throw err;
		}

		try {
			checkObject(this);
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
	},

	/**
	 * Return the string representation of the Amount object.
	 *
	 * @throws {Error}         If something is wrong on the current Amount object.
	 *
	 * @return {String}        The string representation of the Amount object.
	 */
	toString: function () {

		var returned = this.getValue() + ' ' + this.currency + ' (' + this.preciseValue + ' / ' + this.scale + ')';
		return returned;
	},

	debug: function () {

		return 'PreciseValue: ' + this.preciseValue + ' | Scale: ' + this.scale + ' | currency: ' + this.currency;
	}

};

module.exports = Amount;