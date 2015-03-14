/** @module Transactions controller */
'use strict';


// Module dependencies ========================================================
var logger      = require(global.app.logger)('Transactions Ctrl');
var path        = require('path');
var _           = require('lodash');
var Transaction = require(path.join(global.app.paths.modelsDir, './transaction.model'));

// Private functions ==========================================================

function setTransactionFields(req, transaction) {

	if (_.isUndefined(req) | _.isNull(req)) return;
	if (_.isUndefined(transaction) | _.isNull(transaction)) return;

	if (req.body.description) {
		transaction.description = req.body.description;
	}
	if (req.body.valueDate) {
		transaction.valueDate   = req.body.valueDate;
	}
	if (req.body.splits) {
		transaction.splits      = req.body.splits;
	}

}

// Exported functions =========================================================

/**
 * Create a new transaction.
 *
 * @param  {Object} req The http request
 * @param  {Object} res The http response
 */
exports.create = function(req, res) {

	logger.info('Creating a new transaction');

	var transaction = new Transaction();

	setTransactionFields(req, transaction);

	transaction.save(function(err) {

		if (err) {

			logger.error('Transaction creation failed');
			res.send(err); // TODO Check error type

		} else {

			logger.info('Transaction creation successful');
			res.json({ message: 'Transaction created!' });

		}

	});

};


/**
 * Get and send a specific transaction.
 *
 * @param  {Object} req The http request
 * @param  {Object} res The http response
 */
exports.get = function(req, res) {

	logger.info('Getting a specific transaction');

	res.json({ message: 'Not yet implemented' });


};


/**
 * Get and send an array of all transaction.
 *
 * @param  {Object} req The http request
 * @param  {Object} res The http response
 */
exports.list = function(req, res) {

	logger.info('Getting a list of all transactions');

	res.json({ message: 'Not yet implemented' });

};


/**
 * Update a specific transaction.
 *
 * @param  {Object} req The http request
 * @param  {Object} res The http response
 */
exports.update = function(req, res) {

	logger.info('Updating a specific transaction');

	res.json({ message: 'Not yet implemented' });

};


/**
 * Delete a specific transaction.
 *
 * @param  {Object} req The http request
 * @param  {Object} res The http response
 */
exports.delete = function(req, res) {

	logger.info('Deleting a specific transaction');

	res.json({ message: 'Not yet implemented' });

};