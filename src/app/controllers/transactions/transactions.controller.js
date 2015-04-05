/** @module Transactions controller */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('Transactions Ctrl');
var path = require('path');
var _ = require('lodash');
var Transaction = require(path.join(global.app.paths.modelsDir,
	'./transaction.model'));

// Private functions ==========================================================

/**
 * Check the http request body and set the transaction fields from request values.
 *
 * @param  {Object} requestBody The body of the http request.
 * @param  {Object} account     An instance of the mongoose schema model of transaction.
 */
function setTransactionFields(requestBody, transaction) {

	if (_.isUndefined(requestBody) | _.isNull(requestBody)) return;
	if (_.isUndefined(transaction) | _.isNull(transaction)) return;

	if (requestBody.description) {
		transaction.description = requestBody.description;
	}
	if (requestBody.valueDate) {
		transaction.valueDate = requestBody.valueDate;
	}
	if (requestBody.splits) {
		transaction.splits = requestBody.splits;
	}

}

/**
 * Check the filter part of the query extracted from the request and return the conditions object to be passed in the find method of mongoose.
 *
 * @param  {String} filter The string extract from request query 'filter'.
 *
 * @return {Object}        The conditions object expected by mongoose.
 */
function getConditions(filter) {

	var conditions = {};

	// TODO Explore http request to find a way to pass key/value on a single query
	// TODO Explore the Query object of Mongoose
	// TODO Add a filter for a given time period
	// TODO Add an option to get transaction from account childs as well

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

	if (sort !== 'asc' && sort !== 'desc') {
		sort = 'asc';
	}
	order.valueDate = sort;

	return order;

}

/**
 * Check the infoType part of the query extracted from the request and return the fieldSelection object to be passed in the find method of mongoose.
 *
 * @param  {String} infoType The string extract from request query 'infoType'.
 *
 * @return {Object}          The field selection object expected by mongoose.
 */
function getFieldSelection(infoType) {

	var fieldSelection = {};

	if (infoType === 'simple') {
		fieldSelection.valueDate = 1;
		fieldSelection.splits = 1;
	}

	return fieldSelection;

}

// Exported functions =========================================================

/**
 * Create a new transaction.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.create = function (req, res) {

	logger.info('Creating a new transaction');

	var transaction = new Transaction();
	setTransactionFields(req.body, transaction);

	transaction.save(function (err) {

		if (err) {

			// TODO Check error type
			logger.error('Transaction creation failed');
			logger.error(err);
			res.status(400).send(err);

		} else {

			logger.info('Transaction creation successful');
			res.status(201).json({
				message: 'Transaction created!'
			});

		}

	});

};

/**
 * Get and send a specific transaction.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.get = function (req, res) {

	logger.info('Getting a specific transaction');

	var infoType = req.query.infoType;
	var fieldSelection = getFieldSelection(infoType);

	var transactionID = req.params.id;

	Transaction
		.findById(transactionID)
		.select(fieldSelection)
		.exec(function (err, transaction) {

			if (err) {

				// TODO Check error type
				logger.error('Getting the transaction ' + transactionID +
					' to update failed!');
				logger.error(err);
				res.status(400).send(err);

			} else {

				if (_.isNull(transaction)) {
					logger.warn('No transaction has been found for id ' + transactionID);
				} else {
					logger.info('Success of getting the transaction ' + transactionID);
				}

				res.status(200).json(transaction);

			}

		});

};

/**
 * Get and send an array of all transaction.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.list = function (req, res) {

	logger.info('Getting a list of all transactions');

	var conditions = getConditions(req.query.filter);
	var order = getOrder(req.query.sort);
	var fieldSelection = getFieldSelection(req.query.infoType);

	var accountID = req.query.account;

	if (_.isEmpty(accountID) || !_.isString(accountID)) {

		var err = new Error('Invalid account ID query');
		logger.error('The account ID query of the request is not valid: ' + accountID);
		logger.error(err);
		// FIXME Error content not sent
		res.status(400).send(err);
		return;

	}

	conditions.splits = {
		$elemMatch: {
			account: accountID
		}
	};

	Transaction
		.find(conditions)
		.sort(order)
		.select(fieldSelection)
		.exec(function (err, transactions) {

			if (err) {

				// TODO Check error type
				logger.error('Getting all transactions failed!');
				logger.error(err);
				res.status(400).send(err);

			} else {

				if (_.isNull(transactions)) {
					logger.warn('No transaction has been found');
				} else {
					logger.info('Success of getting all transactions');
				}

				res.status(200).json(transactions);

			}

		});

};

/**
 * Update a specific transaction.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.update = function (req, res) {

	logger.info('Updating a specific transaction');

	var transactionID = req.params.id;

	Transaction
		.findById(transactionID)
		.exec(function (err, transaction) {

			if (err) {

				// TODO Check error type
				logger.error('Getting the transaction ' + transactionID +
					' to update failed!');
				logger.error(err);
				res.status(400).send(err);

			} else {

				if (_.isNull(transaction)) {

					logger.warn('No transaction has been found for id ' + transactionID);
					res.status(400).json({
						message: 'Transaction to update not found'
					});

				} else {

					logger.info('Success of getting the transaction ' + transactionID);

					setTransactionFields(req.body, transaction);

					transaction.save(function (err) {

						if (err) {

							// TODO Check error type
							logger.error('Saving the updated transaction ' + transactionID +
								' failed!');
							logger.error(err);
							res.status(400).send(err);

						} else {

							logger.info('The transaction ' + transactionID +
								' has been successfully updated');
							res.status(200).json({
								message: 'Transaction updated!'
							});

						}

					});

				}

			}

		});

};

/**
 * Delete a specific transaction.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.delete = function (req, res) {

	logger.info('Deleting a specific transaction');

	var transactionID = req.params.id;
	var conditions = {
		_id: transactionID
	};

	Transaction
		.remove(conditions)
		.exec(function (err) {

			if (err) {

				// TODO Check error type
				logger.error('Deleting the transaction ' + transactionID + ' failed!');
				logger.error(err);
				res.status(400).send(err);

			} else {

				logger.info('The transaction ' + transactionID +
					' has been successfully deleted');
				res.status(200).json({
					message: 'Transaction deleted!'
				});

			}

		});

};