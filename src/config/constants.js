/** @module Constants */
'use strict';

var _ = require('lodash');

function extractConstantCodesAsArray(constantsArray) {
	var returnedArray = [];
	_.forEach(constantsArray, function (item) {
		returnedArray.push(item.code);
	});
	return returnedArray;
}

var constants = {};

constants.accountTypes = require('../../data/accountTypes.json');
constants.accountTypeAsArray = extractConstantCodesAsArray(constants.accountTypes);

constants.currencies = require('../../data/currencies.json');
currenciesAsArray = extractConstantCodesAsArray(constants.currencies);

module.exports = constants;