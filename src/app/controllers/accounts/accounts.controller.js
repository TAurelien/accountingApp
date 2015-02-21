/** @module Accounts controller */
'use strict';

var logger = require(process.env.LOGGER)('Accounts Ctrl');


var Account = require('../../models/account.model');

var _ = require('lodash');


/**
 * Check the http request and set the account fields from request values
 *
 * @param  Object req The http request
 * @param  Object account The mongoose schema model of account
 */
function setAccountFields(req, account) {

	if (_.isUndefined(req) | _.isNull(req)) return;
	if (_.isUndefined(account) | _.isNull(account)) return;

	if (req.body.name) {
		account.name         = req.body.name;
	}
	if (req.body.description) {
		account.description  = req.body.description;
	}
	if (req.body.type) {
		account.type         = req.body.type;
	}
	if (req.body.code) {
		account.code         = req.body.code;
	}
	if (req.body.commodity) {
		account.commodity    = req.body.commodity;
	}
	if (req.body.balance) {
		account.balance      = req.body.balance;
	}
	if (req.body.placeholder) {
		account.placeholder  = req.body.placeholder;
	}
	if (req.body.closed) {
		account.closed       = req.body.closed;
	}
	if (req.body.parent) {
		account.parent       = req.body.parent;
	}

}


/**
 * Create a new account
 *
 * @param  Object req The http request
 * @param  Object res The http response
 */
exports.create = function(req, res) {

	logger.debug('Creating a new account');

	var account = new Account();

	setAccountFields(req, account);

	account.save(function(err) {

		if (err) {
			logger.error('Account creation failed!');
			res.send(err);
		}

		logger.info('Account creation successful');

		res.json({ message: 'Account created!' });

	});


};


/**
 * Get and send a specific account
 *
 * @param  Object req The http request
 * @param  Object res The http response
 */
exports.get = function(req, res) {

	logger.debug('Getting a specific account');

	var accountID = req.params.id;

	Account.findById(accountID, function(err, account) {

		if (err){
			logger.error('Getting the account ' + accountID + ' failed!');
			res.send(err);
		}

		// TODO Check if account is null
		logger.info('Success of getting the account ' + accountID);

		res.json(account);

	});

};


/**
 * Get and send all accounts
 *
 * @param  Object req The http request
 * @param  Object res The http response
 */
exports.list = function(req, res) {

	logger.debug('Getting a list of all accounts');

	Account.find(function(err, accounts){
		if (err){
			logger.error('Getting all accounts failed!');
			res.send(err);
		}

		// TODO Check if accounts is null
		logger.info('Success of getting all accounts');

		res.json(accounts);

	});

};


/**
 * Update a specific account
 *
 * @param  Object req The http request
 * @param  Object res The http response
 */
exports.update = function(req, res) {

	logger.debug('Updating a specific account');

	var accountID = req.params.id;

	Account.findById(accountID, function(err, account) {

		if (err) {
			logger.error('Getting the account ' + accountID + ' to update failed!');
			res.send(err);
		}

		setAccountFields(req, account);

		// TODO Check if account is null
		account.save(function(err) {

			if (err) {
				logger.error('Saving the updated account ' + accountID + ' failed!');
				res.send(err);
			}

			logger.info('The account ' + accountID + ' has been successfully updated');

			res.json({ message: 'Account updated!' });

		});

	});


};


/**
 * Delete a specific account
 *
 * @param  Object req The http request
 * @param  Object res The http response
 */
exports.delete = function(req, res) {

	logger.debug('Deleting a specific account');

	var accountID = req.params.id;

	Account.remove({
		_id: accountID
	}, function(err) {
		if (err) {
			logger.error('Deleting the account ' + accountID + ' failed!');
			res.send(err);
		}

		logger.info('The account '+ accountID + ' has been successfully deleted');

		res.json({ message: 'Account deleted!' });

	});

};