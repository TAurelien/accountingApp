/** @module Accounts controller */
'use strict';


// Module dependencies ========================================================
var logger  = require(process.env.LOGGER)('Accounts Ctrl');
var _       = require('lodash');
var Account = require('../../models/account.model');


// Private functions ==========================================================

/**
 * Check the http request and set the account fields from request values.
 *
 * @param  {Object} req     The http request.
 * @param  {Object} account The mongoose schema model of account.
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
 * Check the filter part of the query extracted from the request and return the conditions object to be passed in the find method of mongoose.
 *
 * @param  {String} filter The string extract from request query 'filter'.
 *
 * @return {Object}               The conditions object expected by mongoose.
 */
function getAccountFilterQuery(filter){

	var conditions = {};

	if (filter.indexOf('onlyOpen') > -1)   conditions.closed = false;
	if (filter.indexOf('onlyClosed') > -1) conditions.closed = true;
	if (filter.indexOf('asset') > -1)      conditions.type = 'asset';
	if (filter.indexOf('liability') > -1)  conditions.type = 'liability';
	if (filter.indexOf('equity') > -1)     conditions.type = 'equity';
	if (filter.indexOf('income') > -1)     conditions.type = 'income';
	if (filter.indexOf('expense') > -1)    conditions.type = 'expense';

	return conditions;

}


// Exported functions =========================================================

/**
 * Create a new account.
 *
 * @param  {Object} req The http request
 * @param  {Object} res The http response
 */
exports.create = function(req, res) {

	logger.debug('Creating a new account');

	var account = new Account();

	setAccountFields(req, account);

	account.save(function(err) {

		if (err) {

			logger.error('Account creation failed!');
			res.send(err); // TODO Check error type

		} else {

			logger.info('Account creation successful');
			res.json({ message: 'Account created!' });

		}

	});

};


/**
 * Get and send a specific account.
 * The request could have a accountInfoType query with value 'simple', 'full' or 'balance'.
 * 
 * @param  {Object} req The http request
 * @param  {Object} res The http response
 */
exports.get = function(req, res) {

	logger.debug('Getting a specific account');

	var fieldSelection = {};

	// TODO Change the query name for 'infoType' instead of 'accountInfoType'
	var accountInfoType = req.query.accountInfoType;
	if (accountInfoType === 'simple'){
		fieldSelection.name = 1;
		fieldSelection.type = 1;
		fieldSelection.placeholder = 1;
		fieldSelection.closed = 1;
		fieldSelection.parent = 1;
	}

	var accountID = req.params.id;

	Account.findById(accountID, fieldSelection, function(err, account) {

		if (err){

			logger.error('Getting the account ' + accountID + ' failed!');
			res.send(err); // TODO Check error type

		} else {

			if (_.isNull(account)){
				logger.warn('No account has been found for id ' + accountID);
			}else {
				logger.info('Success of getting the account ' + accountID);
			}

			if ((accountInfoType === 'balance') && (!_.isNull(account))) {

				account.getBalance(function(err, balance) {

					if (err) {

						logger.error('Getting the account balance ' + accountID + ' failed!');
						res.send(err); // TODO Check error type

					} else {

						// TODO Add a logger
						res.json({ balance : balance });

					}

				});

			} else {

				// TODO Add a logger
				res.json(account);

			}

		}

	});

};


/**
 * Get and send all accounts.
 * The request could have a accountInfoType query with value 'simple' or 'full'.
 * The request could have a accountFilter query with concatened values:
 * 'onlyOpen', 'onlyClosed', 'asset', 'liability', 'equity', 'income', 'expense'.
 * 
 * @param  {Object} req The http request
 * @param  {Object} res The http response
 */
exports.list = function(req, res) {

	logger.debug('Getting a list of all accounts');

	var fieldSelection = {};

	// TODO Change the query name to 'infoType' instead of 'accountInfoType'
	var accountInfoType = req.query.accountInfoType;
	if (accountInfoType === 'simple'){
		fieldSelection.name = 1;
		fieldSelection.type = 1;
		fieldSelection.placeholder = 1;
		fieldSelection.closed = 1;
		fieldSelection.parent = 1;
	}

	// TODO Change the query name to 'filter' instead of 'accountFilter'
	var conditions = getAccountFilterQuery(req.query.accountFilter);

	Account.find(conditions, fieldSelection, function(err, accounts){

		if (err){

			logger.error('Getting all accounts failed!');
			res.send(err); // TODO Check error type

		} else {

			if (_.isNull(accounts)){
				logger.warn('No account has been found');
			}else {
				logger.info('Success of getting all accounts');
			}

			res.json(accounts);

		}

	});

};


/**
 * Update a specific account.
 *
 * @param  {Object} req The http request
 * @param  {Object} res The http response
 */
exports.update = function(req, res) {

	logger.debug('Updating a specific account');

	var accountID = req.params.id;

	Account.findById(accountID, function(err, account) {

		if (err) {

			logger.error('Getting the account ' + accountID + ' to update failed!');
			res.send(err); // TODO Check error type

		} else {

			if (_.isNull(account)){

				logger.warn('No account has been found for id ' + accountID);
				res.json({ message: 'Account to update not found'});

			}else {

				setAccountFields(req, account);

				// TODO Add a logger
				account.save(function(err) {

					if (err) {

						logger.error('Saving the updated account ' + accountID + ' failed!');
						res.send(err); // TODO Check error type

					} else {

						logger.info('The account ' + accountID + ' has been successfully updated');
						res.json({ message: 'Account updated!' });

					}

				});

			}

		}

	});

};


/**
 * Delete a specific account
 *
 * @param  {Object} req The http request
 * @param  {Object} res The http response
 */
exports.delete = function(req, res) {

	logger.debug('Deleting a specific account');

	var accountID = req.params.id;

	Account.remove({ _id: accountID }, function(err) {

		if (err) {

			logger.error('Deleting the account ' + accountID + ' failed!');
			res.send(err); // TODO Check error type

		} else {

			logger.info('The account '+ accountID + ' has been successfully deleted');
			res.json({ message: 'Account deleted!' });

		}

	});

};