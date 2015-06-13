/**
 *  @module   Amount private API
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 */
'use strict';

// Module dependencies ========================================================
var _ = require('lodash');

/**
 *  Check the amount object before using it.
 *
 *  @param    {Amount}    amountObject  The Amount object to check.
 *
 *  @throws   {Error}                   If this is not an Amount object.
 *  @throws   {Error}                   If the precise value is not defined.
 *  @throws   {Error}                   If the scale is not defined.
 *  @throws   {Error}                   If the scale is equal to 0.
 *  @throws   {Error}                   If the currency is not defined.
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 *  @since    1.0.0
 */
var checkObject = function (amountObject) {

	if (!amountObject.isAmountObject) {
		throw new Error('An amount object is required');
	}

	if (_.isNull(amountObject.preciseValue)) {
		throw new Error('The precise value must be defined');
	}

	if (_.isNull(amountObject.scale)) {
		throw new Error('The scale must be defined');
	}

	if (amountObject.scale === 0) {
		throw new Error('The scale must be different than 0');
	}

	if (_.isNull(amountObject.currency)) {
		throw new Error('The currency must be defined');
	}

};

module.exports.checkObject = checkObject;

/**
 *  Compare the scale of the 2 Amount object in arguments and align to the most restricting one.
 *
 *  @param    {Amount}    a  The first Amount to compare the scale.
 *  @param    {Amount}    b  The second Amount to compare the scale.
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 *  @since    1.0.0
 */
var alignScale = function (a, b) {

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

};

module.exports.alignScale = alignScale;

/**
 *  Factorize the preparation of the Addition or Subtraction operations.
 *
 *  @param    {Amount}    currentAmount  The current Amount.
 *  @param    {Amount}    otherAmount    The Amount to add or subtract.
 *  @param    {String}    operation      The operation 'Add' or 'Sub'.
 *  @return   {Amount}                   The current Amount after operation.
 *
 *  @throws   {Error}                    If something is wrong on the Amount object passed in argument.
 *  @throws   {Error}                    If the currency of both Amount object are not similar.
 *
 *  @access   private
 *  @author   TAurelien
 *  @date     2015-05-02
 *  @version  1.0.0
 *  @since    1.0.0
 */
var makeAddOrSub = function (currentAmount, otherAmount, operation) {

	try {
		checkObject(otherAmount);
	} catch (err) {
		throw err;
	}

	if (_.isNull(currentAmount.currency)) {
		currentAmount.currency = otherAmount.currency;
	}

	if (currentAmount.currency !== otherAmount.currency) {
		throw new Error('The currency of both amount must be similar');
	}

	if (_.isNull(currentAmount.preciseValue)) {
		currentAmount.preciseValue = 0;
	}

	if (_.isNull(currentAmount.scale)) {
		currentAmount.scale = otherAmount.scale;
	}

	// TODO Find how to clone the object
	//var clonedOtherAmount = _.clone(otherAmount, true);
	var clonedOtherAmount = {
		isAmountObject: true,
		preciseValue: otherAmount.preciseValue,
		scale: otherAmount.scale,
		currency: otherAmount.currency
	};

	alignScale(currentAmount, clonedOtherAmount);

	if (operation === 'Add') {
		currentAmount.preciseValue = Math.round(currentAmount.preciseValue + clonedOtherAmount.preciseValue);
	} else {
		currentAmount.preciseValue = Math.round(currentAmount.preciseValue - clonedOtherAmount.preciseValue);
	}

	return currentAmount;

};

module.exports.makeAddOrSub = makeAddOrSub;