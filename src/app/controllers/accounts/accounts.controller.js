/** @module Accounts controller */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('Accounts Ctrl');
var path = require('path');
var _ = require('lodash');
var Account = require(path.join(global.app.paths.modelsDir, './account.model'));

// Private functions ==========================================================

/**
 * Check the http request body and set the account fields from request values.
 *
 * @param  {Object} requestBody The body of the http request.
 * @param  {Object} account     An instance of the mongoose schema model of account.
 */
function setAccountFields(requestBody, account) {

	if (_.isUndefined(requestBody) | _.isNull(requestBody)) return;
	if (_.isUndefined(account) | _.isNull(account)) return;

	if (requestBody.generalLedger) {
		account.generalLedger = requestBody.generalLedger;
	}
	if (requestBody.name) {
		account.name = requestBody.name;
	}
	if (requestBody.description) {
		account.description = requestBody.description;
	}
	if (requestBody.type) {
		account.type = requestBody.type;
	}
	if (requestBody.code) {
		account.code = requestBody.code;
	}
	if (requestBody.commodity) {
		account.commodity = requestBody.commodity;
	}
	if (requestBody.placeholder) {
		account.placeholder = requestBody.placeholder;
	}
	if (requestBody.closed) {
		account.closed = requestBody.closed;
	}
	if (requestBody.parent) {
		account.parent = requestBody.parent;
	}

}

/**
 * Check the filter part of the query extracted from the request and return the conditions object to be passed in the mongoose method.
 *
 * @param  {String} filter The string extract from request query 'filter'.
 *
 * @return {Object}        The conditions object expected by mongoose.
 */
function getConditions(filter) {

	var conditions = {};

	if (filter.indexOf('onlyOpen') > -1) conditions.closed = false;
	if (filter.indexOf('onlyClosed') > -1) conditions.closed = true;
	if (filter.indexOf('asset') > -1) conditions.type = 'asset';
	if (filter.indexOf('liability') > -1) conditions.type = 'liability';
	if (filter.indexOf('equity') > -1) conditions.type = 'equity';
	if (filter.indexOf('income') > -1) conditions.type = 'income';
	if (filter.indexOf('expense') > -1) conditions.type = 'expense';

	return conditions;

}

/**
 * Check the sort part of the query extracted from the request and return the order object to be passed in the mongoose method.
 *
 * @param  {Object} sort The string extract from request query 'sort'.
 *
 * @return {Object}      The order object expected by mongoose.
 */
function getOrder(sort) {

	var order = {};

	if (sort === 'type') {
		order.type = 'asc';
	}

	if (sort === 'name') {
		order.name = 'asc';
	}

	if (sort === 'code') {
		order.code = 'asc';
	}

	if (sort === 'level') {
		order.level = 'asc';
	}

	return order;

}

/**
 * Check the infoType part of the query extracted from the request and return the fieldSelection object to be passed in the mongoose method.
 *
 * @param  {String} infoType The string extract from request query 'infoType'.
 *
 * @return {Object}          The field selection object expected by mongoose.
 */
function getFieldSelection(infoType) {

	var fieldSelection = {};

	if (infoType === 'simple') {
		fieldSelection.name = 1;
		fieldSelection.type = 1;
		fieldSelection.placeholder = 1;
		fieldSelection.closed = 1;
		fieldSelection.parent = 1;
	}

	return fieldSelection;

}

// Exported functions =========================================================

/**
 * Create a new account.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.create = function (req, res) {

	logger.info('Creating a new account');

	var account = new Account();
	setAccountFields(req.body, account);

	account.save(function (err) {

		if (err) {

			// TODO Check error type
			logger.error('Account creation failed!');
			logger.error(err);
			res.status(400).send(err);

		} else {

			logger.info('Account creation successful');
			res.status(201).json({
				message: 'Account created!'
			});

		}

	});

};

/**
 * Get and send a specific account.
 * The request could have a 'infoType' query with value 'simple' or 'balance'.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.get = function (req, res) {

	logger.info('Getting a specific account');

	var infoType = req.query.infoType;
	var fieldSelection = getFieldSelection(infoType);

	var accountID = req.params.id;

	Account
		.findById(accountID)
		.select(fieldSelection)
		.exec(function (err, account) {

			if (err) {

				// TODO Check error type
				logger.error('Getting the account ' + accountID + ' failed!');
				logger.error(err);
				res.status(400).send(err);

			} else {

				if (_.isNull(account)) {
					logger.warn('No account has been found for id ' + accountID);
				} else {
					logger.info('Success of getting the account ' + accountID);
				}

				if ((infoType === 'balance') && (!_.isNull(account))) {

					account.getBalance(function (err, balance) {

						if (err) {

							// TODO Check error type
							logger.error('Getting the account balance of ' + accountID + ' failed!');
							logger.error(err);
							res.status(400).send(err);

						} else {

							logger.info('Got the account balance of ' + accountID + ' : ' + balance);
							res.status(200).json({
								balance: balance
							});

						}

					});

				} else {

					res.status(200).json(account);

				}

			}

		});

};

/**
 * Get and send an arry of accounts.
 * The request could have a 'infoType' query with value 'simple' or 'full'.
 * The request could have a 'filter' query with concatened values:
 * 'onlyOpen', 'onlyClosed', 'asset', 'liability', 'equity', 'income', 'expense'.
 * The request could have a 'sort' query with value 'type', 'name', 'code' or 'level'.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.list = function (req, res) {

	logger.info('Getting a list of all accounts');

	var conditions = getConditions(req.query.filter);
	var order = getOrder(req.query.sort);
	var fieldSelection = getFieldSelection(req.query.infoType);

	var generalLedgerID = req.query.generalLedger;

	if (_.isEmpty(generalLedgerID) || !_.isString(generalLedgerID)) {

		var err = new Error('Invalid generalledger ID query');
		logger.error('The general ledger ID query of the request is not valid: ' + generalLedgerID);
		logger.error(err);
		// FIXME Error content not sent
		res.status(400).send(err);
		return;

	}

	conditions.generalLedger = generalLedgerID;

	Account
		.find(conditions)
		.sort(order)
		.select(fieldSelection)
		.exec(function (err, accounts) {

			if (err) {

				// TODO Check error type
				logger.error('Getting accounts failed!');
				logger.error(err);
				res.status(400).send(err);

			} else {

				if (_.isNull(accounts)) {
					logger.warn('No account has been found');
				} else {
					logger.info('Success of getting accounts');
				}

				res.status(200).json(accounts);

			}

		});

};

/**
 * Update a specific account.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.update = function (req, res) {

	logger.info('Updating a specific account');

	var accountID = req.params.id;

	Account
		.findById(accountID)
		.exec(function (err, account) {

			if (err) {

				// TODO Check error type
				logger.error('Getting the account ' + accountID + ' to update failed!');
				logger.error(err);
				res.status(400).send(err);

			} else {

				if (_.isNull(account)) {

					logger.warn('No account has been found for id ' + accountID);
					res.status(400).json({
						message: 'Account to update not found'
					});

				} else {

					logger.info('Success of getting the account ' + accountID);

					setAccountFields(req.body, account);

					account.save(function (err) {

						if (err) {

							// TODO Check error type
							logger.error('Saving the updated account ' + accountID + ' failed!');
							logger.error(err);
							res.status(400).send(err);

						} else {

							logger.info('The account ' + accountID + ' has been successfully updated');
							res.status(200).json({
								message: 'Account updated!'
							});

						}

					});

				}

			}

		});

};

/**
 * Delete a specific account.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.delete = function (req, res) {

	logger.info('Deleting a specific account');

	var accountID = req.params.id;
	var conditions = {
		_id: accountID
	};

	Account
		.remove(conditions)
		.exec(function (err) {

			if (err) {

				// TODO Check error type
				logger.error('Deleting the account ' + accountID + ' failed!');
				logger.error(err);
				res.status(400).send(err);

			} else {

				logger.info('The account ' + accountID + ' has been successfully deleted');
				res.status(200).json({
					message: 'Account deleted!'
				});

			}

		});

};