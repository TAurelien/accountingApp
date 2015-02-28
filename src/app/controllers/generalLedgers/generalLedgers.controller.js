/** @module General Ledger controller */
'use strict';

var logger = require(process.env.LOGGER)('General Ledger Ctrl');


var GeneralLedger = require('../../models/generalLedger.model');

var _ = require('lodash');



exports.create = function(req, res) {

	logger.debug('Creating a new general ledger');

	var generalLedger = new GeneralLedger();

	generalLedger.save(function(err) {

		if (err) {

			logger.error('General ledger creation failed!');
			res.send(err); // TODO Check error type

		} else {

			logger.info('General ledger creation successful');
			res.json({ message: 'General ledger created!' });

		}

	});

};

exports.get = function(req, res) {

	logger.debug('Getting a specific general ledger');

	var fieldSelection = {};

	var generalLedgerInfoType = req.query.generalLedgerInfoType;

	var generaleLedgerID = req.params.id;

	GeneralLedger.findById(generaleLedgerID, fieldSelection, function(err, generalLedger) {

		if (err){

			logger.error('Getting the general ledger ' + generaleLedgerID + ' failed!');
			res.send(err); // TODO Check error type

		} else {

			if (_.isNull(generalLedger)){
				logger.warn('No general ledger has been found for id ' + generaleLedgerID);
			}else {
				logger.info('Success of getting the general ledger ' + generaleLedgerID);
			}

			if (generalLedgerInfoType === 'netWorth'){

				generalLedger.getNetWorth(function(err, netWorth) {
					
					if (err){

						logger.error('Getting the net worth of the general ledger ' + generaleLedgerID + ' failed!');
						res.send(err); // TODO Check error type

					} else {

						res.json({
							netWorth : netWorth
						});

					}

				});

			} else {

				res.json(generalLedger);

			}

		}

	});

};

exports.list = function(req, res) {

	logger.debug('Getting a list of all general ledgers');

	res.json({ message: 'Not yet implemented' });

};

exports.update = function(req, res) {

	logger.debug('Updating a specific general ledger');

	res.json({ message: 'Not yet implemented' });

};

exports.delete = function(req, res) {

	logger.debug('Deleting a specific general ledger');

	res.json({ message: 'Not yet implemented' });

};