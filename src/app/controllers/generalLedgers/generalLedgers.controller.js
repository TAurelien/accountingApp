/** @module General Ledger controller */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('General Ledger Ctrl');
var path = require('path');
var _ = require('lodash');
var GeneralLedger = require(path.join(global.app.paths.modelsDir, './generalLedger.model'));

// Private functions ==========================================================

/**
 * Check the http request body and set the general ledger fields from request values.
 *
 * @param {Object} requestBody   The body of the http request.
 * @param {Object} generalLedger An instance of the mongoose schema model of general ledger.
 */
function setGeneralLedgerFields(requestBody, generalLedger) {

	if (_.isUndefined(requestBody) | _.isNull(requestBody)) return;
	if (_.isUndefined(generalLedger) | _.isNull(generalLedger)) return;

	if (requestBody.name) {
		generalLedger.name = requestBody.name;
	}

	if (requestBody.description) {
		generalLedger.description = requestBody.description;
	}

	if (requestBody.closed) {
		generalLedger.closed = requestBody.closed;
	}

	if (requestBody.settings) {
		generalLedger.settings = requestBody.settings;
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

	if (sort === 'name') {
		order.name = 'asc';
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
		fieldSelection.closed = 1;
	}

	return fieldSelection;

}

// Exported functions =========================================================

/**
 * Create a new general Ledger.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.create = function (req, res) {

	logger.info('Creating a new general ledger');

	var generalLedger = new GeneralLedger();
	setGeneralLedgerFields(req.body, generalLedger);

	generalLedger.save(function (err) {

		if (err) {

			// TODO Check error type
			logger.error('General ledger creation failed!');
			logger.error(err);
			res.status(400).send(err);

		} else {

			logger.info('General ledger creation successful');
			res.status(201).json({
				message: 'General ledger created!'
			});

		}

	});

};

/**
 * Get and send a specific general ledger.
 * The request could have a 'infoType' query with value 'simple' or 'netWorth' to return only the net worth of the general ledger.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.get = function (req, res) {

	logger.info('Getting a specific general ledger');

	var infoType = req.query.infoType;
	var fieldSelection = getFieldSelection(infoType);

	var generaleLedgerID = req.params.id;

	GeneralLedger
		.findById(generaleLedgerID)
		.select(fieldSelection)
		.exec(function (err, generalLedger) {

			if (err) {

				// TODO Check error type
				logger.error('Getting the general ledger ' + generaleLedgerID + ' failed!');
				logger.error(err);
				res.status(400).send(err);

			} else {

				if (_.isNull(generalLedger)) {
					logger.warn('No general ledger has been found for id ' + generaleLedgerID);
				} else {
					logger.info('Success of getting the general ledger ' + generaleLedgerID);
				}

				if ((infoType === 'netWorth') && (!_.isNull(generalLedger))) {

					generalLedger.getNetWorth(function (err, netWorth) {

						if (err) {

							// TODO Check error type
							logger.error('Getting the net worth of the general ledger ' + generaleLedgerID + ' failed!');
							logger.error(err);
							res.status(400).send(err);

						} else {

							logger.info('Got the general ledger net worth of ' + generaleLedgerID + ' : ' + netWorth);
							res.status(200).json({
								netWorth: netWorth
							});

						}

					});

				} else {

					res.status(200).json(generalLedger);

				}

			}

		});

};

/**
 * Get and send an array of general ledgers.
 * The request could have a 'infoType' query with value 'simple'.
 * The request could have a 'filter' query with concatened values:
 * 'onlyOpen', 'onlyClosed'.
 * The request could have a 'sort' query with value 'name'.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.list = function (req, res) {

	logger.info('Getting a list of all general ledgers');

	var conditions = getConditions(req.query.filter);
	var order = getOrder(req.query.sort);
	var fieldSelection = getFieldSelection(req.query.infoType);

	GeneralLedger
		.find(conditions)
		.sort(order)
		.select(fieldSelection)
		.exec(function (err, generalLedgers) {

			if (err) {

				// TODO Check error type
				logger.error('Getting general ledgers failed!');
				logger.error(err);
				res.status(400).send(err);

			} else {

				if (_.isNull(generalLedgers)) {
					logger.warn('No general ledger has been found');
				} else {
					logger.info('Success of getting general ledgers');
				}

				res.status(200).json(generalLedgers);

			}

		});

};

/**
 * Update a specific general ledger.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.update = function (req, res) {

	logger.info('Updating a specific general ledger');

	var generaleLedgerID = req.params.id;

	GeneralLedger
		.findById(generaleLedgerID)
		.exec(function (err, generalLedger) {

			if (err) {

				// TODO Check error type
				logger.error('Getting the general ledger ' + generaleLedgerID + ' to update failed!');
				logger.error(err);
				res.status(400).send(err);

			} else {

				if (_.isNull(generalLedger)) {

					logger.warn('No general ledger has been found for id ' + generaleLedgerID);
					res.status(400).json({
						message: 'General ledger to update not found'
					});

				} else {

					logger.info('Success of getting the general ledger ' + generaleLedgerID);

					setGeneralLedgerFields(req.body, generalLedger);

					generalLedger.save(function (err) {

						if (err) {

							// TODO Check error type
							logger.error('Saving the updated general ledger ' + generaleLedgerID + ' failed!');
							logger.error(err);
							res.status(400).send(err);

						} else {

							logger.info('The general ledger ' + generaleLedgerID + ' has been successfully updated');
							res.status(200).json({
								message: 'General ledger updated!'
							});

						}

					});

				}

			}

		});

};

/**
 * Delete a specific general ledger.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.delete = function (req, res) {

	logger.info('Deleting a specific general ledger');

	var generaleLedgerID = req.params.id;
	var conditions = {
		_id: generaleLedgerID
	};

	GeneralLedger
		.remove(conditions)
		.exec(function (err) {

			if (err) {

				// TODO Check error type
				logger.error('Deleting the general ledger ' + generaleLedgerID + ' failed!');
				logger.error(err);
				res.status(400).send(err);

			} else {

				logger.info('The general ledger ' + generaleLedgerID + ' has been successfully deleted');
				res.status(200).json({
					message: 'General ledger deleted!'
				});

			}

		});

};