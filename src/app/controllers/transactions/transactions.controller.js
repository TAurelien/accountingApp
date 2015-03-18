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
 * Check the http request and set the transaction fields from request values.
 *
 * @param  {Object} req     The http request.
 * @param  {Object} account An instance of the mongoose schema model of transaction.
 */
function setTransactionFields(req, transaction) {

	if (_.isUndefined(req) | _.isNull(req)) return;
	if (_.isUndefined(transaction) | _.isNull(transaction)) return;

	if (req.body.description) {
		transaction.description = req.body.description;
	}
	if (req.body.valueDate) {
		transaction.valueDate = req.body.valueDate;
	}
	if (req.body.splits) {
		transaction.splits = req.body.splits;
	}

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

	setTransactionFields(req, transaction);

	transaction.save(function (err) {

		if (err) {

			logger.error('Transaction creation failed');
			res.status(400).send(err); // TODO Check error type

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

	var transactionID = req.params.id;

	Transaction
		.findById(transactionID)
		.exec(function (err, transaction) {

			if (err) {

				logger.error('Getting the transaction ' + transactionID +
					' to update failed!');
				res.status(400).send(err); // TODO Check error type

			} else {

				if (_.isNull(transaction)) {

					logger.warn('No transaction has been found for id ' + transactionID);
					res.status(400).json({
						message: 'Transaction not found'
					});

				} else {

					logger.info('Success of getting the transaction ' + transactionID);
					res.status(200).json(transaction);

				}

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

	// TODO Add a filter
	// TODO Add a filter for a given time period
	// TODO Add an option to get transaction from account childs as well

	var conditions = {};
	var fieldSelection = {};

	var accountID = req.query.account;

	conditions.splits = {
		$elemMatch: {
			account: accountID
		}
	};

	var sortDate = req.query.sort;
	if (sortDate !== 'asc' && sortDate !== 'desc') {
		sortDate = 'asc';
	}

	Transaction
		.find(conditions)
		.sort({
			valueDate: sortDate
		})
		.select(fieldSelection)
		.exec(function (err, transactions) {

				if (err) {

					logger.error('Getting all transactions failed!');
					res.status(400).send(err); // TODO Check error type

				} else {

					if (_.isNull(transactions)) {

						logger.warn('No transaction has been found');
						res.status(400);

					} else {

						logger.info('Success of getting all transactions');
						res.status(200);

					}

					res.json(transactions);

				}

			}

		);

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

				logger.error('Getting the transaction ' + transactionID +
					' to update failed!');
				res.status(400).send(err); // TODO Check error type

			} else {

				if (_.isNull(transaction)) {

					logger.warn('No transaction has been found for id ' + transactionID);
					res.status(400).json({
						message: 'Transaction to update not found'
					});

				} else {

					setTransactionFields(req, transaction);

					logger.info('Success of getting the transaction ' + transactionID);

					transaction.save(function (err) {

						if (err) {

							logger.error('Saving the updated transaction ' + transactionID +
								' failed!');
							res.status(400).send(err); // TODO Check error type

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

	Transaction
		.remove({
			_id: transactionID
		})
		.exec(function (err) {

			if (err) {

				logger.error('Deleting the transaction ' + transactionID + ' failed!');
				res.status(400).send(err); // TODO Check error type

			} else {

				logger.info('The transaction ' + transactionID +
					' has been successfully deleted');
				res.status(200).json({
					message: 'Transaction deleted!'
				});

			}

		});

};