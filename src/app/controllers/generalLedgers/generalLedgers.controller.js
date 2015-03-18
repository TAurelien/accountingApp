/** @module General Ledger controller */
'use strict';

// Module dependencies ========================================================
var logger = require(global.app.logger)('General Ledger Ctrl');
var path = require('path');
var _ = require('lodash');
var GeneralLedger = require(path.join(global.app.paths.modelsDir, './generalLedger.model'));

// Exported functions =========================================================

/**
 * Create a new General Ledger.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.create = function (req, res) {

	logger.info('Creating a new general ledger');

	var generalLedger = new GeneralLedger();

	generalLedger.save(function (err) {

		if (err) {

			logger.error('General ledger creation failed!');
			res.status(400).send(err); // TODO Check error type

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
 * The request could have a infoType query with value 'netWorth' to return only the nbet worth of the account.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.get = function (req, res) {

	logger.info('Getting a specific general ledger');

	var fieldSelection = {};

	// TODO (1) Change the query name to 'infoType' instead of 'generalLedgerInfoType'
	var generalLedgerInfoType = req.query.generalLedgerInfoType;

	var generaleLedgerID = req.params.id;

	GeneralLedger.findById(generaleLedgerID, fieldSelection, function (err, generalLedger) {

		if (err) {

			logger.error('Getting the general ledger ' + generaleLedgerID + ' failed!');
			res.status(400).send(err); // TODO Check error type

		} else {

			if (_.isNull(generalLedger)) {

				logger.warn('No general ledger has been found for id ' + generaleLedgerID);
				res.status(400);

			} else {

				logger.info('Success of getting the general ledger ' + generaleLedgerID);
				res.status(200);

			}

			if ((generalLedgerInfoType === 'netWorth') && (_.isNull(generalLedger))) {

				generalLedger.getNetWorth(function (err, netWorth) {

					if (err) {

						logger.error('Getting the net worth of the general ledger ' + generaleLedgerID + ' failed!');
						res.status(400).send(err); // TODO Check error type

					} else {

						logger.info('Got the general ledger net worth of ' + generaleLedgerID + ' : ' + netWorth);

						res.status(200).json({
							netWorth: netWorth
						});

					}

				});

			} else {

				res.json(generalLedger);

			}

		}

	});

};

/**
 * Get and send an array of all general ledger.
 *
 * @param  {Object} req The http request.
 * @param  {Object} res The http response.
 */
exports.list = function (req, res) {

	logger.info('Getting a list of all general ledgers');

	// TODO (1) Implement the list function of the general ledger controller

	res.status(501).json({
		message: 'Not yet implemented'
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

	// TODO (1) Implement the update function of the general ledger controller

	res.status(501).json({
		message: 'Not yet implemented'
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

	// TODO (1) Implement the delete function of the general ledger controller

	res.status(501).json({
		message: 'Not yet implemented'
	});

};